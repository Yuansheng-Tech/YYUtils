import ts from 'typescript';

type TypeCacheRecord = {
  kind: ts.SyntaxKind;
  aliasedTo: ts.SyntaxKind;
  node: ts.Node;
};
type Types = Record<string, TypeCacheRecord>;

/**
 * Gathers all interfaces and types references ahead of time so that when interface properties reference them then we
 * can know their type.
 *
 * @param sourceFile TypeScript AST object compiled from file data
 */
export function gatherTypes(file) {
  const sourceFile: ts.SourceFile | ts.ModuleBlock = ts.createSourceFile(
    'x.ts',
    require(file),
    ts.ScriptTarget.ES2015,
    true
  );
  const types: Types = {};
  let modulePrefix = '';

  const processNode = (node: ts.Node | ts.ModuleBlock) => {
    const name = (node as ts.DeclarationStatement).name;
    const text = name ? name.text : '';

    // Process declared namespaces and modules
    if (node.kind === ts.SyntaxKind.ModuleDeclaration) {
      modulePrefix = text;
      if ((node as ts.ModuleDeclaration).body) {
        processNode((node as ts.ModuleDeclaration).body!);
      }

      return;
    }

    let aliasedTo;

    if ((node as ts.TypeAliasDeclaration).type) {
      aliasedTo = (node as ts.TypeAliasDeclaration).type.kind;
    } else {
      aliasedTo = node.kind;
    }

    if (modulePrefix) {
      types[`${modulePrefix}.${text}`] = { kind: node.kind, aliasedTo, node };
    }
    types[text] = { kind: node.kind, aliasedTo, node };

    ts.forEachChild(node, processNode);
  };

  processNode(sourceFile);

  return types;
}

/** Intermock general options */
export type OutputType = 'object' | 'json' | 'string';
type SupportedLanguage = 'typescript';
export interface Options {
  // Array of file tuples. (filename, data)
  files?: Array<[string, string]>;

  // TypeScript is currently the only supported language
  language?: SupportedLanguage;

  // Specific interfaces to write to output
  interfaces?: string[];

  // Used for testing mode,
  isFixedMode?: boolean;

  // One of object|json|string. Strings have their object's functions
  // stringified.
  output?: OutputType;

  // Should optional properties always be enabled
  isOptionalAlwaysEnabled?: boolean;
}

export function mock(options: Options) {
  // const output: Output = {};
  const fileContents = options.files;

  if (!fileContents) {
    return {};
  }

  const types = fileContents.reduce((sum, f) => {
    const type = gatherTypes(ts.createSourceFile(f[0], f[1], ts.ScriptTarget.ES2015, true));
    return { ...sum, ...type };
  }, {} as Types);

  return types;
}

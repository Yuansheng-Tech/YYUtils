import _mapValues from 'lodash.mapvalues';

export const dataMapKeys = (data, keys) => {
  return data.map((v) => {
    const result = {};
    _mapValues(keys, (val, key) => {
      result[key] = v[val];
    });
    return {
      ...v,
      ...result,
    };
  });
};

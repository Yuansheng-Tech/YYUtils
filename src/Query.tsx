import { FunctionComponent } from 'react';
import { useQuery } from './useQuery';

export interface ChildrenFuncParams {
  data?: any;
  page?: {
    count: number;
  };
  statusCode?: number;
  message?: string;

  loading?: boolean;
  loaded?: boolean;
  error?: any;
}

interface Props {
  children: (params: ChildrenFuncParams) => JSX.Element | null;
  url: string;
  method?: string; // keyof Taro.request.method | undefined;
  body?: any;
  options?: any;
}

/**
 * Fetch the data provider and pass the result to a child function
 *
 * @example
 *   const UserProfile = ({ record }) => (
 *     <Query method="getOne" url="users" body={{ id: record.id }}>
 *       {({ data, loading, error }) => {
 *         if (loading) {
 *           return <Loading />;
 *         }
 *         if (error) {
 *           return <p>ERROR</p>;
 *         }
 *         return <div>User {data.username}</div>;
 *       }}
 *     </Query>
 *   );
 *
 * @example
 *   const data = {
 *     pagination: { page: 1, perPage: 10 },
 *     sort: { field: 'username', order: 'ASC' },
 *   };
 *   const UserList = () => (
 *     <Query method="getList" url="users" body={data}>
 *       {({ data, total, loading, error }) => {
 *         if (loading) {
 *           return <Loading />;
 *         }
 *         if (error) {
 *           return <p>ERROR</p>;
 *         }
 *         return (
 *           <div>
 *             <p>Total users: {total}</p>
 *             <ul>
 *               {data.map((user) => (
 *                 <li key={user.username}>{user.username}</li>
 *               ))}
 *             </ul>
 *           </div>
 *         );
 *       }}
 *     </Query>
 *   );
 *
 * @param {Function} children Must be a function which will be called with an object containing the following keys:
 *   data, loading and error
 * @param {string} method The method called on the data provider, e.g. 'getList', 'getOne'. Can also be a custom method
 *   if the dataProvider supports is.
 * @param {string} url A url name, e.g. 'posts', 'comments'
 * @param {Object} data The data object, e.g; { post_id: 12 }
 * @param {Object} options
 * @param {string} options.action Redux action method
 * @param {Function} options.onSuccess Side effect function to be executed upon success or failure, e.g. { onSuccess:
 *   response => refresh() }
 * @param {Function} options.onFailure Side effect function to be executed upon failure, e.g. { onFailure: error =>
 *   notify(error.message) }
 *
 *   This component also supports legacy side effects (e.g. { onSuccess: { refresh: true } })
 */
export const Query: FunctionComponent<Props> = ({
  children,
  method,
  url,
  body,
  // Provides an undefined onSuccess just so the key `onSuccess` is defined
  // This is used to detect options in useDataProvider
  options = { onSuccess: undefined },
}) => {
  if (!url) {
    return children({});
  }
  return children(useQuery({ method, url, body }, { ...options }));
};

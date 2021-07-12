import fetch from './fetch';
export const fetcher = (
  url: string,
  data: {
    skip?: number;
    take?: number;
    order?: {
      [key: string]: 'ASC' | 'DESC';
    };
  },
  method
) => {
  console.log('url, data, method', url, data, method);
  return fetch({ url, data, method });
};

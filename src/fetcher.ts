import fetch from './fetch';
export const fetcher = (url, data, method) => {
  return fetch({ url, data, method });
};

import fetch from './fetch';

export const fetcher = async (
  url: string = '',
  data: {
    skip?: number;
    take?: number;
    order?: {
      [key: string]: 'ASC' | 'DESC';
    };
  } = {},
  method: keyof Taro.request.method = 'GET'
) => {
  return await fetch({ url, data, method });
};

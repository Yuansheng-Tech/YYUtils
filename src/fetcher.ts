export const fetcher = async (
  url: string = '',
  data: {
    skip?: number;
    take?: number;
    order?: {
      [key: string]: 'ASC' | 'DESC';
    };
  } = {},
  method = 'GET'
) => {
  return await fetch({ url, data, method });
};
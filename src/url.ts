import qs from 'query-string';
import Taro from '@tarojs/taro';

class Url {
  /** 基本路径，可 new 的时候传入 */
  url: string;
  constructor(url = '') {
    if (process.env.TARO_ENV === 'h5') {
      this.url = !url ? window.location.href : url;
    } else {
      this.url = !url ? Taro.getCurrentPages().pop()?.route : url;
    }
  }
  getUrl = () => {
    const params = qs.parseUrl(this.url);
    return params.url;
  };
  /**
   * 获取路径的所有参数
   *
   * @param jsonParse 是否 JSON.parse 参数
   * @returns
   */
  getParams = (jsonParse = false) => {
    const params = qs.parseUrl(this.url);
    const { query = {} } = params;
    const result = query;
    jsonParse &&
      Object.keys(query).map((v) => {
        result[v] = JSON.parse((query[v] || '').toString());
      });
    return result;
  };
  /**
   * 替换 URL 的参数
   *
   * @param params
   * @param data
   * @param title
   * @returns
   */
  replaceParams = (
    params: object,
    data: any = {
      status: 0,
    },
    title: string = ''
  ) => {
    const url = qs.stringifyUrl({
      url: this.url,
      query: {
        ...params,
      },
    });

    return window.history.pushState(data, title, decodeURIComponent(url));
  };

  getPageId = () => {
    const pathname = window.location.pathname;
    const hash = window.location.hash;
    return `${pathname}${hash}`;
  };
}

export default new Url();

import Taro from '@tarojs/taro';
import * as qs from 'qs';
import Cookies from 'js-cookie';
import { getCurrentPageUrl } from './taroTools';

export const HTTP_STATUS = {
  SUCCESS: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NON_AUTHORITATIVE_INFORMATION: 203,
  NO_CONTENT: 204,
  CLIENT_ERROR: 400,
  AUTHENTICATE: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
};

export const REFRESH_STATUS = {
  NORMAL: 0,
  REFRESHING: 1,
  NO_MORE_DATA: 2,
};

export const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};
// require('../../src/baseUrl').URL_API ||
// import * as baseUrl from '../../src/baseUrl'

// const API_URL = baseUrl.URL_API || 'http://api.yuansheng.com';

// console.log('API_URL', API_URL);

// let urlKey = ''
/**
 * Fetch
 *
 * @param url
 * @param options https://taro-docs.jd.com/taro/docs/apis/network/request/request/
 */
export const fetch = (options: {
  url: string;
  data: object | string;
  method: keyof Taro.request.method | undefined;
}) => {
  let { url = '', data, method = 'GET' } = options;
  /** 混存数据获取 进入小程序的时候 判断时间戳，从而判断是否请求数据 */
  // urlKey = `${method} ${API_URL}${url}?${qs.stringify(data)}`;
  // if (method === 'GET' && !!store.get(urlKey)) {
  //   return store.get(urlKey)
  // }

  /** 正常的数据请求 */
  // if (!/^(http|\/\/)/g.test(url)) {
  //   url = `${API_URL}${url}`;
  // }
  if (method.toUpperCase() === 'GET' && typeof data === 'object' && Object.keys(data).length) {
    url = `${url}?${qs.stringify(data)}`;
    data = {};
  } else {
    data = JSON.stringify(data);
  }
  console.log('url data', url, data);
  return Taro.request({
    url,
    // mode: 'no-cors',
    // credentials: 'include',
    data,
    method,
    header: {
      'content-type': 'application/json; charset=utf-8',
      Authorization: `Bearer ${Cookies.get('accessToken') || Taro.getStorageSync('accessToken')}`,
    },
  })
    .then((res) => {
      console.log('res', res);
      return fatchCallback(res);
    })
    .catch((err) => {
      return fatchCallback(err);
    });
};

const fatchCallback = (res) => {
  const {
    status,
    statusText,
    error,
    data: { statusCode, message } = {
      statusCode: '',
      message: '',
    },
  } = res;
  const statusCodeData = statusCode || status;
  const messageData = message || statusText || error;
  console.log('res', res);
  if (!res) {
    Taro.showToast({
      title: '未知错误',
      icon: 'none',
    });
    return {};
  }
  // 保存本地数据
  if (res && statusCodeData === HTTP_STATUS.NOT_FOUND) {
    Taro.showToast({
      title: messageData,
      icon: 'none',
    });
    return {};
  } else if (res && statusCodeData === HTTP_STATUS.BAD_GATEWAY) {
    Taro.showToast({
      title: '服务端出现了问题',
      icon: 'none',
    });
    return {};
  } else if (res && (statusCodeData === HTTP_STATUS.FORBIDDEN || statusCodeData === HTTP_STATUS.AUTHENTICATE)) {
    Taro.showToast({
      title: '没有权限！',
      icon: 'none',
    });
    Taro.setStorageSync('accessToken', '');
    let path = getCurrentPageUrl();
    if (!Taro.getStorageSync('notlogin') && path !== 'subPackages/pages/login/index') {
      // !Taro.getStorageSync("notlogin") &&
      Taro.showToast({
        title: '登录失效，请重新登录',
        icon: 'none',
        duration: 2000,
      }).then((res) => {
        Taro.setStorageSync('notlogin', true);
        // Taro.navigateTo({
        //   url: "/subPackages/pages/login/index"
        // });
      });
    } else {
      // Taro.setStorageSync("notlogin", false);
    }
    return {};
  } else if (res && statusCodeData >= 400) {
    Taro.showToast({
      title: messageData,
      icon: 'none',
    });
    return {};
  } else if (res && statusCodeData >= 200 && statusCodeData < 300) {
    /** 本地缓存 */
    // store.set(urlKey, res.data);
    return res.data;
  }
};

export default fetch;

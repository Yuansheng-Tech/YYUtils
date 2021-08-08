import Taro from './taro';

export function getCurrentPageUrl() {
  let pages = Taro.getCurrentPages();
  let currentPage = pages[pages.length - 1];
  let { route: url } = currentPage;
  return url;
}

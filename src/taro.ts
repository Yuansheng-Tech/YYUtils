let Taro;
if (process.env.TARO_ENV === 'weapp') {
  Taro = require('@tarojs/taro-weapp');
} else if (process.env.TARO_ENV === 'h5') {
  Taro = require('@tarojs/taro-h5'); // 这里可能需要写 require('@tarojs/taro-h5').default
}

export default Taro;

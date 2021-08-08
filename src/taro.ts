let Taro = require('@tarojs/taro');

if (process.env.TARO_ENV === 'h5') {
  Object.assign(Taro, require('@tarojs/taro-h5'));
} else if (process.env.TARO_ENV === 'weapp') {
  Object.assign(Taro, require('@tarojs/taro-weapp'));
}

export default Taro;

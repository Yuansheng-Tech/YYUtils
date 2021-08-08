import React from 'react';
import Taro, { redirectTo } from '@tarojs/taro';
import { Button } from '@tarojs/components';

export const router = {
  navigateTo(object: redirectTo.Option) {
    console.log('process.env.TARO_ENV', process.env.TARO_ENV);
    if (process.env.TARO_ENV === 'h5') {
      location.href = /^(http(s)?:)?\/\//.test(object.url) ? object.url : `/#${object.url}`;
    } else {
      // try {
      //   this.switchTab(object)
      // } catch(err) {
      if (Taro.getCurrentPages().length > 9) {
        Taro.redirectTo(object);
        // this.reLaunch(object)
      } else {
        Taro.navigateTo(object);
      }
      // }
    }
  },
  // 其他跳转不处理
  navigateBack(object: redirectTo.Option) {
    Taro.navigateBack(object);
  },

  switchTab(object: redirectTo.Option) {
    Taro.switchTab(object);
  },

  redirectTo(object: redirectTo.Option) {
    Taro.redirectTo(object);
  },

  reLaunch(object: redirectTo.Option) {
    Taro.reLaunch(object);
  },
};

export const Link = ({ url, text, ...props }) => {
  return (
    <Button
      onClick={() => {
        router.navigateTo({
          url,
        });
      }}
      {...props}
    >
      {text}
    </Button>
  );
};

export default router;

import React from 'react';
import Taro, { redirectTo } from '@tarojs/taro';
import { Button } from '@tarojs/components';

export const router = {
  navigateTo(object: redirectTo.Option) {
    if (process.env.TARO_ENV === 'h5') {
      location.href = /^(http(s)?:)?\/\//.test(object.url) ? object.url : `/#${object.url}`;
    } else {
      if (/^(http(s)?:)?\/\//.test(object.url)) {
        object.url = `/subPackages/pages/webview/index?url=${object.url}`;
      }
      if (Taro.getCurrentPages().length > 9) {
        Taro.redirectTo(object);
      } else {
        Taro.navigateTo(object);
      }
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

/*
 *   Copyright (c) 2020 Fu Yin
 *   All rights reserved.

 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at

 *   http://www.apache.org/licenses/LICENSE-2.0

 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 */

import Taro, { redirectTo } from '@tarojs/taro';
import { Button } from '@tarojs/components';

export const router = {
  navigateTo(object: redirectTo.Option) {
    if (process.env.TARO_ENV === 'h5') {
      location.href = object.url;
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

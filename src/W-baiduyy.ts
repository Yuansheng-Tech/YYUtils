import Taro from './taro';
const audioTeam = [];
let audioStartSwitch = false;
const getAudioUrl = 'https://tsn.baidu.com/text2audio';
/**
 * Copy from https://github.com/HuLuoQian/QS-baiduyy 浏览器调用语音合成接口 请参考 https://ai.baidu.com/docs#/TTS-API/41ac79a6
 * 强烈建议后端访问接口获取token返回给前端 client_id = API Key & client_secret = secret Key 获取token接口:
 * https://openapi.baidu.com/oauth/2.0/token?grant_type=client_credentials&client_id=uFYiXWMCiYvx68V4EVyCGeL8j4GAzXD5&client_secret=897Mm2qCj7bC1eHYVDxaWrO38FscTOHD
 */

function getBDVoicToken() {
  return new Promise((rs, rj) => {
    console.log('准备访问接口获取语音token');
    Taro.request({
      // 强烈建议此接口由后端访问并且维护token有效期，否则前端每次访问都会刷新token
      //此url为专门插件测试预览用的key和secret key， 请替换为自己申请的key
      url: 'https://openapi.baidu.com/oauth/2.0/token',
      method: 'POST', //建议使用post访问
      // data: 'grant_type=client_credentials&client_id=nm6Os9qqOacgxXjKv8PIp45H&client_secret=BXHhGIpNU7Wi3GDYUt0AGY5cWbWklrov',
      data: 'grant_type=client_credentials&client_id=0RG4p2GGmSgf6dsrDpSGZMxV&client_secret=28ZbXQAei8IKOFnVob633AgXCxfcjfR4',
      header: {
        'content-type': 'application/json; charset=utf-8',
        // "content-type": "application/x-www-form-urlencoded"
      },
      success: (res) => {
        console.log('访问成功');
        rs(res);
      },
      fail: (err) => {
        console.log('访问失败');
        rj(err);
      },
    });
  });
}

export function openVoice(objs) {
  // 传入需转为语音的文本内容
  let lineUp = false;
  let returnAudio = false;
  if (typeof objs !== 'string') {
    if (objs && objs.lineUp === true) {
      lineUp = true;
    }
    if (objs && objs.returnAudio === true) {
      returnAudio = true;
    }
  }
  if (returnAudio) {
    return new Promise((resolve, reject) => {
      openVoiceFc(objs, returnAudio)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  if (!audioStartSwitch || lineUp) {
    audioStartSwitch = true;
    return openVoiceFc(objs, false);
  } else {
    return audioTeam.push(objs);
  }
}

function openVoiceFc(objs, returnAudio) {
  console.log('准备获取语音tok');
  if (returnAudio) {
    return new Promise((resolve, reject) => {
      getBDVoicToken()
        .then((res: any) => {
          console.log('获取语音tok接口成功');
          if (res.data && res.data.access_token) {
            console.log('token: ' + res.data.access_token);
            resolve(tts(objs, res.data.access_token, returnAudio));
          } else {
            console.log('获取语音tok接口为空');
            reject('获取语音tok接口为空');
          }
        })
        .catch((err) => {
          console.log('获取语音tok接口失败');
          reject(err || '获取语音tok接口失败');
        });
    });
  } else {
    getBDVoicToken()
      .then((res: any) => {
        console.log('获取语音tok接口成功');
        if (res.data && res.data.access_token) {
          console.log('token: ' + res.data.access_token);
          tts(objs, res.data.access_token, false);
        } else {
          console.log('获取语音tok接口为空');
        }
      })
      .catch((err) => {
        console.log('获取语音tok接口失败');
      });
  }
}

function tts(objs, tok, returnAudio) {
  if (typeof objs == 'string') objs = { voiceSet: { tex: objs } };
  const data = {
    tok,
    cuid: tok,
    ctp: 1,
    lan: 'zh',
    ...objs.voiceSet,
  };
  if (returnAudio) return btts(data, objs.audioSet, objs.audioCallback, objs.lineUp, returnAudio);
  btts(data, objs.audioSet, objs.audioCallback, objs.lineUp, returnAudio);
}

function setAudioSet(options, audio) {
  if (options) {
    audio.volume = options.volume || 1;
    audio.startTime = options.startTime || 0;
    audio.loop = options.loop || false;
    audio.obeyMuteSwitch =
      options.obeyMuteSwitch && typeof options.obeyMuteSwitch == 'boolean' ? options.obeyMuteSwitch : true; //支持微信小程序、百度小程序、头条小程序
  }
}

function btts(param, options, audioCallback, lineUp, returnAudio) {
  let audio = Taro.createInnerAudioContext();
  setAudioSet(options, audio);
  // 序列化参数列表
  let fd = [];
  for (let k in param) {
    fd.push(k + '=' + encodeURIComponent(encodeURIComponent(param[k])));
  }
  audio.src = `${getAudioUrl}?${fd.join('&')}`;

  if (returnAudio) {
    audio.onEnded(() => {
      console.log('音频播放结束');
      console.log('销毁音频实例');
      audio.destroy(); //销毁音频实例
      audio = null;
    });
    audio.onError((e) => {
      if (audioCallback && audioCallback.onError && typeof audioCallback.onError == 'function')
        audioCallback.onError(e);
      console.log('音频播放错误: ' + JSON.stringify(e));
      console.log('销毁音频实例');
      audio.destroy(); //销毁音频实例
      audio = null;
    });
    return audio;
  }
  audio.onPlay(() => {
    console.log('音频播放开始');
    if (audioCallback && audioCallback.onPlay && typeof audioCallback.onPlay == 'function') audioCallback.onPlay();
  });
  audio.onPause(() => {
    if (audioCallback && audioCallback.onPause && typeof audioCallback.onPause == 'function') audioCallback.onPause();
  });
  audio.onWaiting(() => {
    if (audioCallback && audioCallback.onWaiting && typeof audioCallback.onWaiting == 'function')
      audioCallback.onWaiting();
  });
  audio.onStop(() => {
    if (audioCallback && audioCallback.onStop && typeof audioCallback.onStop == 'function') audioCallback.onStop();
  });
  audio.onTimeUpdate(() => {
    if (audioCallback && audioCallback.onTimeUpdate && typeof audioCallback.onTimeUpdate == 'function')
      audioCallback.onTimeUpdate();
  });
  audio.onSeeking(() => {
    if (audioCallback && audioCallback.onSeeking && typeof audioCallback.onSeeking == 'function')
      audioCallback.onSeeking();
  });
  audio.onSeeked(() => {
    if (audioCallback && audioCallback.onSeeked && typeof audioCallback.onSeeked == 'function')
      audioCallback.onSeeked();
  });
  audio.onEnded(() => {
    console.log('音频播放结束');
    console.log('销毁音频实例');
    audio.destroy(); //销毁音频实例
    audio = null;
    if (audioCallback && audioCallback.onEnded && typeof audioCallback.onEnded == 'function') audioCallback.onEnded();
    if (lineUp !== false) {
      if (audioTeam.length > 0) {
        console.log('队列中');
        openVoiceFc(audioTeam[0], false);
        audioTeam.splice(0, 1);
      } else {
        console.log('队列为零');
        audioStartSwitch = false;
      }
    }
  });
  audio.onError((e) => {
    if (audioCallback && audioCallback.onError && typeof audioCallback.onError == 'function') audioCallback.onError(e);
    console.log('音频播放错误: ' + JSON.stringify(e));
    console.log('销毁音频实例');
    audio.destroy(); //销毁音频实例
    audio = null;
  });
  audio.play();
}

/**
 * # 下载示例项目, 拖进项目即可运行
 *
 * # 插件简介
 *
 * 非常轻便使用的语音合成接口，一般用于对推送过来的消息进行语音播报
 *
 * 1、新增测试url， 运行项目即可体验，因为是测试的，并且是前端直接获取token，如果有多人同时使用，则有可能播放失败，换成自己的并且token由后端维护就好 | 案例运行npm i安装依赖
 *
 * # 1. 注意
 *
 * 1、`强烈建议token的获取与维护交由后端`, 在获取token的接口中有返回expires_in, 该参数为token有效期，文档中token有效期为30天，后端可以每一段时间获取一次<br />
 * 2、该api接口QPS限制(每秒查询率)是100，详见百度云文档, 若不够用请看2.<br /> 3、默认开启语音队列机制
 *
 * # 2.当QPS限制100不够用时
 *
 * 当QPS限制100不够用时, `可以在百度云多创建几个应用`, 后端同时维护多个token，前端访问时可以按顺序返回token
 *
 * # 3. 百度语音合成接口使用说明
 *
 * 注：需先在百度云注册账号并创建应用（内有文档地址），获得API Key和Secret Key并填入js的url地址中, `强烈建议由后端访问并维护token`
 *
 * ## 引入js
 *
 * ```javascript
 * import Voice from 'W-baiduyy.js';
 * ```
 *
 * ### 使用
 *
 * ```javascript
 * Voice('想要播报的内容');
 * ```
 *
 * # 4.参数说明
 *
 * ## 4.0.1 String类型
 *
 * ```javascript
 * 示例代码: Voice('想要播报的内容');
 * ```
 *
 * ## 4.0.2 Object类型
 *
 * ```javascript
 * 示例代码:
 * Voice({
 *   voiceSet: {
 *     tex: '想要播报的内容'
 *   },
 *   audioSet: {
 *     volume: 1
 *   },
 *   audioCallback: {
 *     o-n-P-l-a-y: ()=>{   //属性名去掉 - , 不知道为什么全名显示不了
 *       console.log('音频开始播放了')
 *     }
 *   }
 *   lineUp: true   // 加入语音队列
 *   returnAudio: false  // 返回音频对象
 * })
 * ```
 *
 * | 属性名        | 是否必填 | 参数类型 | 默认值 |                 说明 |
 * | ------------- | -------- | -------- | ------ | -------------------: |
 * | voiceSet      | 是       | Object   |        |     百度接口参数设置 |
 * | audioSet      |          | Object   |        |     音频组件参数设置 |
 * | audioCallback |          | Object   |        | 音频组件回调函数设置 |
 * | lineUp        |          | Boolean  | true   |     是否加入语音队列 |
 * | returnAudio   |          | Boolean  | false  |     是否返回音频对象 |
 *
 * ### voiceSet参数详解
 *
 * | 属性名 | 是否必填 | 参数类型 | 默认值 |                                                                                                                     说明 |
 * | ------ | -------- | -------- | ------ | -----------------------------------------------------------------------------------------------------------------------: |
 * | tex    | 是       | String   |        | 合成的文本，使用 UTF-8 编码。小于 2048 个中文字或者英文数字。（文本在百度服务器内转换为 GBK 后，长度必须小于 4096 字节） |
 * | spd    |          | Number   | 5      |                                                                                         语速，取值 0-15，默认为 5 中语速 |
 * | pit    |          | Number   | 5      |                                                                                         音调，取值 0-15，默认为 5 中语调 |
 * | vol    |          | Number   | 5      |                                                                                         音量，取值 0-15，默认为 5 中音量 |
 * | per    |          | Number   | 0      |                         发音人选择, 0 为普通女声，1 为普通男生，3 为情感合成-度逍遥，4 为情感合成-度丫丫，默认为普通女声 |
 *
 * ### audioSet参数详解
 *
 * | 属性名         | 是否必填 | 参数类型 | 默认值 |                                                                                                                                    说明 |
 * | -------------- | -------- | -------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------: |
 * | volume         |          | Number   | 1      |                                                                                                                          音量。范围 0~1 |
 * | startTime      |          | Number   | 0      |                                                                                                       开始播放的位置（单位：s），默认 0 |
 * | loop           |          | Boolean  | false  |                                                                                                                是否循环播放，默认 false |
 * | obeyMuteSwitch |          | Boolean  | true   | 是否遵循系统静音开关，当此参数为 false 时，即使用户打开了静音开关，也能继续发出声音，默认值 true （微信小程序、百度小程序、头条小程序） |
 *
 * ### audioCallback参数详解
 *
 *     详见官方-innerAudioContext 对象的方法列表中的on事件(除onCanplay外)
 *
 * ### lineUp参数详解
 *
 *     lineUp-是否加入语音队列
 *     若为true则加入语音队列，当正在播放语音时，有推送过来的消息要进行语音播报，则先等上一个音频播放完后再继续播放下一个
 *
 * ### returnAudio参数详解
 *
 *     若传returnAudio为true， 会返回一个最终返回音频对象的Promise对象， 若采用此方式，则不会加入语音队列，并且音频状态的监听需要自己得到音频对象后加上，默认是监听停止或错误后移除此对象
 */

import { Modal } from 'antd';
import store, { RESET } from 'config/store';
import { settingApi } from 'api';

// 监听鼠标移动、点击以及键盘事件，如果长时间没响应，就强制用户退出
const LOGOUT_INTERVAL = 30 * 60; // 30分钟
let timer = null;
let timeout = LOGOUT_INTERVAL;

document.onkeydown = document.onmousemove = document.onmousedown = function() {
  if (timer && timeout > 0) {
    runTimer();
  }
}

export function runTimer() {
  // 重置定时器
  clearInterval(timer);
  timeout = LOGOUT_INTERVAL;

  // 开启新的定时器
  timer = setInterval(() => {
    timeout -= 5;
    if (timeout === 0) {
      clearInterval(timer);
      Modal.warning({
        title: '长时间未操作，请重新登陆！',
        onOk: () => {
          window.location.hash = '/';
          store.dispatch({type: RESET});
        },
      });
    }
  }, 5000);
}

// 每10分钟向后台发送一次请求，防止后台长时间未请求导致session异常退出
const REQUEST_INTERVAL = 10 * 60;
setInterval(() => {
  settingApi.queryUserInfo();
}, REQUEST_INTERVAL * 1000);

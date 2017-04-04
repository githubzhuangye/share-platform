// 对api request的缓存，参数是一个promise对象
import axios from 'axios';

const cache = (function() {
  const cache = new Map();

  function get(promise) {
    if (cache.has(promise)) {
      return cache.get(promise);
    } else {
      cache.set(promise, promise);
      return promise;
    }
  }

  return {
    get
  };
})();

export default cache;

export default class EventEmitter {
  static events = {}
  static on(name, fn) {
    const fns = this.events[name] || (this.events[name] = []);
    fns.push(fn);
    return this;
  }
  static off(name, fn) {
    if (!fn) {
      this.events[name] = [];
    } else {
      this.events[name] = this.events[name].filter(f => f !== fn);
    }
    return this;
  }
  static emit(name, ...arg) {
    const fns = this.events[name];
    if (fns) {
      fns.forEach(fn => fn(...arg));
    }
  }
}


export const MARKET_MODAL_CLOSE = 'MARKET_MODAL_CLOSE';
export const GEO = 'GEO';
export const GEO_SUCCESS = 'GEO_SUCCESS';
export const GEO_MAP = 'GEO_MAP';

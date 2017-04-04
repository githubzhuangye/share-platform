import React, { Component, PropTypes } from 'react';
import * as styles from './styles.css';
require('images/banner1.png');
require('images/banner2.png');
require('images/banner3.png');

export default class Carousel extends Component {
  static propsType = {
    timeout: PropTypes.number   // 轮播图的时间间隔,单位ms, 默认4000ms
  }
  static defaultProps = {
    timeout: 4000
  }
  state = {
    index: 0,    // 当前轮播图的索引
    timer: null   // 用于点击箭头时关掉定时器
  }
  componentDidMount() {
    const timer = this.initTimer();
    this.setState({...this.state, timer});
  }
  componentWillUnmount() {
    clearInterval(this.state.timer);
  }
  initTimer() {
    return setInterval(() => {
      this.scrollTo('right');
    }, this.props.timeout);
  }
  scrollTo(direction, callback) {
    let { index } = this.state;
    if (direction === 'left') { // ←
      if (index === 0) {
        index = 2;
      } else {
        index--;
      }
    } else if(direction === 'right') {
      if (index === 2) {
        index = 0
      } else {
        index++
      }
    }
    this.setState({index}, () => {
      const imageWrapperDom = this.refs.imageWrapper;
      const container = this.refs.container;
      const bannerIndex = this.state.index;
      switch (bannerIndex) {
        case 0:
          container.style.backgroundColor = '#262584';
          break;
        case 1:
          container.style.backgroundColor = '#353535';
          break;
        case 2:
          container.style.backgroundColor = '#382414';
          break;
      }
      imageWrapperDom.src = require(`images/banner${bannerIndex+1}.jpg`);

      callback && callback();
    });
  }
  handleClick(direction) {
    clearInterval(this.state.timer);
    this.scrollTo(direction, () => {
      this.setState({...this.state, timer: this.initTimer()});
    });
  }
  render() {
    return (
      <div className={styles.container} ref="container">
        <div className={styles.wrapper}>
          <img src={require('images/banner1.jpg')} ref="imageWrapper" className={styles.image}/>
          <div className={styles.form}>
            {this.props.children}
          </div>
          <div className={styles.arrow}>
            <img onClick={() => this.handleClick('left')} src={require('images/arrow_left.png')}/>
            <img onClick={() => this.handleClick('right')} src={require('images/arrow_right.png')}/>
          </div>
        </div>
      </div>
    );
  }
}

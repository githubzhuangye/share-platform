import React, { PropTypes, Component } from 'react';
import { StatusIcon } from 'components/admin'
import * as styles from './styles.css';

BoardItem.propTypes = {
  phone: PropTypes.string.isRequired,
  coupon: PropTypes.string.isRequired,
};

function BoardItem({phone, coupon}) {
  return (
    <div>
      <div className={styles.item}>
        <div className={styles.icon}>
          <StatusIcon color="blue"/>
        </div>
        <p className={styles.text}>
          恭喜用户<span className={styles.red}>{phone}</span>成功领取一张{coupon}
        </p>
      </div>
      <div className={styles.line}></div>
    </div>
  );
}

export default class Board extends Component {
  static propTypes = {
    newData: PropTypes.array.isRequired
  }
  state = {
    timer: null,
    dataSource: []
  }
  componentWillReceiveProps(nextProps) {
    this.setState({...this.state, dataSource: [...this.state.dataSource, ...nextProps.newData]}, () => {
      if (this.state.dataSource.length >= 8 && this.state.timer === null) {
        this.beginTimer();
      }
    });
  }
  componentDidMount() {
    this.setState({...this.state, dataSource: this.props.newData});
    // TODO: length between 4-8
    if (this.props.newData.length >= 8) {
      this.beginTimer();
    }
  }
  componentWillUnmount() {
    clearInterval(this.state.timer);
    this.setState({...this.state, timer: null});
  }
  beginTimer() {
    this.setState({...this.state, timer: setInterval(::this.scroll, 30)});
  }
  scroll() {
    const oContent = this._content;
    const originTop = parseInt(getComputedStyle(oContent)['top']);
    if (originTop === -240) {
      oContent.style.top = '0px';
      this.swapDataSource();
    } else {
      oContent.style.top = originTop - 1 + 'px';
    }
  }
  swapDataSource() {
    const originDataSource = this.state.dataSource;
    const dataLength = originDataSource.length;
    let dataSource;
    if (dataLength === 8) {
      dataSource = [...originDataSource.slice(4), ...originDataSource.slice(0, 4)];
    } else if (dataLength > 8 && dataLength < 12) {
      dataSource = [...originDataSource.slice(4), ...originDataSource.slice(dataLength - 8, 4)];
    } else {
      dataSource = originDataSource.slice(4, 12);
    }
    this.setState({...this.state, dataSource});
  }
  renderBoardItem() {
    const { dataSource } = this.state;
    return dataSource.slice(0, 8).map((item, index) => <BoardItem key={index} phone={item.phone} coupon={item.coupon}></BoardItem>);
  }
  render() {
    return (
      <div className={styles.container}>
        <h3>券况直播</h3>
        <div className={styles.itemContainer}>
          <div className={styles.scrollContainer} ref={div => this._content = div}>
            {this.renderBoardItem()}
          </div>
        </div>
      </div>
    );
  }
}

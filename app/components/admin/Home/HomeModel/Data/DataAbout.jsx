import React from 'react';
import { Row, Col, Button } from 'antd';
import * as styles from './styles/dataAbout.css';
import classnames from 'classnames';
import { isValidField, generateAuthFields, getUserType, transformDate } from 'helpers/util';
import { host } from 'config/constants';
import axios from 'axios';

let flagData = 0;

export const Retailer = React.createClass({
  getInitialState: function() {
    return {
      retailername: "87",
      bussinessname: "52",
      storename: "743",
      activityname: "782",
      aerificationname: "213334",
      cityname: "24",
      showSelf: 'none'
    };
  },
  onMouseHandle(){
    if (flagData == 0) {
      this.setState({
        showSelf: 'block',
      });
      flagData = 1;
      return;
    }else{
      this.setState({
        showSelf: 'none',
      });
      flagData = 0;
      return;
    }
    
  },
  componentDidMount: function() {
      let self = this;
      // return axios.get(`${host}/cp/message/m_kpi.action`, {
      return axios.get(`${host}/cp/message/m_data.action`, {
          params: generateAuthFields()
      })
      .then(function (response) {
          const data = response.data.data;
          const _saass = data.saass;
          const _brands = data.brands;
          const _markets = data.markets;
          const _actives = data.actives;
          const _used = data.used;
          const _city = 0;
          if (response.data.data.saass < 10) return;
          self.setState({
                retailername:  response.data.data.saass,
                bussinessname: response.data.data.brands,
                storename: response.data.data.markets|| '--',
                activityname: response.data.data.pos || 0,
                aerificationname: (response.data.data.used / 10000).toFixed(2) +'万',
                cityname: response.data.data.city || 0
          });
      })
  },
  render() {
    return (
      <Row className={styles.todyData}>
        <Col span={5} className={styles.todyDataCont}>
          <p>{this.state.retailername}</p><p>累计加入零售商</p>
          <img src={require('images/data_line.png')} />
        </Col>
        <Col span={5} className={styles.todyDataCont}>
          <p>{this.state.bussinessname}</p><p>累计加入品牌商</p>
          <img src={require('images/data_line.png')} />
        </Col>
        <Col span={5} className={styles.todyDataCont}>
          <p>{this.state.storename}</p><p>累计加入门店数</p>
          <img src={require('images/data_line.png')} />
        </Col>
        <Col span={5} className={styles.todyDataCont}>
          <p>{this.state.activityname}</p><p>POS通道数</p>
          <img src={require('images/data_line.png')} />
        </Col>
        <Col span={2} className={styles.todyDataMore} onClick={this.onMouseHandle}>
          <img src={require('images/more_data.png')}/>
          <p>更多数据</p>
        </Col>
        <Col span={5} className={classnames(styles.todyDataCont,styles.aniEase,styles.animated,styles.fadeInDown)} style={{display: this.state.showSelf, marginTop: '20px'}}>
          <p>{this.state.aerificationname}</p><p>已核销券数</p>
          <img src={require('images/data_line.png')} />
        </Col>
        <Col span={5} className={classnames(styles.todyDataCont,styles.aniEase,styles.animated,styles.fadeInDown)} style={{display: this.state.showSelf, marginTop: '20px'}}>
          <p>{this.state.cityname}</p><p>已开通城市数</p>
          <img src={require('images/data_line.png')} />
        </Col>
      </Row>
    );
  },
});


import React, { PropTypes, Component } from 'react';
import { Row, Col } from 'antd';
import echarts from 'echarts';
import * as styles from './styles.css';

import { isValidField, generateAuthFields, postWithFormData, transformDate } from 'helpers/util';
import { host } from 'config/constants';
import axios from 'axios';


// 基于准备好的dom，初始化echarts实例
export default class HomeChart extends Component {
  componentDidMount() {
    const myChart = echarts.init(this._dom);
    const myChart2 = echarts.init(this._dom2);
    // 绘制图表

    return axios.get(`${host}/cp/message/m_curve.action`, {
          params: generateAuthFields()
    })
    .then(function (response) {
          const data = response.data.data;
          const _hexiao = data.hexiao;
          const _yonghu = data.yonghu;
          const option = {
             title: {
                text: '核销曲线图',
                subtext: '',
                textStyle: {
                    fontSize: 14,
                    fontWeight: 'normal',
                    color: '#333'          // 主标题文字颜色
                },
                x:'center',
                y: 'top',
            },
            tooltip: {
                    trigger: 'axis'
             },
            toolbox: {
                show: true,
                feature: {
                    restore: {show: true},
                    saveAsImage: {show: true}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: _hexiao.times
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                name: '核销数量',
                type: 'line',
                smooth: true,
                data: _hexiao.total
            }]
         };
        const option2 = {
            title: {
                text: '新增用户曲线图',
                subtext: '',
                textStyle: {
                    fontSize: 14,
                    fontWeight: 'normal',
                    color: '#333'          // 主标题文字颜色
                },
                x:'center',
                y: 'top',
            },
            tooltip: {
                    trigger: 'axis'
             },
            toolbox: {
                show: true,
                feature: {
                    restore: {show: true},
                    saveAsImage: {show: true}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: _yonghu.times
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                name: '用户数量',
                type: 'line',
                smooth: true,
                data: _yonghu.total
            }]
         };
         myChart.setOption(option);
         myChart2.setOption(option2);
    })
    .catch(function (error) {
        console.log(error);
    });
  }
  render() {
    return (
            <Row className={styles.reportData}>
              <Col span={22} offset={1} className={styles.reportDataCont}>
                <div>
                  <div ref={dom => this._dom = dom} className={styles.container}></div>
                </div>
                <div>
                  <div ref={dom => this._dom2 = dom} className={styles.container}></div>
                </div>
              </Col>
            </Row>
    );
  }
}

import React, { Component,PropTypes } from 'react';
import {Row, Col, Spin} from 'antd';
import {cardable} from 'hoc';
import styles from './styles.css';
import { DataSelectContainer } from 'containers/admin';
import ChannelChartUse from './ChannelChartUse';
import ChannelChartGet from './ChannelChartGet';

@cardable(['渠道数据分析'])

export default class ChannelDataAnalysis extends Component{
        render(){
          return (
              <div className={styles.container}>
                  <DataSelectContainer/>
                    <div>
                      <div className={styles.body}>
                          <div className={styles.title}>领核券汇总</div>
                      </div>
                      <ul className={styles.body}>
                        <li className={styles.summarySummary}>
                          <div>
                            <p className={styles.pData}>领券数据</p>
                            <ChannelChartGet/>
                          </div>
                        </li>
                        <li className={styles.summarySummary}>
                          <div>
                            <p className={styles.pData}>核券数据</p>
                            <ChannelChartUse/>
                          </div>
                        </li>
                      </ul>
                    </div>

                    {/*<div>
                      <div className={styles.body}>
                          <div className={styles.title}>时段数据分析</div>
                      </div>
                      <div className={styles.body}>
                        <TimeCharts loading={false}/>
                      </div>
                    </div>*/}
              </div>
          )
        }
    }

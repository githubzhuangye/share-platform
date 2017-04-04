import React, {Component, PropTypes} from 'react';

import * as styles from './styles.css';
import { Select,DatePicker,Button } from 'antd';
const Option = Select.Option;

export default class Title extends Component {
    render() {
        const { dataSource } = this.props;
        const {  RangePicker } = DatePicker;
        return (
            <div className={styles.container}>
                  <div className={styles.header}>
                    <div className={styles.header_data}>
                        <span>活动名称：</span>
                        <Select defaultValue="" style={{ width: 120 }} placeholder="请选择活动名称" size="small">
                          {dataSource.map((item,index) => <Option key={index} value={item.activeId}>{item.name}</Option>)}
                        </Select>
                    </div>
                    <div className={styles.header_data}>
                        <span>数据日期：</span>
                        <RangePicker size="small"></RangePicker>
                    </div>
                    <Button type="primary" size="small">查询</Button>
                    <Button size="small">重置</Button>
                  </div>
                  <p className={styles.p}>所有活动，活动开始至今2017-1-16</p>
            </div>
        )
    }
}

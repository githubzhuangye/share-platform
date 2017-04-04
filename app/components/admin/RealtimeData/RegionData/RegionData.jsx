import React, {Component, PropTypes} from 'react';

import {cardable} from 'hoc';
import ActivityRegion from './ActivityRegion.jsx';
import { Cascader,DatePicker } from 'antd';
import  styles from './styles.css';
import 'echarts/map/js/china';
import Map from './map.jsx';
import TableRegion from './TableRegion';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as RegionDataActionCreators from 'redux/modules/RegionData';

@cardable(['区域数据分析'])
@connect(
  ({RegionData}) => ({
    activeList: RegionData.activeList,
  }),
  dispatch => bindActionCreators(RegionDataActionCreators, dispatch)
)
export default class RegionData extends Component {
    static propTypes = {
      activeList: PropTypes.array.isRequired,
    }
    async componentDidMount() {
      const activeList = await this.props.handleActiveList();
    }
    render() {
    const {  RangePicker } = DatePicker;
    const { activeList } = this.props;
        return (
            <div className={styles.container}>
                  <ActivityRegion dataSource={activeList}/>
                  <div className={styles.body}>
                    <ul className={styles.body+" "+styles.flex}>
                      <li>领券数量</li>
                      <li>领券人数</li>
                      <li>核券数量</li>
                      <li>核券人数</li>
                      <li>核销率</li>
                    </ul>
                    <div className={styles.center}>
                      <Map/>
                    </div>
                    <div>
                      <TableRegion loading={false}/>
                    </div>
                  </div>
            </div>
        )
    }
}

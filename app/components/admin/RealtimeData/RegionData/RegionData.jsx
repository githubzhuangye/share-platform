import React, {Component, PropTypes} from 'react';

import { cardable } from 'hoc';
import ActivityRegion from './ActivityRegion.jsx';
import { Cascader,DatePicker } from 'antd';
import  styles from './styles.css';
import 'echarts/map/js/china';
import Map from './map.jsx';
import TableRegion from './TableRegion';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as RegionDataActionCreators from 'redux/modules/RegionData';
import { Tabs } from 'antd';
const TabPane = Tabs.TabPane;

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
                    <Tabs defaultActiveKey="1" >
                      <TabPane tab="领券数量" key="1">
                        <Map/>
                      </TabPane>
                      <TabPane tab="领券人数" key="2">
                        <Map/>
                      </TabPane>
                      <TabPane tab="核券数量" key="3">
                        <Map/>
                      </TabPane>
                      <TabPane tab="核券人数" key="4">
                        <Map/>
                      </TabPane>
                      <TabPane tab="核销率" key="5">
                        <Map/>
                      </TabPane>
                    </Tabs>
                    <div>
                      <TableRegion loading={false}/>
                    </div>
                  </div>
            </div>
        )
    }
}

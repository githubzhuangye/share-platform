import React, { PropTypes } from 'react';
import { Form, Row} from 'antd';
import * as styles from 'components/admin/RealtimeData/TotalData/styles.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as realDataActionCreators from 'redux/modules/realData';
import EventEmitter from 'helpers/event';
import {realDataApi} from 'api';

import { ActivitySelection,SubAndRestBtns } from 'components/admin/RealtimeData';
import DataCharts from 'components/admin/RealtimeData/TotalData/DataCharts';
import PvUvData from 'components/admin/RealtimeData/TotalData/PvUvData';

export const LOADED_ACTIVITY_LIST = 'LOADE_ACTIVITY_LIST';

@connect(
  ({realData}) => ({
    activityList: realData.activityList,
  }),
  dispatch => bindActionCreators(realDataActionCreators, dispatch)
)

@Form.create()

export default class ActivitySelectionContainer extends React.Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    activityList: PropTypes.array.isRequired,
    handleFetchActivityList: PropTypes.func.isRequired,
    handleFetchPvuvData: PropTypes.func.isRequired,
    activityFieldName: PropTypes.string,
    handleSubmit: PropTypes.func,
  }

  state = {
      loading: false,
      hideEle: 'none',
      dataSource:{pv: "--", pvp: "--", uv: "--", uvp: "--", cget: "--", cgetp: "--", uget: "--", ugetp: '--', cuse: '--', cusep: '--', uuse: '--', uusep: '--'},
      pvuvData: { day: [0], pv: [0], uv: [0] },
      chartsVal : {},
      dataFunnel : { uuse: '50' , uget: '30' , uv: '20' },
  }

  handleSubmit(){
      const {form} = this.props;
      form.validateFields((err, fieldsValue) => {
          if (err) {
              return;
          }
          // Should format date value before submit.
          const rangeTimeValue = fieldsValue['dateTime'];
          const activeIdValue = fieldsValue['activeId'];

          const values = {
              'activeId' : activeIdValue.split("_")[0],
              'starttime': rangeTimeValue[0].format('YYYY-MM-DD'),
              'endtime'  : rangeTimeValue[1].format('YYYY-MM-DD')
          };

          const dataChartsVal = {
              'activeId'   : activeIdValue.split("_")[0],
              'starttime'  : rangeTimeValue[0].format('YYYY-MM-DD'),
              'endtime'    : rangeTimeValue[1].format('YYYY-MM-DD'),
              'type'       : 'pvuv',
              'dataformat' : 'day'
          };

          this.setState({loading: true,chartsVal: dataChartsVal});

          realDataApi.dataOverview(values)
              .then(dataSource => {
                  if(typeof(dataSource.pvp) !=="undefined"){
                      this.setState({hideEle: 'block'});
                  }
                  if(dataSource.pv == '') dataSource.pv = '--';
                  if(dataSource.uv == '') dataSource.uv = '--';
                  this.setState({dataSource,loading: false})
              })

          realDataApi.dataFunnel(values)
              .then(dataFunnel => {
                  this.setState({dataFunnel})
              })

          realDataApi.dataCurve(dataChartsVal)
              .then(data => {
                  this.setState({pvuvData: data.pvuvData})
              })
          form.resetFields(['dateTime']);
      });

  }

  restFormClick(){
      const {form} = this.props;
      form.resetFields();
  }

  componentDidMount() {
    const activityList = this.props.handleFetchActivityList();
    this.handleSubmit();
  }
  render () {
    const { form, activityList, activityFieldName, handleSubmit } = this.props;
    const dataProps = {...this.state.dataSource};
    const chartsProps = {...this.state.pvuvData};
    const { loading, hideEle, chartsVal, dataFunnel } = this.state;
    return (
        <div>
            <div className={styles.dateSelecter}>
                <Form>
                    <Row>
                        <ActivitySelection form={form} activityList={activityList} activityFieldName={activityFieldName}/>
                        <SubAndRestBtns onSubBtnClick={:: this.handleSubmit} onRestBtnClick={:: this.restFormClick}/>
                    </Row>
                </Form>
            </div>
            <PvUvData loading={loading} hideEle={hideEle} {...dataProps}/>
            <DataCharts loading={loading} dataSource={chartsProps} funnelData={dataFunnel} chartsVal={chartsVal} />
        </div>
    );
  }
}

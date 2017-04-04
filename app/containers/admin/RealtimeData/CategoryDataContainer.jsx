import React, { PropTypes,Component } from 'react';
import { Form, Row,Spin,Col } from 'antd';
import * as styles from 'components/admin/RealtimeData/TotalData/styles.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as dataSelectActionCreators from 'redux/modules/dataSelect';
import EventEmitter from 'helpers/event';
import {realDataApi} from 'api';

import ActivityCategory from 'components/admin/RealtimeData/CategoryData/ActivityCategory';
import PieGet from 'components/admin/RealtimeData/CategoryData/PieGet';
import PieUse from 'components/admin/RealtimeData/CategoryData/PieUse';


export const LOADED_ACTIVITY_LIST = 'LOADE_ACTIVITY_LIST';

@connect(
  ({dataSelect}) => ({
    activeList: dataSelect.activeList,
    starttime: dataSelect.starttime,
    endtime: dataSelect.endtime,
    activeId: dataSelect.activeId,
  }),
  dispatch => bindActionCreators(dataSelectActionCreators, dispatch),
)

@Form.create()

export default class CategoryDataContainer extends React.Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    activeList: PropTypes.array.isRequired,
  }

  state = {
      loading: false,
      hideEle: 'none',
      USE : {rcord: '0' , channelname: ' '},
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
              'type'       : 'USE',
          };

          this.setState({loading: true,chartsVal: dataChartsVal});

          // realDataApi.dataOverview(values)
          //     .then(dataSource => {
          //         if(typeof(dataSource.pvp) !=="undefined"){
          //             this.setState({hideEle: 'block'});
          //         }
          //         if(dataSource.pv == '') dataSource.pv = '--';
          //         if(dataSource.uv == '') dataSource.uv = '--';
          //         this.setState({dataSource,loading: false})
          //     })
          //
          // realDataApi.dataFunnel(values)
          //     .then(dataFunnel => {
          //         this.setState({dataFunnel})
          //     })
          //
          DataPublicApi.channelDataAnalysis(dataChartsVal)
              .then(data => {
                  this.setState({USE: data.USE})
              })
          form.resetFields(['dateTime']);
      });

  }

  restFormClick(){
      const {form} = this.props;
      form.resetFields();
  }

  async componentDidMount() {
    console.log(this.props)
    const activeList = this.props.handleActivityList();
    this.handleSubmit();
  }
  render () {
    const { form, activityFieldName, handleSubmit } = this.props;
    const { loading, hideEle } = this.state;
    const { activeList,categoryUse,categoryGet } = this.props;
    return (
        <div>
            <div className={styles.dateSelecter}>
                <Form>
                    <Row>
                        <ActivityCategory form={form} activeList={activeList} onSubBtnClick={:: this.handleSubmit} onRestBtnClick={:: this.restFormClick}/>
                    </Row>
                </Form>
            </div>
              <Col span={10}><PieGet/></Col>
              {/*<Col span={10}><PieUse dataSourceUse={categoryUse}/></Col>*/}
        </div>
    );
  }
}

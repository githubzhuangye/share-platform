import React, { PropTypes } from 'react';
import { Form, Row} from 'antd';
import * as styles from 'components/admin/RealtimeData/TotalData/styles.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as realDataActionCreators from 'redux/modules/realData';
import EventEmitter from 'helpers/event';
import { realDataApi,userDataApi } from 'api';

import { ActivitySelection,SubAndRestBtns } from 'components/admin/RealtimeData';


export const LOADED_ACTIVITY_LIST = 'LOADE_ACTIVITY_LIST';

@connect(
  ({realData}) => ({
    activityList: realData.activityList,
  }),
  dispatch => bindActionCreators(realDataActionCreators, dispatch)
)

@Form.create()

export default class ActivitySelectionContainer1 extends React.Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    activityList: PropTypes.array.isRequired,
    handleFetchActivityList: PropTypes.func.isRequired,
    activeFieldName: PropTypes.string,
    handleSubmit: PropTypes.func,
  }

  state = {
      loading: false,
      hideEle: 'none',
      userDataGet:{ coupon: "--", user: "--", avg: "--",cnt: [0], rcord:[0] },
      userDataUse:{ coupon: "--", user: "--", avg: "--",cnt: [0], rcord:[0] },
      chartsVal : {},
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
              'queryType'  :  'GET'
          };

          this.setState({loading: true,userDataGet: dataChartsVal});
          userDataApi.userDataUse(values)
              .then(userDataUse => {
                  if(userDataUse.coupon == '') userDataUse.coupon = '--';
                  if(userDataUse.user == '') userDataUse.user = '--';
                  if(userDataUse.avg == '') userDataUse.avg = '--';
                  this.setState({userDataUse,loading: false})
              })
          userDataApi.userDataUse(dataChartsVal)
              .then(data => {
                  this.setState({userDataGet: data.userDataGet})
              })
          form.resetFields(['dateTime']);
      });
  }

  restFormClick(){
      const {form} = this.props;
      form.resetFields();
  }

  async componentDidMount() {
    const activityList = await this.props.handleFetchActivityList();
    this.handleSubmit();
  }
  render () {
    const { form, activityList, activeFieldName, handleSubmit } = this.props;
    const dataProps = {...this.state.dataSource};

    // const chartsProps = {...this.state.pvuvData};
    const { loading, hideEle } = this.state;
    return (
        <div>
            <div className={styles.dateSelecter}>
                <Form>
                    <Row>
                        <ActivitySelection form={form} activityList={activityList} activeFieldName={activeFieldName}/>
                        <SubAndRestBtns onSubBtnClick={:: this.handleSubmit} onRestBtnClick={:: this.restFormClick}/>
                    </Row>
                </Form>
            </div>

        </div>
    );
  }
}

import React, {PropTypes} from 'react';
import {Form, Row} from 'antd';
import * as styles from 'components/admin/RealtimeData/TotalData/styles.css';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as dataSelectActionCreators from 'redux/modules/dataSelect';

import { ActivitySelection, SubAndRestBtns } from 'components/admin/RealtimeData/CategoryData';

@connect(({dataSelect}) =>({
  activeList: dataSelect.activeList,
  starttime: dataSelect.starttime,
  endtime: dataSelect.endtime,
  activeId: dataSelect.activeId,
}), dispatch => bindActionCreators(dataSelectActionCreators, dispatch))

@Form.create()

export default class ActivitySelectionContainer extends React.Component {
    static propTypes = {
        form: PropTypes.object.isRequired,
        activeList: PropTypes.array.isRequired
    }

    state = {
        start:'',
        end:'',
    }

    async componentDidMount() {
        const activeList = await this.props.handleActivityList();
    }

    handleSelectChange(value){
      const _sttime = value.split("_")[1];
      const _edtime = value.split("_")[2];
      const _id = value.split("_")[0];
      this.props.fetchActiveId(_id);
      this.props.setDates(_sttime,_edtime);
    }


    handleDateChange(value,dateString) {
      const { setDates } = this.props;
      setDates(dateString[0],dateString[1]);
    }


    restFormClick() {
        const {form} = this.props;
        form.resetFields();
    }

    handleSubmit() {
        const { activeId,starttime,endtime } = this.props;
        const queryType = {
            activeId,
            starttime,
            endtime
        };
        this.props.handleAllCate(queryType, 'GET');
        this.props.handleAllCate(queryType, 'USE');
    }

    render() {
        const {form, activeList, starttime, endtime, activityFieldName} = this.props;
        return (
            <div>
                <div className={styles.dateSelecter}>
                    <Form>
                        <Row>
                            <ActivitySelection form={form} activeList={activeList} activityFieldName={activityFieldName} starttime={starttime} endtime={endtime} onListChange={:: this.handleSelectChange}  onDateChange={:: this.handleDateChange}/>
                            <SubAndRestBtns onSubBtnClick={:: this.handleSubmit} onRestBtnClick={:: this.restFormClick}/>
                        </Row>
                    </Form>
                </div>
            </div>
        );
    }
}

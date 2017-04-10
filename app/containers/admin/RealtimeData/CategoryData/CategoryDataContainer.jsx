import React, {PropTypes} from 'react';
import {Row, Col, Spin, Icon} from 'antd';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as dataSelectActionCreators from 'redux/modules/dataSelect';
import * as styles from 'components/admin/RealtimeData/CategoryData/styles.css';
import {realDataApi} from 'api';
import { UsePieChart, GetPieChart,DataSummary } from 'components/admin/RealtimeData/CategoryData';

@connect(({dataSelect}) => ({
    useCate: dataSelect.useCate,
    getCate: dataSelect.getCate,
    activeId: dataSelect.activeId,
    starttime: dataSelect.starttime,
    endtime: dataSelect.endtime,
    loading:dataSelect.loading,
    topData:dataSelect.topData,
}), dispatch => bindActionCreators(dataSelectActionCreators, dispatch))

export default class CategoryDataContainer extends React.Component {
    static propTypes = {
        activeId: PropTypes.string.isRequired
    }

    componentDidMount() {
            const {activeId, starttime, endtime} = this.props;
            const queryType = {
                activeId,
                starttime,
                endtime
            };
            this.props.handleAllCate(queryType, 'GET');
            this.props.handleAllCate(queryType, 'USE');
    }

    render() {
        const { useCate, getCate,loading,topData } = this.props;
        return (
            <div>
              <Spin spinning={loading}>
                <DataSummary dataSource={topData}/>
                <p className={styles.modelTitle}>领核券汇总</p>
                <Row>
                    <Col span={11} offset={1}>
                        <p style={{
                            marginTop: '20px',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            textAlign:'center',

                        }}>领券数汇总</p>
                        {getCate
                            ? <GetPieChart dataSource={getCate}/>
                            : <p style={{
                                width: '100%',
                                height: '200px',
                                lineHeight: '200px',
                                textAlign: 'center'
                            }}><Icon type="frown-o"/>暂无数据</p>}
                    </Col>
                    <Col span={11} offset={1}>
                        <p style={{
                            marginTop: '20px',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            textAlign:'center',
                        }}>核券数汇总</p>
                        {useCate
                            ? <UsePieChart dataSource={useCate}/>
                            : <p style={{
                                width: '100%',
                                height: '200px',
                                lineHeight: '200px',
                                textAlign: 'center'
                            }}><Icon type="frown-o"/>暂无数据</p>}
                    </Col>
                </Row>
              </Spin>
            </div>
        );
    }
}

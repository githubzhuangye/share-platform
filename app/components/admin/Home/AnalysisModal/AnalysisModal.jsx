import React, { PropTypes, Component } from 'react';
import { Row, Col, DatePicker, Button, Pagination, Modal,Tabs,Input } from 'antd';
import { List } from 'immutable';
import styles from './styles.css';
import { AnalysisTable,SaasTable } from 'components/admin/Home';
import { StatusIcon } from 'components/admin';
import { disabledDate } from 'helpers/util';
import {querySaas} from "api/saasFeeSet.js"
import { DATE_INTERVAL } from 'config/constants';

const { BEFORE, AFTER } = DATE_INTERVAL;

const RangePicker = DatePicker.RangePicker;
const TabPane = Tabs.TabPane;

export default class AnalysisModal extends Component {
  static propTypes = {
    totalSaas: PropTypes.number.isRequired,
    activeSaas: PropTypes.number.isRequired,
    dataSource: PropTypes.instanceOf(List),
    visible: PropTypes.bool.isRequired,
    page: PropTypes.number.isRequired,
    pageTotal: PropTypes.number.isRequired,
    onCancel: PropTypes.func.isRequired,
    onQueryBtnClick: PropTypes.func.isRequired,
    onDateChange: PropTypes.func.isRequired,
    onPageChange: PropTypes.func.isRequired
  }
  state={
    tabskey:1,
    saasname:"",
    pages:1,
    data:[],
    count:0,
    loading:false
  }
  onSaasTableClick(pages){
       const {saasname} = this.state; 
       this.setState({ loading: true})
       querySaas({
         saasname:saasname,
         page:pages
       }).then(res => {
            if (res.code === '200') {
                console.log(res)
                this.setState({ data: res.data.DETAILS, count: res.data.TOTALCOUNT, pages: pages })
            }
            this.setState({ loading: false })
        }).catch(e => this.setState({ loading: false }))
  }

  render() {
    const { visible, totalSaas, activeSaas, dataSource, page, pageTotal,
      onPageChange, onCancel, onDateChange, onQueryBtnClick } = this.props;
     const {tabskey,data,loading,saasname,count,pages}=this.state;
     return(
        <Modal
        title="米雅后台管理"
        visible={visible}
        onCancel={onCancel}
        footer={null}
        width={800}>
        <Row>
          <Col span={3}>
            <img src={require('images/miya.png')} />
          </Col>
          <Col offset={1} span={20}>
            <Row>
              <Col span={24}>
                <p className={styles.activeSaas}><StatusIcon/><span className={styles.red}>{activeSaas}</span>家供应商正在发券...</p>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <p className={styles.registerSaas}>已注册商户数:<span className={styles.red}>{totalSaas}</span>家</p>
              </Col>
            </Row>
            {
              parseInt(tabskey)==1?
              <Row style={{marginTop: '30px'}}>
                <Col span={10}>
                  <span style={{marginRight: 10}}>时间段:</span>
                  <RangePicker size="small" style={{ width: 184 }} disabledDate={disabledDate(AFTER)} onChange={onDateChange}/>
                </Col>
                <Col span={12}>
                  <Button className={styles.subBtn} type="primary" size="small"  onClick={onQueryBtnClick}>查询</Button>
                </Col>
              </Row>:
                  <Row style={{marginTop: '30px'}}>
                    <Col span={10}>
                      <span style={{marginRight: 10}}>商户名称:</span>
                      <Input type="text" style={{ width: 184 }} placeholder="请输入商户名称" value={saasname} onChange={(e)=>{this.setState({saasname:e.target.value})}}/>
                    </Col>
                    <Col span={12}>
                      <Button className={styles.subBtn} type="primary" size="small" onClick={()=>::this.onSaasTableClick(pages)} >查询</Button>
                    </Col>
                  </Row>
            }

          </Col>
        </Row>

        <Tabs defaultActiveKey="1" onChange={(e)=>this.setState({tabskey:e})}>
          <TabPane tab="查询内容" key="1">
            <AnalysisTable dataSource={dataSource.toArray()}/>
            {pageTotal
                ? <Pagination current={page} total={pageTotal} pageSize={5} onChange={onPageChange}/>
                : null}
          </TabPane>
          <TabPane tab="所有商户" key="2">
              <SaasTable dataSource={data} loading={loading} saasname={saasname}  count={count} page={pages} onSaasTableClick={::this.onSaasTableClick}/>
          </TabPane>
        </Tabs>

      </Modal>
     )
  }
}

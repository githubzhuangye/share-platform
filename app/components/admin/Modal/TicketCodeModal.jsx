import React, { PropTypes,Component  } from 'react';
import { Modal, Table, Select, Spin,Form ,Button,Input,message} from 'antd';
import * as styles from './ticketCodeModal.css';
import { COUPON_USAGE_STATUS, COUPON_USAGE_TIME ,host} from 'config/constants';
import { exportFreshQRCode,queryMarketFreshQRCodeByPubid  } from 'api/ticketCode';
import { extractStatus,generateAuthFields } from 'helpers/util';

const Option = Select.Option;
const FormItem = Form.Item;
const { ALL, TODAY, WEEK, MONTH } = COUPON_USAGE_TIME;

function Footer({onChange}) {
  return (
    <Select defaultValue={ALL.value} style={{width: '85px', textAlign: 'left'}} onChange={onChange}>
      <Option value={ALL.value}>{ALL.text}</Option>
      <Option value={TODAY.value}>{TODAY.text}</Option>
      <Option value={WEEK.value}>{WEEK.text}</Option>
      <Option value={MONTH.value}>{MONTH.text}</Option>
    </Select>
  );
}





export default class TicketCodeModal extends Component {
  state={
    visible:this.props.visible,
    loading:this.props.loading,
    dataSouce:this.props.dataSource,
    count:this.props.count,
    marketname:'',
    pubid:this.props.pubid,
    selectedRowKeys:[],
    curpage:1,
    markids:[]
  }

   onSelectChange(selectedRowKeys) {
    this.setState({
      selectedRowKeys:selectedRowKeys
    })
  }
  onSelect(record, selected, selectedRows) {
    var that=this, temp=[];
    selectedRows.map((value,index)=>{temp.push(value.markid)})
    this.setState({
      markids:temp
    });
  }
  onSelectAll(selected, selectedRows, changeRows) {
     var that=this, temp=[];
    selectedRows.map((value,index)=>{temp.push(value.markid)})
    this.setState({
      markids:temp
    });
  }
  getColumns(){
    var that=this;

    return [
      {
        title: '门店名称',
        dataIndex: 'markname',
        key: 'markname',
        width:264
      },
      {
        title: '状态',
        dataIndex: 'active',
        key: 'active',
        width:204,
        render:(text)=>text==1?"进行中":"已结束"
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width:204,
        render: (text,record)=> <a href="javascript:void(0);" onClick={()=>that.exportFreshQRCode(record.markid,that.state.pubid)} >导出</a>
      }
    ];
  }

  exportFreshQRCode(markid,pubid){
      this.setState({ loading: true });
      window.location.assign(`${host}/cp/coupon/fresh_exportFreshQRCode.action?account_id=${generateAuthFields().account_id}&sign=${generateAuthFields().sign}&markid=${markid}&pubid=${pubid}`);
      message.success("下载成功！")
      this.setState({ loading: false })

  }

  componentWillReceiveProps(nextProps){
    this.setState({
      visible:nextProps.visible,
      loading:nextProps.loading,
      dataSource:nextProps.dataSource,
      count:nextProps.dataSource,
      pubid:nextProps.pubid,
      count:nextProps.count,
    })
  }
   handleOk() {
    this.setState({
      visible: false,
    });
    this.props.callbackVisible(false);
  }

  handleCancel(e) {
    this.setState({
      visible: false,
    });
    this.props.callbackVisible(false);
  }

  queryMarket(){
    const {pubid,marketname} = this.state;
    this.setState({ loading: true })
      queryMarketFreshQRCodeByPubid({pubid:pubid,curpage:1,marketname:marketname}).then(result=>{
      if (result.code === '200') {
        this.setState({ dataSource: result.data.details,loading: false, count: result.data.totalcount })
      }
    }).catch(e => this.setState({ loading: false }));
  }

  exportCodes(){
    const {markids,pubid}=this.state;
    if(markids.length>0){
        this.setState({ loading: true });
        window.location.assign(`${host}/cp/coupon/fresh_exportFreshQRCode.action?account_id=${generateAuthFields().account_id}&sign=${generateAuthFields().sign}&markid=${markids.join(",")}&pubid=${pubid}`);
        message.success("下载成功！")
        this.setState({ loading: false })

    }else{
      message.error("请先选择需要导出的门店！")
    }
  }
   changePage(e) {
     const {pubid,marketname}=this.state;
        this.setState({ curpage: e }, function(){
          this.setState({
            loading: true,
          })
          queryMarketFreshQRCodeByPubid({pubid:pubid,curpage:e,marketname:marketname}).then(result=>{
            if (result.code === '200') {
              this.setState({ dataSource: result.data.details,loading: false, count: result.data.totalcount,pubid:pubid })
            }
          }).catch(e => that.setState({ loading: false }));
    })
    }

  render(){
    const {visible,loading,dataSource,selectedRowKeys,count,curpage}=this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: ::this.onSelectChange,
      onSelect: ::this.onSelect,
      onSelectAll: ::this.onSelectAll
    };
    const pagination = {
            current: Number(curpage),
            total: Number(count),
            onChange: ::this.changePage
        }
    return (
        <Modal
            title="二维码导出"
            visible={visible}
            width='720px'
            onOk={::this.handleOk} onCancel={::this.handleCancel}
            >
            <div className={styles.modalContent}>
               <Form inline onSubmit={this.handleSubmit} style={{marginLeft:20}}>
                  <FormItem
                    label="门店搜索"
                    >
                        <Input placeholder="请输入门店名称" style={{width:200}} onChange={(e)=>this.setState({marketname:e.target.value})}/>
                    </FormItem>
                    <Button type="primary"  style={{margin:"auto 20px"}} onClick={::this.queryMarket}>查询</Button>
                    <Button type="primary" style={{margin:"auto 10px"}} onClick={::this.exportCodes}>选择导出</Button>
                  </Form>
              <Table columns={this.getColumns()}  rowSelection={rowSelection}  loading={loading}
                    dataSource={dataSource}
                    pagination={pagination}/>
            </div>
        </Modal>
    );
  }
}

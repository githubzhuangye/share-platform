import React, { PropTypes ,Component} from 'react';
import {Table,Input,Switch,Button,InputNumber,message } from 'antd';
import styles from './styles.css';
import {setCharge} from "api/saasFeeSet.js"


export default class SaasTable extends Component {
    state={
        dataSource:this.props.dataSource,
        loading:this.props.loading,
        count:this.props.count,
        saasname:this.props.saasname,
        page:this.props.page,
        use_charge:"",
        rec_charge:""
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            dataSource:nextProps.dataSource,
            loading:nextProps.loading,
            count:nextProps.count,
            saasname:nextProps.saasname
        })
    }

    setCharge(saas,index){
       const {dataSource} = this.state; 

       var that=this;
       if(dataSource[index].REC_CHARGE.length==0 && dataSource[index].USE_CHARGE.length==0){
            message.error("领券手续费和核销手续费不能为空！");
            return;
       }
       this.setState({ loading: true });
       setCharge({
         saas:saas,
         rec_charge:dataSource[index].REC_CHARGE,
         use_charge:dataSource[index].USE_CHARGE
       }).then(res => {
            if (parseInt(res.code) === 200) {
                message.success("提交成功！");
            }else{
                message.error("提交失败！");
            }
            that.setState({loading: false  })
        }).catch(e => that.setState({ loading: false }))      
    }

    componentDidMount(){
      const {page}=this.state;
      this.props.onSaasTableClick(page)
    }


    getcolumns(){
        var that=this;
        const {dataSource}=that.state;
        return [
            {
                title: '商户名称',
                dataIndex: 'SAASNAME',
                key: 'SAASNAME',
            }, {
                title: '状态',
                dataIndex: 'ACTIVE',
                key: 'ACTIVE',
                render:(text)=>parseInt(text)==1?<span style={{color:"red"}}>发券中...</span>:"未发券"
            }, {
                title: '服务费设置',
                dataIndex: 'set',
                key: 'set',
                render(text, record, index) {
                    return(
                        <div>
                            <InputNumber min={0}  style={{width:65}} value={dataSource[index].USE_CHARGE/100}  step={0.01}  onChange={(value)=>{dataSource[index].USE_CHARGE=value*100;that.setState({dataSource})}} /> 元核一张
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <InputNumber min={0}  style={{width:65}}  step={0.01} value={dataSource[index].REC_CHARGE/100}  onChange={(value)=>{dataSource[index].REC_CHARGE=value*100;that.setState({dataSource})}}/> 元领一张 
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <Button type="ghost" size="small" onClick={()=>that.setCharge(record.SAASID,index)}>
                                提交
                            </Button>
                        </div>
                    )
                }
            }];
    }
   changePage(e) {
        this.setState({ page: e }, this.props.onSaasTableClick(e))
    }
  render() {
      const {loading,dataSource,count,page}=this.state;
      const pagination = {
            current: Number(page),
            total: Number(count),
            onChange: ::this.changePage
        }
      return (
          <div className={styles.checkInner}>
            <Table dataSource={dataSource} columns={this.getcolumns()}  loading={loading} pagination={pagination} />
          </div>
      );
  }
}

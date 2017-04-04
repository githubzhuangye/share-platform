import React, { PropTypes,Component  } from 'react';
import { Modal, Table, Select, Spin,Form ,Button,Input,message,InputNumber} from 'antd';
import styles from './style.css';
import {codeAssemble,updateFreshCode}  from 'api/freshCode';

const Option = Select.Option;
const FormItem = Form.Item;


@Form.create()
export default class FreshCodeModal extends Component {

  state={
    codeName:"",
    len: "",//长度
    prefixScope:"",//前缀
    goodScope1:"",//商品编号
    goodScope2:"",//商品编号
    moneyScope1:"",//金额
    moneyScope2:"",//金额
    weightScope1:"",//重量
    weightScope2:"",//重量
    checkScope1:"",//校验位
    checkScope2:"",//校验位
    codeid:"",
    help:"",
    validateStatus:true,
    editData:this.props.editData
  }

   componentWillReceiveProps(nextProps){
     const {codeName,codeid,prefixScope,goodScope1,goodScope2,moneyScope1,moneyScope2,weightScope1,weightScope2,checkScope1,checkScope2}=nextProps.editData;
          this.setState({
            codeName:codeName,
            codeid:codeid,
            prefixScope:prefixScope,//前缀
            goodScope1:goodScope1,//商品编号
            goodScope2:goodScope2,//商品编号
            moneyScope1:moneyScope1,//金额
            moneyScope2:moneyScope2,//金额
            weightScope1:weightScope1,//重量
            weightScope2:weightScope2,//重量
            checkScope1:checkScope1,//校验位
            checkScope2:checkScope2,//校验位
          })
    
   }

   handleOk() {
     const {editData,codeid,len,prefixScope,goodScope1,goodScope2,moneyScope1,moneyScope2,weightScope1,weightScope2,checkScope1,checkScope2}=this.state;
     const { getFieldDecorator,validateFields,getFieldsValue } = this.props.form;
     var that=this;
     const {codeName}=getFieldsValue();
      this.props.form.validateFields((err, values) => {
        if (err) {
          return;
        }
        if(!that.validator()){
          return;
        }else{
                if(codeid){
                  updateFreshCode({
                      codeid: codeid,
                      codeName	: codeName,
                      len:checkScope2,
                      prefixScope: prefixScope,
                      goodScope: `${goodScope1},${goodScope2}`,
                      moneyScope: `${moneyScope1},${moneyScope2}`,
                      weightScope: `${weightScope1},${weightScope2}`,
                      checkScope:`${checkScope1},${checkScope2}`
                  }).then(res=>{
                         if(parseInt(res.code)==200){
                          message.success("修改成功");
                          this.props.initCodes();
                          this.props.setVisible(false);//父组件显示隐藏
                          this.props.form.resetFields();
                              that.setState({
                              codeName:"",
                              prefixScope:"",//前缀
                              goodScope1:"",//商品编号
                              goodScope2:"",//商品编号
                              moneyScope1:"",//金额
                              moneyScope2:"",//金额
                              weightScope1:"",//重量
                              weightScope2:"",//重量
                              checkScope1:"",//校验位
                              checkScope2:"",//校验位
                              codeid:"",
                          })
                          that.props.changeData(this.state);
                      }else{
                          message.error(res.msg);
                      }
                  }).catch(e=>console.log(e));
                }else{
                    codeAssemble({
                      codeName	: codeName,
                      len: checkScope2,
                      prefixScope: prefixScope,
                      goodScope: `${goodScope1},${goodScope2}`,
                      moneyScope: `${moneyScope1},${moneyScope2}`,
                      weightScope: `${weightScope1},${weightScope2}`,
                      checkScope:`${checkScope1},${checkScope2}`
                  }).then(res=>{
                      if(parseInt(res.code)==200){
                          message.success("创建成功");
                          this.props.initCodes();
                          this.props.setVisible(false);//父组件显示隐藏
                          this.props.form.resetFields();
                            that.setState({
                              codeName:"",
                              prefixScope:"",//前缀
                              goodScope1:"",//商品编号
                              goodScope2:"",//商品编号
                              moneyScope1:"",//金额
                              moneyScope2:"",//金额
                              weightScope1:"",//重量
                              weightScope2:"",//重量
                              checkScope1:"",//校验位
                              checkScope2:"",//校验位
                              codeid:"",
                          })
                          that.props.changeData(this.state);
                      }else{
                          message.error(res.msg);
                      }
                        
                  }).catch(e=>console.log(e));
                }
        }

      });

  }

  changePrefixScope(prefixScope){
     const {goodScope1,goodScope2,moneyScope1,moneyScope2,weightScope1,weightScope2,checkScope1,checkScope2}=this.state;
     const p_len=prefixScope.length;
     this.setState({
            goodScope1:(parseInt(p_len)+1),
            goodScope2:parseInt(p_len)+4,
            moneyScope1:parseInt(p_len)+5,
            moneyScope2:parseInt(p_len)+7,
            weightScope1:parseInt(p_len)+8,
            weightScope2:parseInt(p_len)+10,
            checkScope1:parseInt(p_len)+11,
            checkScope2:parseInt(p_len)+13,
     },function(){
       this.props.changeData(this.state);
       this.validator();
     })
     
}
     changeGoodScope2(goodScope2){
        const {prefixScope,goodScope1,moneyScope1,moneyScope2,weightScope1,weightScope2,checkScope1,checkScope2}=this.state;
         goodScope2=parseInt(goodScope2);
        this.setState({
            moneyScope1:goodScope2+1,
            moneyScope2:goodScope2+3,
            weightScope1:goodScope2+4,
            weightScope2:goodScope2+6,
            checkScope1:goodScope2+7,
            checkScope2:goodScope2+9,
        },function(){
          this.props.changeData(this.state);
          this.validator();
        })
    }
     changeMoneyScope2(moneyScope2){
        const {prefixScope,goodScope1,goodScope2,moneyScope1,weightScope1,weightScope2,checkScope1,checkScope2}=this.state;
        moneyScope2=parseInt(moneyScope2);
        this.setState({
            weightScope1:moneyScope2+1,
            weightScope2:moneyScope2+3,
            checkScope1:moneyScope2+4,
            checkScope2:moneyScope2+6
        },function(){
          this.props.changeData(this.state);
          this.validator();
        })
    }
     changeWeightScope2(weightScope2){
        const {prefixScope,goodScope1,goodScope2,moneyScope1,moneyScope2,weightScope1,checkScope1,checkScope2}=this.state;
        weightScope2=parseInt(weightScope2);
        this.setState({
            checkScope1:weightScope2+1,
            checkScope2:weightScope2+3,
        },function(){
          this.props.changeData(this.state);
          this.validator();
        })
    }
    

  handleCancel(e) {
    this.props.form.resetFields();
    this.props.setVisible(false);//父组件显示隐藏
     this.setState({
           codeName:"",
           prefixScope:"",//前缀
           goodScope1:"",//商品编号
           goodScope2:"",//商品编号
           moneyScope1:"",//金额
           moneyScope2:"",//金额
           weightScope1:"",//重量
           weightScope2:"",//重量
           checkScope1:"",//校验位
           checkScope2:"",//校验位
           codeid:"",
           help:"",
           validateStatus:true
       })
  this.props.changeData(this.state);
  }

  validator(){
    const {help,validateStatus,codeName,prefixScope,goodScope1,goodScope2,moneyScope1,moneyScope2,weightScope1,weightScope2,checkScope1,checkScope2}=this.state;
   
     if(prefixScope.length>3){
        this.setState({
          help:"前缀数字最多不能超过三位数！",
          validateStatus:false
        })
        return false;
        
    }
     if(!((parseInt(goodScope2)-parseInt(goodScope1)+1)>=4 && (parseInt(goodScope2)-parseInt(goodScope1)+1)<=9)){
        this.setState({
          help:"商品码长度请设置在4-9位左右！",
          validateStatus:false
        })
        return false;
        
    }
     if(!((parseInt(moneyScope2)-parseInt(moneyScope1)+1)>=3 && (parseInt(moneyScope2)-parseInt(moneyScope1)+1)<=7)){
        this.setState({
          help:"商品金额码长度请设置在3-7位左右！",
          validateStatus:false
        })
        return false;
        
    }
     if(!((parseInt(weightScope2)-parseInt(weightScope1)+1)>=3 && (parseInt(weightScope2)-parseInt(weightScope1)+1)<=7)){
        this.setState({
          help:"商品重量码长度请设置在3-7位左右！",
          validateStatus:false
        })
        return false;
        
    }
    console.log((parseInt(checkScope2)-parseInt(checkScope1)+1))
     if(!((parseInt(checkScope2)-parseInt(checkScope1)+1)>=1 && (parseInt(checkScope2)-parseInt(checkScope1)+1)<=5)){
        this.setState({
          help:"商品校验码长度请设置在1-5位左右！",
          validateStatus:false
        })
        return false;
        
    }
    if(!prefixScope||!goodScope2||!moneyScope2||!weightScope2||!checkScope2){
        this.setState({
          help:"请完善条码位数设置！",
          validateStatus:false
        })
        return false;
    }else{
      this.setState({
          help:"",
          validateStatus:true
        })
      return true;
    }
  }

  render(){
    const {help,validateStatus,codeName,prefixScope,goodScope1,goodScope2,moneyScope1,moneyScope2,weightScope1,weightScope2,checkScope1,checkScope2}=this.state;
    const {visible,editData,renderStar}=this.props;
    const { getFieldDecorator } = this.props.form;

    const {codename,good,checkcode,id,len,money,prefix,weight}=editData;


    return (
      <div >
         <Modal
            title={codeName}
            visible={visible}
            width='574px'
            onOk={::this.handleOk} onCancel={::this.handleCancel}
            okText="确定"
            cancelText="重置"
            title={codeName?codeName:"请输入规则名称"} 
            wrapClassName={styles.freshCodeModal}
            >
            <div className={styles.freshCodeRules}>
               <Form inline style={{marginLeft:20}}>
                  <FormItem
                    label="规则名称"
                    
                    >
                    {getFieldDecorator('codeName', {
                      initialValue:codeName?codeName:"",
                      rules: [{ required: true, message: '请输入规则名称！' }],
                    })(
                        <Input placeholder="请输入规则名称"  style={{width:200}} onChange={(e)=>this.setState({codeName:e.target.value?e.target.value:"请输入规则名称"})}/>
                    )}
                    </FormItem>
                    <div className={styles.freshCodeTips}>
                      <span>1.请输入前缀</span>
                      <span>2.请设置位数： <em>建议商品码和商品验证码尽量不要超过8位</em></span>
                     </div>
                     <div className={styles.freshCodeInputs}>
                      <FormItem 
                            require
                            help={help?help:""}
                            validateStatus={validateStatus?"":"error"}
                            >
                        <span>
                          <Input placeholder="请输入2-3位数"  style={{marginRight:30}} value={prefixScope} type="number" onChange={(e)=>{this.setState({prefixScope:e.target.value});this.changePrefixScope(e.target.value)}} />
                        </span>
                        <span>
                          <Input disabled value={goodScope1}  type="number"  onChange={(e)=>{this.setState({goodScope1:e.target.value})}}/>-
                          <Input onChange={(e)=>{this.setState({goodScope2:e.target.value});this.changeGoodScope2(e.target.value)}} type="number"  value={goodScope2}/> <em></em>
                          <Input disabled value={moneyScope1}  type="number"  onChange={(e)=>{this.setState({moneyScope1:e.target.value})}}/>
                          -<Input  type="number" onChange={(e)=>{this.setState({moneyScope2:e.target.value});this.changeMoneyScope2(e.target.value)}} value={moneyScope2}/> <em></em>
                          <Input disabled value={weightScope1} type="number" onChange={(e)=>{this.setState({weightScope1:e.target.value})}}/>
                          -<Input  type="number" onChange={(e)=>{this.setState({weightScope2:e.target.value});this.changeWeightScope2(e.target.value)}} value={weightScope2}/> <em></em>
                          <Input disabled value={checkScope1}  type="number"  onChange={(e)=>{this.setState({checkScope1:e.target.value})}}/>-<Input  type="number" onChange={(e)=>{this.setState({checkScope2:e.target.value},function(){this.validator();});}} value={checkScope2}/> 
                        </span>
                        </FormItem>
                     </div>
                     <div className={styles.freshCodeDesc}>
                        <span>商品码</span>
                        <span>商品金额</span>
                        <span>商品重量</span>
                        <span>商品校验码</span>
                     </div>   
                     <div className={styles.freshCodeImg}>
                        <span>预览</span>
                        <span>
                          <p>
                              <em>{prefixScope?prefixScope:"***"}</em>
                              <em>{goodScope2?renderStar(parseInt(goodScope2)-parseInt(goodScope1)+1):"***"}</em>
                              <em>{goodScope2?renderStar(parseInt(moneyScope2)-parseInt(moneyScope1)+1):"***"}</em>
                              <em>{goodScope2?renderStar(parseInt(weightScope2)-parseInt(weightScope1)+1):"***"}</em>
                              <em>{goodScope2?renderStar(parseInt(checkScope2)-parseInt(checkScope1)+1):"***"}</em>
                          </p>
                          <img src={require('images/freshcode.jpg')} alt=""/>
                        </span>
                     </div>
                  </Form>
            </div>
        </Modal>
      </div>
    );
  }
}

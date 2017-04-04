import React, { PropTypes ,Component} from 'react';
import { Modal,Radio  } from 'antd';
import * as styles from './ticketShopModal.css'
import { USER_TYPE, COUPON_TYPE } from 'config/constants';
const RadioGroup = Radio.Group;

function shopItem({name,count, shopNames}, index) {
  return (
    <div key={index} className={styles.content}>
      <div>【 {name} 】<span>{count?count+"张":null}</span></div>
      <div>{shopNames.join('，')}</div>
    </div>
  );
}

export default class TicketShopModal extends Component {
  static propTypes = {
    shopsInfo: PropTypes.array.isRequired,
    visible: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
  }
  state={
    querytype:this.props.querytype
  }
  onChange(e) {
    this.props.callbackQuerytype(e.target.value);
    this.setState({
      querytype:e.target.value
    })
  }
 
  render(){
    const {shopsInfo,visible,onCancel,isretailer}=this.props;
    const {querytype}=this.state;
    return (
      <Modal
        title={
            <div className={styles.typeCheck}>券使用门店 
                <RadioGroup onChange={::this.onChange} value={parseInt(querytype)} defaultValue={parseInt(querytype)}>
                  {parseInt(isretailer)===0?<Radio value={1}>商户</Radio>:null}
                  <Radio value={2}>区域</Radio>
                </RadioGroup>
            </div>
          }
        visible={visible}
        footer={null}
        onCancel={onCancel}>
        <div className={styles.container}>
          {shopsInfo.length>0?shopsInfo.map(shopItem):"暂未分配门店"}
        </div>
      </Modal>
    );
  }
}

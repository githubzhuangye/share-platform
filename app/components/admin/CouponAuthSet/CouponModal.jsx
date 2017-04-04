import React, { PropTypes,Component  } from 'react';
import { Modal, Table, Select, Spin,Form ,Button,Input,message,Icon} from 'antd';
import styles from './style.css';


export default class CouponModal extends Component {


  render(){
   const {visible,handleOk,handleCancel,loading,modalData,openCoupon,closeCoupon,singleSaasname}=this.props;  
   var tag1,tag2;
     tag1=modalData.map((value,index)=>{
                        if(parseInt(value.status)==1){
                              return    <span className={styles.openLists} key={index} onClick={()=>closeCoupon(index)}>
                                                <Icon type="close-circle-o" id={value.id} />
                                                <Button type="dashed">{value.name}</Button>
                                        </span>
                                   
                        }

                    })
     tag2=modalData.map((value,index)=>{
                        if(parseInt(value.status)==0){
                                 return    <span className={styles.closeLists} key={index} onClick={()=>openCoupon(index)}>
                                                <Icon type="check-circle-o" id={value.id} />
                                                <Button type="dashed">{value.name}</Button>
                                            </span>
                        }

                    })
   if(modalData.length>0){
       return (
        <div >
            <Modal
                visible={visible}
                width='574px'
                onOk={handleOk} onCancel={handleCancel}
                okText="确定"
                cancelText="返回"
                title={`${singleSaasname}券种类配置`} 
                wrapClassName={styles.freshCodeModal}
                >
                <div>
                <Spin spinning={loading}>
                    <div className={styles.setType}>
                                    <div className={styles.setTitle}>已开启</div>
                                   <div className={styles.setLists}>{tag1} </div>
                                </div>
                           
                                <div className={styles.setType}>
                                    <div  className={styles.setTitle}>未开启</div>
                                    <div className={styles.setLists}>{tag2}</div>
                                </div>
                    </Spin>
                </div>
            
            </Modal>
        </div>
        ); 
   } else{
       return(
           <div >
            <Modal
                visible={visible}
                width='574px'
                onOk={handleOk} onCancel={handleCancel}
                okText="确定"
                cancelText="返回"
                title={`${singleSaasname}券种类配置`} 
                wrapClassName={styles.freshCodeModal}
                >
                <div>暂无数据</div>
            </Modal>
        </div>
       )
   }
    
  }
}

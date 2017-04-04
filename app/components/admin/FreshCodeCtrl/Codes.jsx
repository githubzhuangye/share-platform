import React, {Component} from 'react'
import styles from './style.css'
import {Card, Col, Row,Button,message } from 'antd'
import {delFreshCode}  from 'api/freshCode';


export default class Codes extends Component {

    onDelete(codeID){
        console.log(codeID)
        delFreshCode({
           codeid:codeID
       }).then(res=>{
          if(parseInt(res.code)==200){
              this.props.deleteArray()
              message.success("删除成功");
          }
       }).catch(e=>console.log(e));
    }

    

    render() {
        const {codesItem,loading,renderStar} = this.props;
        const {good,money,weight,checkcode}=codesItem;
        return (
                    <Col span="12">
                        <Card loading={false}  title={codesItem.codename} style={{marginBottom:20,marginRight:10,marginLeft:10}} >
                             <div className={styles.freshCode}> 
                                <span>{codesItem.prefix}</span>
                                <span>{renderStar(parseInt(good.split(",")[1])-parseInt(good.split(",")[0])+1)}</span>
                                <span>{renderStar(parseInt(money.split(",")[1])-parseInt(money.split(",")[0])+1)}</span>
                                <span>{renderStar(parseInt(weight.split(",")[1])-parseInt(weight.split(",")[0])+1)}</span>
                                <span>{renderStar(parseInt(checkcode.split(",")[1])-parseInt(checkcode.split(",")[0])+1)}</span> 
                            </div>
                            <div className={styles.freshImg}>
                                <img src={require("images/freshcode.jpg")} alt=""/>
                            </div>
                            <div className={styles.freshBtn}>
                                 <Button type="ghost" style={{marginRight:20}} onClick={()=>this.onDelete(codesItem.id)}>删除</Button>
                                 <Button type="primary" onClick={()=>this.props.showModal(true,this.props.index)}>修改</Button>
                            </div>  
                        </Card>
                    </Col>
        )
    }
}

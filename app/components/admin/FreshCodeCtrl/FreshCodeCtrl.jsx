import React, {Component} from 'react';
import styles from './style.css';
import {Card, Col, Row,Button } from 'antd';
import Codes  from './Codes';
import AddFreshCodes  from './AddFreshCodes';
import FreshCodeModal  from './FreshCodeModal';
import {queryFreshCode}  from 'api/freshCode';
import { cardable } from 'hoc';

@cardable(['生鲜券管理'])
export default class FreshCodeCtrl extends Component {
    state={
            visible:false,
            initCodesData:[],
            editData:{
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
            }
        }
    addCodes(){
        this.setState({
            visible:true,
            editData:{
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
            }
        })
    }

    componentDidMount(){
        this.initCodes();
    }

    initCodes(){
        queryFreshCode().then(res=>{
               if(parseInt(res.code)==200){
                   this.setState({
                       initCodesData:res.data
                   })
               }
        }).catch(e=>console.log(e));        
    }

    showModal(visible,index){
        const {initCodesData}=this.state;
         const {codename,good,checkcode,id,len,money,prefix,weight}= initCodesData[index]
         this.setState({
             visible:visible,
             editData:{
                codeName:codename,
                codeid:id,
                prefixScope:prefix,//前缀
                goodScope1:good.split(",")[0],//商品编号
                goodScope2:good.split(",")[1],//商品编号
                moneyScope1:money.split(",")[0],//金额
                moneyScope2:money.split(",")[1],//金额
                weightScope1:weight.split(",")[0],//重量
                weightScope2:weight.split(",")[1],//重量
                checkScope1:checkcode.split(",")[1],//校验位
                checkScope2:checkcode.split(",")[1],//校验位
             }
         })   
    }


    deleteArray(){
      this.initCodes();
    }

    setEditData(data){
        this.setState({
            editData:data
        })
    }

    setVisible(data){
        this.setState({
            visible:data,
        })
    }

    renderStar(num){
        var star="";
        if(num>0){
            for(let i=0;i<num;i++){
                star+="*"
            }
            return star;    
        }else{
            return "***"
        }
        
    }

    changeData(data){
        var getData;
       const {codeName,codeid,prefixScope,goodScope1,goodScope2,moneyScope1,moneyScope2,weightScope1,weightScope2,checkScope1,checkScope2}=data;
            getData={
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
            }     
        this.setState({
            editData:getData
        })
    }

    render() {
        const {visible,initCodesData,editData}=this.state;
           return (
                <div className={styles.container} >

                    <Row gutter={16}>
                    {
                        initCodesData.length>0?
                            initCodesData.map((value,index)=> 
                                <Codes codesItem={value} loading={true} key={index} renderStar={this.renderStar} index={index} showModal={::this.showModal}  deleteArray={::this.deleteArray}/>    
                            )
                            :void(0)
                    }
                    <AddFreshCodes addCodes={::this.addCodes} />
                    </Row>
                    <FreshCodeModal initCodes={::this.initCodes} visible={visible} changeData={::this.changeData}  renderStar={this.renderStar} setVisible={::this.setVisible} editData={editData} />
                </div>
            )     
        
    }
}

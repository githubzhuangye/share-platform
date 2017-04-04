import React, {Component} from 'react'
import { Form, Icon, Input, Button,message } from 'antd';
import styles from './style.css'
import CouponSearch from './CouponSearch.jsx'
import CouponTable from './CouponTable.jsx'
import CouponModal from './CouponModal.jsx'
import {changeBusinesstype,businessConfig,queryBusinesstype} from 'api/couponAuthSet'
import { cardable } from 'hoc';

@cardable(['券业务配置'])
export default class CouponAuthSet extends Component {
    constructor(props) {
        super(props)
        this.state = { visible: false,  //控制弹框显示隐藏状态
                        saasname: '', //商户名称
                        page:1, //table 当前页
                        businessData:{}, //table数据集
                        businessIndex:0,//数据集索引
                        modalData:[],//弹框数据集
                        loading:false, //tableloading状态
                        modalLoading:false, //弹框loading状态
                        saasid:"",//	商户id
                        singleSaasname:"",//设置弹框商户名称
                        modalBtnType:true //弹框按钮点击类型判别，用途：判定是确定提交还是返回取消，做差别数据请求
                     }
    }

    queryBusinesstype(){ //查询商户的券类型
        const {saasname,page}=this.state;
        this.setState({
            loading:true
        });
        queryBusinesstype({
            saasname,page
        }).then(res=>{ //調用異步接口
               console.log(res); 
               if(parseInt(res.code)==200){
                   this.setState({
                       businessData:res.data
                   })
               }else{
                   message.error(res.msg); //请求失败报错
               }
               this.setState({
                    loading:false
                });
        }).catch(e=>this.setState({loading:false }));     
    }

    couponSearch(){
        this.setState({
            page:1
        },function(){
            this.queryBusinesstype()
        })
    } 

    changeBusinesstype(){ //更改商户券类型
        const {saasid}=this.state;
         this.setState({
            modalLoading:true
        });
        changeBusinesstype({
            saasid
        }).then(res=>{ //調用異步接口
               console.log(res); 
               if(parseInt(res.code)==200){
                    this.setState({
                       modalData:res.data.business
                   })
               }else{
                   message.error(res.msg); //请求失败报错
               }
               this.setState({
                    modalLoading:false
                });
        }).catch(e=>this.setState({modalLoading:false }));   
    }
    closeCoupon(index){ //关闭券权限
       const {modalData}=this.state; 
       modalData[index].status=0;
       this.setState({
           modalData
       });
    }    
    openCoupon(index){ // 开启券权限 
       const {modalData}=this.state; 
       modalData[index].status=1;
       this.setState({
           modalData
       });
    }
    changeCouponType(){ //改变列表券权限显示
        const {businessData,modalData,businessIndex}=this.state;
        const {list}=businessData;
        businessData.list[businessIndex].business=[];
        modalData.map((value,index)=>{
            if(parseInt(value.status)==1){
                 businessData.list[businessIndex].business.push({id:value.id,name:value.name});   
            }
        });
        this.setState({
            businessData
        });
    }    
     businessConfig(){ //设置商户券类型
         const {modalData,saasid}=this.state;
         this.setState({
            modalLoading:true
        });
        businessConfig({
            saasid,
            business:JSON.stringify(modalData)
        }).then(res=>{ //調用異步接口
               if(parseInt(res.code)==200){
                   message.success(res.msg); //修改成功
               }else{
                   message.error(res.msg); //请求失败报错
               }
               this.setState({
                    modalLoading:false
                });
        }).catch(e=>this.setState({modalLoading:false }));   
    }

    handleOk(){ //弹框点击确定按钮
        this.setState({
            visible:false,
            modalBtnType:true
        },function(){
            this.businessConfig();//提交状态修改
            this.changeCouponType() //改变列表券权限显示
        })
    }

    handleCancel(){ //点击弹框取消按钮
        this.setState({
            visible:false,
            modalBtnType:false
        })
    }

    componentWillMount(){//dom初次渲染做的数据渲染动作
        this.queryBusinesstype(); //查询商户数据
    }

    showModal(saasid,saasname,index){
        const {modalBtnType,businessIndex}=this.state;
        this.setState({
            visible:true,
            saasid,
            singleSaasname:saasname,
            businessIndex:index
        },function(){
           if(modalBtnType||businessIndex!==index){
              this.changeBusinesstype();//更改商户券类型
           }      
        })
    }

    setSaasName(saasname){ //設置商戶名稱
        this.setState({
            saasname
        })
    }
    setPage(page){ //翻页设置页数
        this.setState({
            page
        },function(){
           this.queryBusinesstype(); //翻页数据加载
        })
    }

    render() {
        const {visible,businessData,page,loading,modalLoading,modalData,singleSaasname}=this.state;
        return (
            <div className={styles.container}>
                <CouponSearch setSaasName={::this.setSaasName} 
                              couponSearch={::this.couponSearch}
                              /> 
                <CouponTable showModal={::this.showModal} 
                             dataSource={businessData} 
                             setPage={::this.setPage}
                             queryBusinesstype={::this.queryBusinesstype}
                             page={page}
                             loading={loading}
                             /> 
                <CouponModal visible={visible} 
                             handleOk={::this.handleOk} 
                             handleCancel={::this.handleCancel}
                             loading={modalLoading}
                             modalData={modalData}
                             openCoupon ={::this.openCoupon}
                             closeCoupon ={::this.closeCoupon}
                             singleSaasname={singleSaasname}
                             /> 
            </div>
        )
    }
}

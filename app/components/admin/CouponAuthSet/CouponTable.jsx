import React, {Component} from 'react'
import styles from './style.css'
import {Input, Button, Table,message,Tooltip} from 'antd'


export default class CouponTable extends Component {  //商户列表信息
    constructor(props) {
        super(props)
        this.state = {
            dataSource: [],
            count: 0,
            couponname: '',
            curpage: 1,
            beginDate: null,
            endDate: null,
            loading: false
        }
    }


    replaceLastLetter(str,letter){
        var tempStr = str.substring(0,str.length-1);
        tempStr =tempStr +letter;
        return tempStr;
    }

    getColumns() {
        const that = this
        const columns = [
            {
                title: '商户名称',
                dataIndex: 'saasname',
                key: 'saasname',
            }, {
                title: '已开通券业务',
                dataIndex: 'business',
                key: 'business',
                 render(text, record, index) {
                    var texts = text.map((value,index)=>index==text.length-1?value.name+"":value.name+"/");
                    var tooltexts=text.map((value,index)=>index==text.length-1?value.name:value.name+"，");
                    return(
                        <div>
                            <Tooltip placement="bottomLeft" title={tooltexts.length>1&&tooltexts!="null"?tooltexts:"暂未开通券业务"}>
                                <span className={styles.couponLimit}>{texts.length>0&&texts!="null"?texts:"暂未开通券业务"}</span>
                            </Tooltip>
                        </div>
                    )
                }
            },
             {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                render(text, record, index) {
                    return <a href="javascript:void(0)" onClick={()=>that.props.showModal(record.saasid,record.saasname,index)}>更改</a>
                }
            },
            {
                title: '最后更改时间',
                dataIndex: 'updatetime',
                key: 'updatetime',
            },
        ]
        return columns
    }

    changePage(e) {
        this.props.setPage(e); //设置页码  
    }

    render() {
        const {dataSource,page,loading}=this.props;
        const pagination = {
            current: Number(page),
            total: Number(dataSource.totalcount),
            onChange: ::this.changePage
        }
        return ( 
            <div>
                <Table dataSource={dataSource.list} columns={this.getColumns()} loading={loading} pagination={pagination}/>
            </div>
        )
    }
}


import React, {Component} from 'react'
import { Form, Icon, Input, Button } from 'antd';
import styles from './style.css'

const FormItem = Form.Item;


export default class CouponSearch extends Component { //商户搜索框


    render() {
      
        return (
            <Form inline onSubmit={this.handleSubmit}>
                    <FormItem label="商户名称" style={{marginBottom:20}}>
                        <Input placeholder="请输入商户名称" onChange={(e)=>{this.props.setSaasName(e.target.value)}} style={{width:250,marginRight:20}}/>
                    </FormItem>
                    <FormItem>
                    <Button type="primary" onClick={this.props.couponSearch}>查询</Button>
                    </FormItem>
                </Form>
        )
    }
}  


import React,{ PropTypes, Component }  from 'react';
import {  Input,Form,Select,TimePicker } from 'antd';
import FreshCtrl from './FreshCtrl';
const FormItem = Form.Item;

export default  class FreshCtrlCouple extends Component {
    render(){
        return (
            <div>
               <FreshCtrl form={this.props.form}/>
            </div>
        );
    }
};
 
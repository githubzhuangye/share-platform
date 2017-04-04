import React, {PropTypes, Component} from 'react';
import {Form, Select, Radio} from 'antd';
import {formItemLayout} from '../constants.js';
import {wxTypeFieldDecorator, getFieldDecorator} from '../PublishForm/validator.js';
import styles from '../styles.css';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

export default class CouponWechatType extends Component {
    onChange(e) {
        const {form} = this.props;
        this.props.form.setFieldsValue({wechat_can_share: e.target.value});
    }

    onChangeFriend(e) {
        const {form} = this.props;
        this.props.form.setFieldsValue({wechat_can_give_friend: e.target.value});
    }

    render() {
        const {form} = this.props;
        return (
            <div>

                <FormItem label="卡券背景颜色" {...formItemLayout} required>
                    {wxTypeFieldDecorator(form, 'wechat_color', 'Color010', '请选择卡券背景颜色')(
                        <Select style={{
                            width: 276
                        }}>
                            <Option value="Color010" className={styles.wxSelectBox}>
                                <span className={styles.c1}></span>
                            </Option>
                            <Option value="Color020" className={styles.wxSelectBox}>
                                <span className={styles.c2}></span>
                            </Option>
                            <Option value="Color030" className={styles.wxSelectBox}>
                                <span className={styles.c3}></span>
                            </Option>
                            <Option value="Color040" className={styles.wxSelectBox}>
                                <span className={styles.c4}></span>
                            </Option>
                            <Option value="Color050" className={styles.wxSelectBox}>
                                <span className={styles.c5}></span>
                            </Option>
                            <Option value="Color060" className={styles.wxSelectBox}>
                                <span className={styles.c6}></span>
                            </Option>
                            <Option value="Color070" className={styles.wxSelectBox}>
                                <span className={styles.c7}></span>
                            </Option>
                            <Option value="Color080" className={styles.wxSelectBox}>
                                <span className={styles.c8}></span>
                            </Option>
                            <Option value="Color090" className={styles.wxSelectBox}>
                                <span className={styles.c9}></span>
                            </Option>
                            <Option value="Color100" className={styles.wxSelectBox}>
                                <span className={styles.c10}></span>
                            </Option>
                        </Select>
                    )}
                </FormItem>

                <FormItem label="券条码展示形式" {...formItemLayout} required>
                    {wxTypeFieldDecorator(form, 'wechat_code_type', 'CODE_TYPE_TEXT', '请选择券条码展示形式')(
                        <Select style={{
                            width: 276
                        }}>
                            <Option value="CODE_TYPE_TEXT">文本</Option>
                            <Option value="CODE_TYPE_BARCODE">一维码</Option>
                            <Option value="CODE_TYPE_QRCODE">二维码</Option>
                            <Option value="CODE_TYPE_ONLY_QRCODE">仅显示二维码</Option>
                            <Option value="CODE_TYPE_ONLY_BARCODE">仅显示一维码</Option>
                        </Select>
                    )}
                </FormItem>

                <FormItem label="是否可分享" {...formItemLayout} required>
                    {form.getFieldDecorator("wechat_can_share", {initialValue: false})(
                        <RadioGroup onChange={:: this.onChange}>
                            <Radio key="false" value={false}>否
                            </Radio>
                            <Radio key="true" value={true}>是</Radio>
                        </RadioGroup>
                    )}
                </FormItem>

                <FormItem label="是否可转增给朋友" {...formItemLayout} required>
                    {form.getFieldDecorator("wechat_can_give_friend", {initialValue: false})(
                        <RadioGroup onChange={:: this.onChangeFriend}>
                            <Radio key="false" value={false}>否
                            </Radio>
                            <Radio key="true" value={true}>是</Radio>
                        </RadioGroup>
                    )}
                </FormItem>

            </div>

        );
    }
}

import React, { PropTypes, Component } from 'react';
import { Form, Input, Row, Col, Button, Spin, message } from 'antd';
import { validateFields, checkPhone, addRequiredDecorator } from 'helpers/util';
import { CardUpload } from 'components';
import { IMAGE_TYPE } from 'config/constants';
import { settingApi } from 'api';

const FormItem = Form.Item;
const { USER_INFO, LOGO } = IMAGE_TYPE;
const formItemLayout = {
  labelCol: {span: 6},
  wrapperCol: {span: 16},
};

@Form.create()
export default class ProfileSetting extends Component {
  static propTypes = {
    setUsername: PropTypes.func.isRequired,
    setSaasLogo: PropTypes.func.isRequired,
  }
  state = {
    loading: true,
  }
  componentDidMount() {
    this.update();
  }
  update() {
    this.setState({loading: true});
    return settingApi.queryUserInfo()
      .then(data => {
        this.setState({loading: false});
        this.props.form.setFieldsValue(data);
        // 需要单独为资质字段设置
        this._license.initUploadBox(data.license);
      })
      .catch(error => {
        this.setState({loading: false});
        message.error(error.message);
      });
  }
  handleUpdateBtnClick() {
    const license = this._license.getUrls();
    if (license.length === 0) {
      return message.error('资质信息不能为空！');
    }
    // TODO: hack
    validateFields(this.props.form)
      .then(data => {
        this.setState({loading: true});
        if (!data.clientInfo) data.clientInfo = ' '; // backend shit
        if (!data.brand) data.brand = ' ';
        delete data.username;
        settingApi.updateUserInfo({...data, license})
          .then(() => {
            return this.update();
          })
          .then(() => message.success('更新成功'))
          .then(() => {
            this.props.setUsername(data.saasName);
            this.props.setSaasLogo(data.saaslogo);
          })
          .catch(error => message.error(error.message));
      })
      .catch(error => message.error(error.message));
  }
  render() {
    const { loading } = this.state;
    const { getFieldDecorator } = this.props.form;
    const requiredDecorators = addRequiredDecorator(['respName', 'saasName', 'saaslogo'], getFieldDecorator);
    const phoneFieldDecorator = getFieldDecorator('respPhone', {
      validate: [{
        rules: [
          { required: true, message: '请输入该选项' },
          { validator: (_, value, callback) => !value || checkPhone(value) ? callback() : callback('手机号码格式有误') },
        ],
        trigger: 'onBlur'
      }]
    });
    return (
      <Spin spinning={loading}>
      <Form style={{maxHeight: '400px', overflow: 'auto', marginTop: '8px'}}>
        <FormItem label="用户名" {...formItemLayout}>
          {getFieldDecorator('username')(
            <Input placeholder="请输入用户名" disabled/>
          )}
        </FormItem>
        <FormItem label="负责人姓名" {...formItemLayout}>
          {requiredDecorators('respName')(
            <Input placeholder="请输入负责人姓名"/>
          )}
        </FormItem>
        <FormItem label="负责人电话" {...formItemLayout}>
          {phoneFieldDecorator(
            <Input placeholder="如果是固定电话，请用以下格式输入:区号-号码"/>
          )}
        </FormItem>
        <FormItem label="商户名称" {...formItemLayout}>
          {requiredDecorators('saasName')(
            <Input placeholder="请输入商户名称"/>
          )}
        </FormItem>
        <FormItem label="商户logo" {...formItemLayout}
          help="最多能上传1张。建议：图片重点内容居中，大小不超过5m，格式: bmp, png, jpeg, jpg, gif；">
          {requiredDecorators('saaslogo')(
            <CardUpload type={LOGO.value}/>
          )}
        </FormItem>
        <FormItem label="资质信息" {...formItemLayout} required
          help="可以上传多张。建议：图片重点内容居中，大小不超过5m，格式: bmp, png, jpeg, jpg, gif；">
          <CardUpload 
            type={USER_INFO.value} 
            multiple={true} 
            ref={license => this._license = license}/>
        </FormItem>
        <FormItem label="详细地址" {...formItemLayout}>
          {getFieldDecorator('address')(
            <Input placeholder="请输入详细地址"/>
          )}
        </FormItem>
        <FormItem label="客户概况" {...formItemLayout}>
          {getFieldDecorator('clientInfo')(
            <Input type="textarea" placeholder="请简单描述客户信息"/>
          )}
        </FormItem>
        <FormItem label="经营品牌" {...formItemLayout}>
          {getFieldDecorator('brand')(
            <Input placeholder="请输入经营品牌"/>
          )}
        </FormItem>
        <Row>
          <Col offset={6}>
            <Button type="primary" onClick={::this.handleUpdateBtnClick}>修改</Button>
          </Col>
        </Row>
      </Form>
      </Spin>
    );
  }
}

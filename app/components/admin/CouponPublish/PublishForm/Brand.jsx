import React, { PropTypes, Component } from 'react';
import { Form, Col, Input, Select, message, Upload, Icon, Button } from 'antd';
import { COUPON_TYPE, host } from 'config/constants';
import { addRequiredDecorator, validateFields, generateAuthFields } from 'helpers/util';
import hqable from './hqable.hoc';

const { BRAND } = COUPON_TYPE;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 14 },
};

import { QModeSelection, CouponType, Budget, Pic, CouponLimitation, ValidateDate,
  Market, MinFee, CouponName, SaveEditAndBack, SubmitAndReset } from 'components/admin/CouponPublish';
import { CouponTypeContainer, UserIdentityContainer } from 'containers/admin/CouponPublish';

export default class Brand extends Component {
  static propTypes = {
    isEdit: PropTypes.bool.isRequired,
    form: PropTypes.object.isRequired,
    userType: PropTypes.number.isRequired,
    selectedMarketList: PropTypes.array.isRequired,
    onCouponTypeChange: PropTypes.func.isRequired,
    onMarketClick: PropTypes.func.isRequired,
    saveEdit: PropTypes.func.isRequired,
    back: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    submit: PropTypes.func.isRequired,
    format: PropTypes.func.isRequired,
  }
  state = {
    fileList: [],
    goodid: '',
  }
  formatFormData(formData) {
    const { isSelectMode, format } = this.props;
    const result = format(formData);

    // 品牌券字段
    result['budget'] = formData.budget * 100;
    result['expect'] = formData.rate;
    result['goodid'] = {value: this.state.goodid};
    result['minfee'] = formData.minfee * 100;

    // 如果是会抢模式，多一个hq_type字段
    if (isSelectMode === 1) {
      result['hq_type'] = formData.hqType;
    }

    return result;
  }
  handleSubmit() {
    const { form, selectedMarketList, submit, format, isSelectMode } = this.props;
    if (isSelectMode !== 1 && selectedMarketList.length === 0) {
      message.error('请选择门店');
      validateFields(form).catch(console.log);
      return;
    }

    if (!this.state.goodid) {
      message.error('请上传商品列表文件');
      validateFields(form).catch(console.log);
      return;
    }

    validateFields(form)
      .then(::this.formatFormData)
      .then(submit)
      .catch(console.log);
  }
  handleReset() {
    this.props.reset();
    this.setState({fileList: []});
  }
  handleUploadChange(info) {
    const fileList = info.fileList.slice(-1)
      .filter(file => {
        if (file.response) {
          if (+file.response.code !== 200) {
            message.error(file.response.msg);
            return false;
          } else {
            return true;
          }
        }
        return true;
      })
      .map(file => {
        if (file.response) {
          this.setState({goodid: file.response.data.name});
        }
        return file;
      });

    this.setState({ fileList });
  }
  uploadProps() {
    return {
      action: `${host}/cp/message/m_fileUpload.action`,
      name: 'paper',
      data: { ...generateAuthFields(), type: 1 },
      onChange: ::this.handleUploadChange,
    };
  }
  render() {
    const { isEdit, form, userType, selectedMarketList, onCouponTypeChange, onMarketClick,
      saveEdit, back, submit, isSelectMode, onHQModeChange } = this.props;
    return (
      <Form>
        <UserIdentityContainer
          isEdit={isEdit}/>
        <CouponTypeContainer
          isEdit={isEdit}/>
        {isSelectMode === 1 && <QModeSelection form={form}/>}
        <Budget
          isEdit={isEdit}
          couponType={BRAND.value}
          form={form}/>
        <Pic form={form} isBrand={true}/>
        <FormItem label="商品列表文件" {...formItemLayout} required style={{marginBottom: '6px'}}>
          <Upload {...this.uploadProps()} fileList={this.state.fileList} disabled={isEdit}>
            <Button type="ghost">
              <Icon type="upload" /> 上传文件
            </Button>
          </Upload>
          <span style={{color: '#999', display: 'inline-block', marginTop: '2px', lineHeight: '1.2'}}>
            请上传excel文件，每行3列，3列依次为：商品69码-商品名称-商品价格。
            <a href="http://114.55.54.147/coupon/goods.xlsx">下载样本excel</a>
          </span>
        </FormItem>
        <CouponLimitation
          isEdit={isEdit}
          form={form}/>
        <ValidateDate form={form}/>
        {isSelectMode !== 1 && <Market onMarketClick={onMarketClick} selectedMarketList={selectedMarketList}/>}
        <MinFee form={form} isEdit={isEdit}/>
        <CouponName form={form}/>
        {isEdit
        ? <SaveEditAndBack onSaveEdit={saveEdit} onBack={back}/>
        : <SubmitAndReset onSubmit={::this.handleSubmit} onReset={::this.handleReset}/>}
      </Form>
    );
  }
}

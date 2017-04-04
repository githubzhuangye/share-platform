import React, { PropTypes } from 'react';
import { Form } from 'antd';
import { IMAGE_TYPE } from 'config/constants';
import { formItemLayout } from '../constants.js';

import { CardUpload } from 'components';

const FormItem = Form.Item;

Pic.propTypes = {
  form: PropTypes.object.isRequired,
  isBrand: PropTypes.bool,
};

export default function Pic({form, isBrand, isSelectMode, isMyVip}) {
  return (
    <FormItem label={isBrand ? "品牌图片" : "商品图片"} {...formItemLayout} required={isSelectMode===3 ? true : false}
      style={isSelectMode === 2 && !isMyVip ? {display:'none'}: {display:'block'}}
      help="建议：图片重点内容居中，最多能上传1张。大小: 不超过300k；格式: 格式: bmp, png, jpeg, jpg, gif；建议尺寸800*600px">
      {form.getFieldDecorator('couponpic')(
        <CardUpload type={IMAGE_TYPE.PRODUCT.value}/>
      )}
    </FormItem>
  );
}

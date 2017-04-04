import React, { PropTypes } from 'react';
import { Form, Button } from 'antd';

import { ConfirmModalContainer } from 'containers/admin/CouponPublish';

const FormItem = Form.Item;

SubmitAndReset.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
};

export default function SubmitAndReset({onSubmit, onReset, isSelectMode, isMyVip}) {
  return (
    <div style={isSelectMode === 2 && !isMyVip ? {display:'none'}: {display:'block'}}>
      <hr style={{ height: 1, border: 'none', borderTop: '1px #ececec solid', marginBottom: 24 }}/>
      <FormItem wrapperCol={{ span: 14, offset: 4 }}>
        <Button type="primary" onClick={onSubmit} style={{ width: 68, marginRight: 10 }}>创建</Button>
        <Button type="ghost" onClick={onReset} style={{ width: 68 }}>重置</Button>
      </FormItem>
      <ConfirmModalContainer resetForm={onReset}/>
    </div>
  );
}

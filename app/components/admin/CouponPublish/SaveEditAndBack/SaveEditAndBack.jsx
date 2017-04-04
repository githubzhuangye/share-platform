import React, { PropTypes } from 'react';
import { Form, Button } from 'antd';

const FormItem = Form.Item;

SaveEditAndBack.propTypes = {
  onSaveEdit: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default function SaveEditAndBack({onSaveEdit, onBack, isSelectMode, isMyVip}) {
  return (
    <div style={isSelectMode === 2 && !isMyVip ? {display:'none'}: {display:'block'}}>
      <hr style={{ height: 1, border: 'none', borderTop: '1px #ececec solid', marginBottom: 24 }}/>
      <FormItem wrapperCol={{ span: 14, offset: 4 }}>
        <Button type="primary" onClick={onSaveEdit} style={{ width: 68, marginRight: 10 }}>保存</Button>
        <Button type="ghost" onClick={onBack} style={{ width: 68 }}>返回</Button>
      </FormItem>
    </div>
  );
}

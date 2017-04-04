import React, { PropTypes } from 'react';
import { Form } from 'antd';
import { formItemLayout } from '../constants.js';
import { MarketSelectionContainer } from 'containers/admin/CouponPublish';

const FormItem = Form.Item;

Market.propTypes = {
  onMarketClick: PropTypes.func.isRequired,
  selectedMarketList: PropTypes.array.isRequired,
};

export default function Market({onMarketClick, selectedMarketList, isSelectMode, isMyVip}) {
  return (
    <FormItem label="券适用门店" {...formItemLayout} required style={isSelectMode === 2 && !isMyVip ? {display:'none'}: {display:'block'}}>
      <a onClick={onMarketClick}>选择门店</a>
      <span style={{ margin: '0 5px 0 10px', color: '#999' }}>已选门店数</span>
      <span style={{ color: '#f98375' }}>{selectedMarketList.length}</span>
      <MarketSelectionContainer isSelectMode={isSelectMode} isMyVip={isMyVip}/>
    </FormItem>
  );
}

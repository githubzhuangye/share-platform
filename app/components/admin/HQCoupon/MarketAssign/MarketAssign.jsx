import React, { PropTypes } from 'react';
import { Modal, Row, Col, Spin } from 'antd';

import { MarketSelectionContainer } from 'containers/admin/CouponPublish';

function MarketItem({cityName, marketNames}) {
  return (
    <div style={{padding: '5px 0'}}>
      <div>【 {cityName} 】</div>
      <div>{marketNames.join('，')}</div>
    </div>
  );
}

MarketAssign.propTypes = {
  cityMarketPair: PropTypes.array.isRequired,
  marketInfo: PropTypes.object.isRequired,
  onOk: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onAssignBtnClick: PropTypes.func.isRequired,
}

export default function MarketAssign({loading, cityMarketPair, marketInfo, onOk, onCancel, onAssignBtnClick}) {
  return (
    <Modal
      visible={true}
      title="券名称"
      width="600px"
      onCancel={onCancel}
      onOk={onOk}>
      <Spin spinning={loading}>
        <Row style={{minHeight: '300px'}}>
          <Col offset={1} span={8}>
            <h2 style={{marginBottom: '10px'}}>券分配门店</h2>
            <a style={{marginRight: '20px'}} onClick={onAssignBtnClick}>选择门店</a>
            <span>已选择门店数<span style={{color: '#f55f4e'}}>{marketInfo.targetKeys.length}</span>家</span>
          </Col>
          <Col offset={2} span={13}>
            {cityMarketPair.map((item, index) =>
              <MarketItem key={index} cityName={item.cityName} marketNames={item.marketNames}/>
            )}
          </Col>
        </Row>
        <MarketSelectionContainer/>
      </Spin>
    </Modal>
  );
}

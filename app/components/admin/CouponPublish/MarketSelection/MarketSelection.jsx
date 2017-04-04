import React, { Component, PropTypes } from 'react';
import { Modal, TreeSelect, Select, Transfer, Button } from 'antd';
import { USER_TYPE } from 'config/constants';
import { transformProviceAndCity } from 'helpers/util';

import { BrandlerMarket, RetailerMarket, AlipayMarket } from './MarketItem';

export default class MarketSelection extends Component {
  static propTypes = {
    provinceAndCity: PropTypes.array.isRequired,
    saasList: PropTypes.array.isRequired,
    nextMarkets: PropTypes.array.isRequired,
    visible: PropTypes.bool.isRequired,
    userType: PropTypes.number.isRequired,
    onRegionChange: PropTypes.func.isRequired,
    onSaasIdChange: PropTypes.func.isRequired,
    onMarketChange: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onOk: PropTypes.func.isRequired,
    onAddSaasBtnClick: PropTypes.func.isRequired,
    onRemoveSaasBtnClick: PropTypes.func.isRequired,
  }
  render() {
    const { visible, saasList, provinceAndCity, nextMarkets, userType, onRegionChange, onSaasIdChange,
      onAddSaasBtnClick, onCancel, onMarketChange, onOk, onRemoveSaasBtnClick,isSelectMode, isMyVip } = this.props;
    return (
      <Modal title="门店选择" visible={visible} onCancel={onCancel} onOk={onOk}>
        {userType === USER_TYPE.RETAILER.value
        ? <RetailerMarket
            selectedRegion={nextMarkets[0].selectedRegion}
            allRegion={nextMarkets[0].allRegion}
            dataSource={nextMarkets[0].dataSource}
            targetKeys={nextMarkets[0].targetKeys}
            isSelectMode={isSelectMode}
            isMyVip={isMyVip}
            onRegionChange={region => onRegionChange(region, 0)}
            onMarketChange={targetKeys => onMarketChange(targetKeys, 0)}/>
        : <div style={isSelectMode === 2 ? {display:'none'}: {display:'block',height: '320px', overflow: 'auto'}}>
            {nextMarkets.map((item, index) =>
              <BrandlerMarket
                key={index}
                saasId={item.saasId}
                saasList={filterSaasList(nextMarkets, index, saasList)}
                selectedRegion={item.selectedRegion}
                allRegion={item.allRegion}
                dataSource={item.dataSource}
                targetKeys={item.targetKeys}
                isSelectMode={isSelectMode}
                isMyVip={isMyVip}
                isRemoveBtnVisible={nextMarkets.length > 1}
                onRemoveBtnClick={() => onRemoveSaasBtnClick(index)}
                onSaasIdChange={saas => onSaasIdChange(saas, index)}
                onRegionChange={region => onRegionChange(region, index)}
                onMarketChange={targetKeys => onMarketChange(targetKeys, index)}/>
            )}
            {/* <Button type="primary" onClick={onAddSaasBtnClick}>增加新商户</Button> */}
          </div>}
          {/*口碑营销模式*/}
          {isSelectMode === 2 && isMyVip ?
              <AlipayMarket
                  selectedRegion={nextMarkets[0].selectedRegion}
                  allRegion={nextMarkets[0].allRegion}
                  dataSource={nextMarkets[0].dataSource}
                  targetKeys={nextMarkets[0].targetKeys}
                  isSelectMode={isSelectMode}
                  isMyVip={isMyVip}
                  onRegionChange={region => onRegionChange(region, 0)}
                  onMarketChange={targetKeys => onMarketChange(targetKeys, 0)}/>
              : null
          }

      </Modal>
    );
  }
}

// 过滤其他项中已选过的saasId
function filterSaasList(nextMarkets, index, saasList) {
  const saasIds = nextMarkets.map(market => market.saasId);
  const willFilteredSaasIds = [...saasIds.slice(0, index), ...saasIds.slice(index + 1)].filter(saasId => !!saasId);
  return saasList.filter(
    saas => willFilteredSaasIds.findIndex(willFilteredSaasId => willFilteredSaasId === saas.SAAS) === -1
  );
}

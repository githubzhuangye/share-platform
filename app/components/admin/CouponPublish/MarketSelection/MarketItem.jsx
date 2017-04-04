import React, { PropTypes } from 'react';
import { Select, TreeSelect, Transfer, Icon } from 'antd';
import { generateOptions } from 'helpers/util';

BrandlerMarket.propTypes = {
  saasId: PropTypes.string,
  saasList: PropTypes.array.isRequired,
  selectedRegion: PropTypes.array.isRequired,
  allRegion: PropTypes.array.isRequired,
  dataSource: PropTypes.array.isRequired,
  targetKeys: PropTypes.array.isRequired,
  isRemoveBtnVisible: PropTypes.bool.isRequired,
  onSaasIdChange: PropTypes.func.isRequired,
  onRegionChange: PropTypes.func.isRequired,
  onMarketChange: PropTypes.func.isRequired,
  onRemoveBtnClick: PropTypes.func.isRequired,
};

export function BrandlerMarket(props) {
  const { saasId, saasList, allRegion, onSaasIdChange, selectedRegion, onRegionChange, dataSource, targetKeys,
    onMarketChange, onRemoveBtnClick, isRemoveBtnVisible,isSelectMode ,isMyVip } = props;
  return (
    <div style={isSelectMode === 2 ? {display:'none'}: {display:'block',marginBottom: '16px'}}>
      <Select
        value={saasId}
        allowClear
        style={{ width: 300 }}
        placeholder="请选择商户"
        optionFilterProp="children"
        notFoundContent="无法找到"
        onChange={onSaasIdChange}>
        {generateOptions(saasList, 'SAAS', 'NAME')}
      </Select>
      {isRemoveBtnVisible
      ? <span style={{float: 'right', marginRight: '120px', 'transform': 'scale(1.5)', cursor: 'pointer'}}
          onClick={onRemoveBtnClick}>
          <Icon type="close-square-o" />
        </span>
      :null}
      <TreeSelect
        value={selectedRegion}
        style={{width: 300, marginBottom: '8px', marginTop: '8px'}}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        multiple
        treeCheckable
        allowClear
        disabled={!saasId}
        placeholder={!saasId? '请先选择商户，再选择区域' : '请选择区域，手动输入无效'}
        treeData={allRegion}
        onChange={onRegionChange}/>
      <Transfer
        titles={['可选门店', '已选门店']}
        dataSource={dataSource}
        targetKeys={targetKeys}
        render={item => item.title}
        onChange={onMarketChange}/>
    </div>
  );
}

RetailerMarket.propTypes = {
  selectedRegion: PropTypes.array.isRequired,
  allRegion: PropTypes.array.isRequired,
  dataSource: PropTypes.array.isRequired,
  targetKeys: PropTypes.array.isRequired,
  onRegionChange: PropTypes.func.isRequired,
  onMarketChange: PropTypes.func.isRequired,
};

export function RetailerMarket(props) {
  const { allRegion, selectedRegion, onRegionChange, dataSource, targetKeys,
    onMarketChange, isSelectMode, isMyVip } = props;
  return (
    <div style={isSelectMode === 2 ? {display:'none'}: {display:'block'}}>
      <TreeSelect
        value={selectedRegion}
        style={{width: 300, marginBottom: '8px', marginTop: '8px'}}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        multiple
        treeCheckable
        allowClear
        placeholder={'请选择区域，手动输入无效'}
        treeData={allRegion}
        onChange={onRegionChange}/>
      <Transfer
        titles={['可选门店', '已选门店']}
        dataSource={dataSource}
        targetKeys={targetKeys}
        render={item => item.title}
        onChange={onMarketChange}/>
    </div>
  );
}

AlipayMarket.propTypes = {
  selectedRegion: PropTypes.array.isRequired,
  allRegion: PropTypes.array.isRequired,
  dataSource: PropTypes.array.isRequired,
  targetKeys: PropTypes.array.isRequired,
  onRegionChange: PropTypes.func.isRequired,
  onMarketChange: PropTypes.func.isRequired,
};

export function AlipayMarket(props) {
  const { allRegion, selectedRegion, onRegionChange, dataSource, targetKeys,
    onMarketChange } = props;
  return (
    <div>
      <TreeSelect
        value={selectedRegion}
        style={{width: 300, marginBottom: '8px', marginTop: '8px'}}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        multiple
        treeCheckable
        allowClear
        placeholder={'请选择区域，手动输入无效'}
        treeData={allRegion}
        onChange={onRegionChange}/>
      <Transfer
        titles={['可选门店', '已选门店']}
        dataSource={dataSource}
        targetKeys={targetKeys}
        render={item => item.title}
        onChange={onMarketChange}/>
    </div>
  );
}

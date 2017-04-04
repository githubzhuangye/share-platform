import React, { PropTypes } from 'react';
import { Button } from 'antd';

QueryAndExportBtns.propTypes = {
  onQueryBtnClick: PropTypes.func,
  onExportBtnClick: PropTypes.func
};

export default function QueryAndExportBtns({onQueryBtnClick, onExportBtnClick}) {
  return (
    <div style={{display: 'inline-block'}}>
      <Button type="primary" size="small" onClick={onQueryBtnClick}>查询</Button>
      { onExportBtnClick
        ? <Button type="primary" size="small" onClick={onExportBtnClick} style={{marginLeft: '8px'}}>导出</Button>
      : null }
    </div>
  );
}

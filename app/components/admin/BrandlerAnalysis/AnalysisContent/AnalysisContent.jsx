import React, { PropTypes } from 'react';
import { Icon } from 'antd';
import styles from './styles.css';
import { generateAuthFields, fuckBackend } from 'helpers/util';
import { host } from 'config/constants';

AnalysisContent.propTypes = {
  children: PropTypes.node.isRequired,
  extra: PropTypes.node,
  exportUrl: PropTypes.string,
  exportParams: PropTypes.object,
  hideExportBtn: PropTypes.bool.isRequired,
};

AnalysisContent.defaultProps = {
  hideExportBtn: false,
};

export default function AnalysisContent({children, extra, exportUrl, exportParams, hideExportBtn}) {
  return (
    <div className={styles.container}>
      <div className={styles.chart}>{children}</div>
      <div className={styles.extra}>
        {extra}
        {!hideExportBtn
        ? <div className={styles.export}>
            详细报表导出
            <a className={styles.icon}>
              <Icon type="export" style={{transform: 'scale(1.5)'}} onClick={() => handleExportClick(exportUrl, exportParams)}/>
            </a>
          </div>
        : null
        }
      </div>
    </div>
  );
}

function handleExportClick(exportUrl = `${host}/cp/brand/brand_exportCouponComp.action`, exportParams) {
  window.location.assign(exportUrl + '?' + fuckBackend({...exportParams, ...generateAuthFields()}));
}

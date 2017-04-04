import React, { PropTypes } from 'react';
import { DIMENSIONS } from 'config/constants';

CouponList.propTypes = {
  dataSource: PropTypes.array.isRequired,
  dimension: PropTypes.string,
};

export default function CouponList({dataSource, dimension}) {
  return (
    <table width="320">
      <tbody>
        <tr>
          <td style={{fontWeight: 'bold', textAlign: 'center'}}>Top</td>
          <td style={{fontWeight: 'bold'}}>名称</td>
          <td style={{fontWeight: 'bold'}}>总核券量</td>
          {dimension === DIMENSIONS.REGION && <td style={{fontWeight: 'bold'}}>总领券量</td>}
        </tr>
        {dataSource.map((item, index) =>
          <tr key={index}>
            <td style={{textAlign: 'center'}}>{index + 1}</td>
            <td>{item.name}</td>
            <td>{item.use}</td>
            {dimension === DIMENSIONS.REGION && <td>{item.get}</td>}
          </tr>
        )}
      </tbody>
    </table>
  );
}

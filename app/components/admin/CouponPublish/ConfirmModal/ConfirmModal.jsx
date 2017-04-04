import React, { PropTypes } from 'react';
import { Modal } from 'antd';
import { isArray } from 'lodash/fp';
import styles from './styles.css';

TableItem.propTypes = {
  description: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired
};

function TableItem({description, value}) {
  return (
    <tr className={styles.row}>
      <td>{description}</td>
      <td>
        {isArray(value) ? value.map((text, index) => <p key={index}>{text}</p>) : value}
      </td>
    </tr>
  );
}

ConfirmModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  dataSource: PropTypes.array.isRequired,
  onOk: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
}

export default function ConfirmModal({visible, dataSource, onOk, onCancel}) {
  return (
    <Modal title="确认创建" style={{ top: 100 }} maskClosable={true}
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}>
      <table className={styles.container}>
        <tbody>
          {dataSource.map((item, index) => <TableItem key={index} {...item}/>)}
        </tbody>
      </table>
    </Modal>
  );
}

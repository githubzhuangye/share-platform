import React, { PropTypes } from 'react';
import { Modal } from 'antd';
import classnames from 'classnames';
import * as styles from './styles.css';
import { StatusIcon } from 'components/admin'

TitleItem.propTypes = {
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
  isRead: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
};

function TitleItem({title, date, active, index, onClick, isRead}) {
  return (
    <li
      className={classnames(styles.title, {[styles.active]: active})}
      onClick={() => onClick(index)}>
      <div className={styles.icon}>{isRead ? '' : <StatusIcon color="red"/>}</div>
      <div className={styles.text}>
        <p className={styles.word}>{title}</p>
        <p className={styles.date}>[{date}]</p>
      </div>
    </li>
  );
}

MessageBox.propTypes = {
  visible: PropTypes.bool.isRequired,
  messageList: PropTypes.array.isRequired,
  activeTitleIndex: PropTypes.number.isRequired,
  content: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  onTitleClick: PropTypes.func.isRequired
};

export default function MessageBox(props) {
  const { visible, messageList, activeTitleIndex, content, onCancel, onTitleClick } = props;
  const titles = messageList
    .map((item, index) =>
      <TitleItem
        key={index}
        index={index}
        title={item.title}
        date={item.date}
        active={activeTitleIndex === index}
        isRead={item.isRead}
        onClick={onTitleClick}/>
    );
  return (
    <Modal
      visible={visible}
      title="消息"
      footer={null}
      width={650}
      onCancel={onCancel}>
      <div className={styles.container}>
        <ul className={styles.titles}>
          {titles}
        </ul>
        <div className={styles.content}>
          {content}
        </div>
      </div>
    </Modal>
  );
}

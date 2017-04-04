import React, { PropTypes } from 'react';
import classnames from 'classnames';
import * as styles from './styles.css';
import { UserInfo, Board } from 'components/admin/Sidebar';
import { BoardContainer, UserInfoContainer } from 'containers/admin/Sidebar';

export default function Sidebar({className}) {
  return (
    <div className={classnames(className, styles.container)}>
      <UserInfoContainer/>
      <BoardContainer duration={30}/>
    </div>
  );
}

import React, { PropTypes } from 'react';
import classnames from 'classnames';
import * as styles from './styles.css';

StatusIcon.propTypes = {
  color: PropTypes.string.isRequired,
};

StatusIcon.defaultProps = {
  color: 'green'
};

export default function StatusIcon({color}) {
  const iconName = `status${color[0].toUpperCase()}${color.slice(1)}`;
  return (
    <span className={classnames(styles.status, styles[iconName])}></span>
  );
}

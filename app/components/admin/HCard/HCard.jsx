import React, { PropTypes } from 'react';
import styles from './styles.css';

export default function HCard({title, children}) {
  return (
    <div>
      {title && <div className={styles.title}>{title}</div>}
      <div className={styles.content}>{children}</div>
    </div>
  );
}

HCard.propTypes = {
  title: PropTypes.element,
  children: PropTypes.element.isRequired,
};
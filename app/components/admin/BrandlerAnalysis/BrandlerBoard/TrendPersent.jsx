import React, { PropTypes } from 'react';
import { Arrow } from 'components/admin';

const styles = {
  container: {
    display: 'inline-block',
    width: '55px',
    textAlign: 'right',
  },
};

export default function TrendPersent({persent}) {
  if (persent === '') return null;
  return (
    <span style={styles.container}>{persent}<Arrow direction={persent[0] === '-' ? 'down' : 'up'}></Arrow></span>
  );
}

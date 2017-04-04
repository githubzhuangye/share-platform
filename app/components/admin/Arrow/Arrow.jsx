import React, { PropTypes } from 'react';

Arrow.propTypes = {
  direction: PropTypes.string.isRequired,
};

export default function Arrow({direction}) {
  if (direction === 'up') {
    return <span style={{color: 'red'}}>↑</span>
  } else {
    return <span style={{color: 'green'}}>↓</span>
  }
}

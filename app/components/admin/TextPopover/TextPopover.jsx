import React, { PropTypes } from 'react';
import classnames from 'classnames';
import { Popover } from 'antd';
import { fourWordsWidth, ellipsisText } from 'sharedStyles/global.css';

TextPopover.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired
};

export default function TextPopover({title, content}) {
  if (content.length <= 4) {
    return <span>{content}</span>
  } else if (content.length <= 8) {
    return <div className={fourWordsWidth}>{content}</div>
  } else {
    return (
      <Popover content={content} title={title}>
        <div>
          <div>{content.slice(0, 4)}</div>
          <div className={classnames(fourWordsWidth, ellipsisText)}>{content.slice(4)}</div>
        </div>
      </Popover>
    );
  }
}

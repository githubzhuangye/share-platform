import React, { PropTypes } from 'react';
import { Icon } from 'antd';

import styles from './styles.css';

VideoList.propTypes = {
  visible: PropTypes.bool.isRequired,
  onMouseOver: PropTypes.func.isRequired,
  onMouseOut: PropTypes.func.isRequired,
};

const VideoItem = ({href, name, index}) => (
  <li>
    <a className={styles.item} href={href} target="_blank">
      <span className={styles.numberCircle}>{index}</span>
      <span className={styles.itemText}>{name}</span>
    </a>
  </li>
);

const videos = [
  {
    href: 'http://v.youku.com/v_show/id_XMTc1NDY3MzUzMg==.html',
    name: '添加商品',
  },
  {
    href: 'http://v.youku.com/v_show/id_XMTc1NDY3Mjg3Ng==.html',
    name: '品牌商发券、查券',
  },
  {
    href: 'http://v.youku.com/v_show/id_XMTc1NDY3MjQ1Mg==.html',
    name: '零售商添加商品门店发券',
  },
  {
    href: 'http://v.youku.com/v_show/id_XMTc1NDY3NTU2OA==.html',
    name: '零售商券审核',
  }
];

export default function VideoList({visible, onMouseOver, onMouseOut}) {
  return visible
    ? ( <ul
          className={styles.list}
          onMouseOver={onMouseOver}
          onMouseOut={onMouseOut}>
          <li className={styles.title}>
            <Icon type="laptop" style={{width: '20px'}}/>
            <span className={styles.itemText}>共享平台操作视频教程</span>
          </li>
          {videos.map((item, index) =>
            <VideoItem key={index} index={index + 1} name={item.name} href={item.href}/>
          )}
        </ul> )
    : null;
}

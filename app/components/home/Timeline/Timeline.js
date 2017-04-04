import React from 'react';
import classnames from 'classnames';
import * as styles from './styles.css';

const data = [
  {date: '2016.7.6-2016.7-21', title: '会花联手美特好百券大战活动', desc: '每款商品,每人限领3张,每次使用1张'},
  {date: '2016.7.6-2016.7-21', title: '德芙一档团券活动', desc: '100人团,一张5元券;300人团,两张5元券'}
];

function TimelineItem({date, title, desc, index}) {
  const cls = index % 2 === 0 ? styles.right : styles.left;
  return (
    <div className={classnames(cls, styles.itemContainer)}>
      <p className={styles.date}>{date}</p>
      <p className={styles.content}>
        <span className={styles.title}>{title}</span>
        <span className={styles.desc}>({desc})</span>
      </p>
    </div>
  );
}

function Dot({index}) {
  const imgUrl = index % 2 === 0 ? require('images/dot_blue.png') : require('images/dot_red.png');
  return (
    <div className={styles.dot} style={{top: 50 * index + 'px'}}>
      <img src={imgUrl}/>
    </div>
  );
}

function DotLine({length}) {
  const dotChildren = [];
  for (let index = 0; index<length; index++) {
    dotChildren.push(React.createElement(Dot, {index, key: index}));
  }
  return (
    <div className={styles.dotline}>
      <div className={styles.greyLine} style={{height: 50 * (length - 1) + 'px'}}></div>
      <div>
        {dotChildren}
      </div>
    </div>
  );
}

export default function Timeline() {
  return (
    <div className={styles.container}>
      {data.map((item, index) => {
        return <TimelineItem key={index} {...item} index={index}/>;
      })}
      <DotLine length={data.length}/>
    </div>
  );
}
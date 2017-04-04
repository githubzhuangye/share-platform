import React, { PropTypes } from 'react';
import { Button, Card } from 'antd';

const styles = {
  container: {
    width: '215px',
  },
  moreBtn: {
    textAlign: 'center',
    marginTop: '16px',
  },
};

BoardCard.propTypes = {
  title: PropTypes.any.isRequired,
  content: PropTypes.any,
  activeTitle: PropTypes.any.isRequired,
  onMoreBtnClick: PropTypes.func,
};

export default function BoardCard({title, content, onMoreBtnClick, activeTitle}) {
  return (
    <div style={styles.container}>
      <Card title={title} bodyStyle={{margin: '-16px -12px', height: '170px'}}>
        {content}
      </Card>
      <div style={styles.moreBtn}>
        <Button type={title === activeTitle ? "primary" : "ghost"} onClick={() => onMoreBtnClick(title)}>查看图表</Button>
      </div>
    </div>
  );
}

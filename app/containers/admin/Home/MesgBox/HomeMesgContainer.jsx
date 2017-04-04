import React, { PropTypes, Component } from 'react';
import { Row, Col, Icon } from 'antd';
import * as styles from 'components/admin/Home/styles.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { HomeMesgBox } from 'components/admin';
import * as messageBoxActionCreators from 'redux/modules/homeMesgBox.js';

@connect(
  ({homeMesgBox}) => ({
    messageList: homeMesgBox.messageList,
    content: homeMesgBox.content
  }),
  dispatch => bindActionCreators(messageBoxActionCreators, dispatch)
)
export default class HomeMesgContainer extends Component {
  static propTypes = {
    messageList: PropTypes.array.isRequired,
    handleFetchHomeMesg: PropTypes.func.isRequired,
    content: PropTypes.string.isRequired
  }
  componentDidMount() {
    this.props.handleFetchHomeMesg();
  }
  render() {
    const { messageList, content } = this.props;
    let disPlay;
    if (messageList.length == 0) {
      disPlay = 'none';
    }else{
      disPlay = 'block';
    }
    return(
      <div style={{display:disPlay}}>
             <Row>
                   <Col span={6} className={styles.homeTitle}>
                          <Icon type="bars" />招商实况
                   </Col>
             </Row>
             <div className={styles.tipRouteArea}>
                    <HomeMesgBox
                          messageList={messageList}
                          content={content}
                   />
             </div>
      </div>
      
    );
  }
}

import React from 'react';
import { Row, Col, Modal, Button } from 'antd';
import * as styles from './styles/homeDialog.css';
import classnames from 'classnames';

export const HomeMessage = React.createClass({
      getInitialState() {
      return {
      loading: false,
      visible: false,
      colors : styles.iconCircleRed
    };
  },
  showModal() {
    this.setState({
      visible: true,
      colors : styles.iconCircleOpa
    });
  },
  handleOk() {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false, visible: false });
    }, 1000);
  },
  handleCancel() {
    this.setState({ visible: false });
  },
  componentDidMount: function() {
      
  },
  render() {
    return (

      <Col span={22} offset={1} className={styles.tipsInner}>
                   <p><span>{this.props.date}</span><span style={{marginLeft:'4px'}}>{this.props.month}</span></p><p><span onClick={this.showModal}><i className={classnames(styles.iconCircle,this.state.colors)}></i>{this.props.name}</span></p><p></p>
            
             <Modal ref="modal"
                  visible={this.state.visible}
                  title={this.props.name} onOk={this.handleOk} onCancel={this.handleCancel}
                  footer={[
                    
                  ]}
                  >
                   <div className={styles.dialogWrap}>
                          <p style={{fontSize: '16px',fontWeight:'bold',textAlign: 'center'}}>{this.props.texts}</p>
                   </div>

            </Modal>

      </Col>
    );
  },
});
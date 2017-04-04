import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { MessageBox } from 'components/admin';
import * as messageBoxActionCreators from 'redux/modules/messageBox';

@connect(
  ({messageBox}) => ({
    modalVisible: messageBox.modalVisible,
    messageList: messageBox.messageList,
    activeTitleIndex: messageBox.activeTitleIndex,
    content: messageBox.content
  }),
  dispatch => bindActionCreators(messageBoxActionCreators, dispatch)
)
export default class MessageBoxContainer extends Component {
  static propTypes = {
    modalVisible: PropTypes.bool.isRequired,
    messageList: PropTypes.array.isRequired,
    activeTitleIndex: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired,
    closeModal: PropTypes.func.isRequired,
    handleFetchMessage: PropTypes.func.isRequired,
    handleTitleClick: PropTypes.func.isRequired
  }
  componentDidMount() {
    this.props.handleFetchMessage();
  }
  handleTitleClick(index) {
    this.props.handleTitleClick(index);
  }
  render() {
    const { modalVisible, messageList, activeTitleIndex, content, closeModal } = this.props;
    return(
      <MessageBox
        messageList={messageList}
        visible={modalVisible}
        activeTitleIndex={activeTitleIndex}
        content={content}
        onCancel={closeModal}
        onTitleClick={::this.handleTitleClick}/>
    );
  }
}

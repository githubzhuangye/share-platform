import React, { Component, PropTypes } from 'react';
import { Upload, Icon, Modal, message } from 'antd';
import { host } from 'config/constants';
import { generateAuthFields } from 'helpers/util';

export default class CardUpload extends Component {
  static propTypes = {
    type: PropTypes.number.isRequired,
    value: PropTypes.string,
    multiple: PropTypes.bool,
    onChange: PropTypes.func,
  }
  state = {
    fileList: [],
    uploadBox: null
  }
  componentDidMount() {
    this.initUploadBox(this.props.value);
  }
  componentWillReceiveProps({value, multiple}) {
    if (!multiple) {
      this.initUploadBox(value);
    }
  }
  handleChange({file, fileList}) {
    const { onChange, multiple } = this.props;
    if (multiple) {
      if (fileList.length > 0 && file.response) {
        const response = file.response;
        if (response.code && parseInt(response.code) !== 200) {
          message.error(response.msg);
          fileList = fileList.slice(0, -1);
        }
      }
    } else {
      if (fileList.length === 0) { // 删除文件
        onChange && onChange('');
        setTimeout(() => {
          this.showUploadBox();
        }, 500);
      } else { // 添加文件
        const response = file.response;
        if (response) {
          if (parseInt(response.code) === 200) {
            onChange && onChange(response.data.url);
            return this.setState({fileList}, ::this.hideUploadBox);
          } else {
            message.error(response.msg);
            return this.setState({fileList: []});
          }
        }
      }
    }
    this.setState({fileList});
  }
  initUploadBox(value) {
    const { multiple } = this.props;
    if (multiple) {
      if (value) {
        const fileList = value.split(',')
          .map((value, index) => ({
            uid: index,
            name: value,
            status: 'done',
            url: value,
            thumbUrl: value,
            response: {
              data: {
                url: value,
              },
            },
          }));
        this.setState({fileList});
      } else {
        this.setState({fileList: []})
      }
    } else {
      const uploadBox = this._upload.getElementsByClassName('ant-upload ant-upload-select ant-upload-select-picture-card')[0];
      if (value) {
        uploadBox.style.display = 'none';
        if (!this.state.fileList.length) {
          this.setState({uploadBox, fileList: [{
            uid: -1,
            name: value,
            status: 'done',
            url: value,
            thumbUrl: value,
          }]});
        }
      } else {
        this.setState({uploadBox, fileList: []}, ::this.showUploadBox);
      }
    }
  }
  showUploadBox() {
    this.state.uploadBox.style.display = 'inline-block';
  }
  hideUploadBox() {
    this.state.uploadBox.style.display = 'none';
  }
  getUrls() {
    return this.state.fileList.map(file => file.response.data.url).join(',');
  }
  clear() {
    this.setState({...this.state, fileList: []}, () => {
      setTimeout(::this.showUploadBox, 500);
    });
  }
  render() {
    const { type, multiple } = this.props;
    let authFields = generateAuthFields();
    const props = {
      action: `${host}/cp/message/m_imgUpload.action`,
      listType: 'picture-card',
      name: 'img',
      data: { ...authFields, type },
      fileList: this.state.fileList,
      onChange: ::this.handleChange
    }
    return (
      <div className="clearfix" ref={upload => this._upload = upload} style={{width: multiple ? '100%' : '104px', position: 'relative'}}>
        <Upload {...props}>
          <Icon type="plus" />
          <div>上传照片</div>
          <div style={{width: '100%', height: '100%', position: 'absolute', top: '0', left: '0'}}></div>
        </Upload>
      </div>
    );
  }
}

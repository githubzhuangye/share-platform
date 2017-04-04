import React, { Component, PropTypes } from 'react';
import * as styles from './styles.css';

function removeProps(obj, propNames) {
  const retObj = {...obj};
  propNames.forEach(prop => delete retObj[prop]);
  return retObj;
}

function fixControlledValue(props) {
  if (props.value === undefined || props.value === null) {
    props.value = '';
  }
}

export default class Input extends Component {
  static propTypes = {
    type: PropTypes.string,
    placeholder: PropTypes.string,
    iconUrl: PropTypes.string
  }
  static defaultProps = {
    type: 'text'
  }
  render() {
    const { type, placeholder, iconUrl } = this.props;
    const newProps = { ...removeProps(this.props, ['iconUrl']) };
    fixControlledValue(newProps);
    return (
      <div className={styles.inputItem}>
        <div className={styles.inputIcon}>
          { iconUrl && <img src={iconUrl} /> }
        </div>
        <input className={styles.input} {...newProps}/>
      </div>
    );  
  }
}

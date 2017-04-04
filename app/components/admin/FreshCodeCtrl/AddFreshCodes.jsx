import React, {Component} from 'react'
import styles from './style.css'
import {Card, Col, Row,Button } from 'antd'


export default class AddFreshCodes extends Component {
         
    render() {
        return (
                  <Col span="11"className={styles.addCode} onClick={this.props.addCodes}> 
                            <div className={styles.freshImg}>
                                    <img src={require("images/addCode.jpg")} alt=""/>
                                    <div>新增规则</div>
                            </div>
                    </Col>
        )
    }
}

import React, {Component, PropTypes} from 'react';
import {  Row, Col } from 'antd';
import * as styles from './styles.css';
import {cardable} from 'hoc';

import { CategoryDataContainer } from 'containers/admin/RealtimeData';

@cardable(['类目数据分析'])

export default class CategoryData extends Component {
    render() {
        return (
            <CategoryDataContainer/>
        )
    }
}

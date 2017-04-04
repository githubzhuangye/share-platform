import React, {Component, PropTypes} from 'react';
import {  Row, Col } from 'antd';
import * as styles from './styles.css';
import {cardable} from 'hoc';

// import { ActivitySelection } from 'components/admin/RealtimeData';

import { ActivitySelectionContainer } from 'containers/admin/RealtimeData';

@cardable(['数据总览'])

export default class TotalData extends Component {
    render() {
        return (
            <ActivitySelectionContainer/>
        )
    }
}

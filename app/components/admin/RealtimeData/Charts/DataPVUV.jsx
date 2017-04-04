import React, {PropTypes, Component} from 'react';
import {Row, Col} from 'antd';
import echarts from 'echarts';
import * as styles from './styles.css';

// 基于准备好的dom，初始化echarts实例
export default class DataPVUV extends Component {
    static propTypes = {
        dataSource: PropTypes.shape({day: PropTypes.array, pv: PropTypes.array, uv: PropTypes.array}).isRequired
    }

    static defaultProps = {
        dataSource: {
            day: [1],
            pv:  [1],
            uv:  [1]
        }
    }
    chartInstance = null
    componentDidMount() {
        this.chartInstance = echarts.init(this._dom);
        this.updateChart(this.props);
    }
    componentWillReceiveProps(nextProps) {
      this.updateChart(nextProps);
    }

    getOption(props) {
        const {dataSource} = props;
        const {day, pv, uv} = dataSource;
        let option;
        option = {
            title: {
                text: ''
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['pv', 'uv']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: day
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: 'pv',
                    type: 'line',
                    stack: '总量',
                    data: pv
                }, {
                    name: 'uv',
                    type: 'line',
                    stack: '总量',
                    data: uv
                }
            ]

        };
        return option;
    }
    updateChart(props) {
        const option = this.getOption(props);
        // this.chartInstance.clear();
        this.chartInstance.setOption(option);
    }

    render() {
        return (
            <div ref={dom => this._dom = dom} className={styles.dataWrap}></div>
        );
    }

}

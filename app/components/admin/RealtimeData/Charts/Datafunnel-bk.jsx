import React, {PropTypes, Component} from 'react';
import {Row, Col} from 'antd';
import echarts from 'echarts';
import * as styles from './styles.css';


// 基于准备好的dom，初始化echarts实例
export default class Datafunnel extends Component {

    static defaultProps = {
        funnelData: {
            uuse: '0',
            uget:  '0',
            uv:  '0'
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
        const {funnelData} = props;
        console.info(funnelData.uv+'props');
        const {uuse,uget,uv} = funnelData;
        let option;
        option = {
            title: {
                text: '',
                subtext: ''
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c}%"
            },
            toolbox: {
                feature: {
                    dataView: {readOnly: false},
                    restore: {},
                    saveAsImage: {}
                }
            },
            legend: {
                data: ['UV','领券人数','核券人数']
            },
            calculable: true,
            series: [
                {
                    name:'UV领核券转化漏斗',
                    type:'funnel',
                    left: '10%',
                    top: 60,
                    //x2: 80,
                    bottom: 60,
                    width: '80%',
                    // height: {totalHeight} - y - y2,
                    min: 0,
                    max: 100,
                    minSize: '0%',
                    maxSize: '100%',
                    sort: 'descending',
                    gap: 2,
                    label: {
                        normal: {
                            show: true,
                            position: 'inside'
                        },
                        emphasis: {
                            textStyle: {
                                fontSize: 20
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            length: 10,
                            lineStyle: {
                                width: 1,
                                type: 'solid'
                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            borderColor: '#fff',
                            borderWidth: 1
                        }
                    },
                    data: [
                        {value: uv, name: 'UV'},
                        {value: uget, name: '领券人数'},
                        {value: uuse, name: '核券人数'},
                    ]
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
            <div ref={dom => this._dom = dom} className={styles.FunnelWrap}></div>
        );
    }
}

import React, { Component } from 'react';
import { Input, DatePicker, Button, Table, message } from 'antd';
import moment from "moment";
import { queryCharge } from 'api/billManage';
import styles from './style.css';
import { transformDate, generateAuthFields } from 'helpers/util';
import { host } from 'config/constants';
import { cardable } from 'hoc';

import { HLink } from 'components/admin';

const { RangePicker } = DatePicker;

@cardable(['账单管理'])
export default class Total extends Component {
	constructor(props) {
		super(props)
		this.state = {
			dataSource: [],
			count: 0,
			couponname: '',
			curpage: 1,
			beginDate: null,
			endDate: null,
			loading: false
		}
	}

	getColumns() {
		const that = this
		const columns = [
			{
				title: '券名称',
				dataIndex: 'COUPONNAME',
				key: 'COUPONNAME',
			}, {
				title: '领取总数',
				dataIndex: 'REC_COUNT',
				key: 'REC_COUNT',
			}, {
				title: '核销总数(张)',
				dataIndex: 'USED_COUNT',
				key: 'USED_COUNT'
			}, {
				title: '领取总服务费(元)',
				dataIndex: 'REC_FEE',
				key: 'REC_FEE',
				render: (text) => text / 100
			}, {
				title: '核销总服务费(元)',
				dataIndex: 'USED_FEE',
				key: 'USED_FEE',
				render: (text) => text / 100
			}, {
				title: '共计总服务费',
				dataIndex: 'TOTAL_FEE',
				key: 'TOTAL_FEE',
				render: (text) => text / 100
			}, {
				title: '操作',
				dataIndex: 'operation',
				key: 'operation',
				render(text, record, index) {
					return <HLink to={`/admin/manage/bill/detail/${record.COUPONID}`}>查看明细</HLink>
				}
			}
		]
		return columns
	}

	componentDidMount() {
		const {page} = this.state;
		this.queryCharge(page)
	}

	queryCharge(curpage) {
		const { beginDate, endDate, couponname} = this.state;
		this.setState({ loading: true })
		queryCharge({
			curpage: curpage,
			couponname: couponname,
			dt_start: beginDate ? moment(beginDate).format("YYYYMMDD") : "",
			dt_end: beginDate ? moment(endDate).format("YYYYMMDD") : ""
		}).then(result => {
			if (curpage == -1) {
				window.location.assign(`${host}/cp/coupon/account!queryCharge.action?account_id=${generateAuthFields().account_id}&sign=${generateAuthFields().sign}&curpage=${curpage}&couponname=${couponname}&dt_start=${beginDate ? moment(beginDate).format("YYYYMMDD") : ""}&dt_end=${endDate ? moment(endDate).format("YYYYMMDD") : ""}`);
				message.success("下载成功！")
			} else {
				if (result && result.code === '200' && result.data) {
					const {DETAILS, PAGE, TOTALCOUNT} = result.data
					this.setState({ dataSource: DETAILS, curpage: PAGE, count: TOTALCOUNT })
				}
			}
			this.setState({ loading: false })
		}).catch(e => this.setState({ loading: false }))
	}

	changePage(e) {
		this.setState({ curpage: e }, this.queryCharge(e))
	}

	onDateRangeChange(values, dateStrs) {
		this.setState({ beginDate: values[0], endDate: values[1] })
	}

	render() {
		const {beginDate, endDate, dataSource, couponname, loading, curpage, count} = this.state
		const pagination = {
			current: Number(curpage),
			total: Number(count),
			onChange: ::this.changePage
		}
		return (
			<div>
				<div className={styles.toolbar}>
					<label className={styles.label}>券名称: </label>
					<Input className={styles.toolbar_input} placeholder="请输入券名称" value={couponname}
						onChange={(e) => this.setState({ couponname: e.target.value })} />
					<label className={styles.label}>时间段：</label>
					<RangePicker style={{ width: 200, marginRight: 40 }} value={[beginDate, endDate]} format="YYYY-MM-DD"
						onChange={:: this.onDateRangeChange}/>
                    <Button type="primary" size="small" style={{ marginRight: 10 }} onClick={() => this.queryCharge(curpage)}>查询</Button>
					<Button type="primary" size="small" onClick={() => this.queryCharge(-1)}>导出</Button>
				</div>
				<Table dataSource={dataSource} columns={this.getColumns()} loading={loading} pagination={pagination} />
			</div>
		)
	}
}


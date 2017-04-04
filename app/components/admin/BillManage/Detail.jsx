import React, { Component, PropTypes } from 'react';
import { Input, DatePicker, Button, Table, Checkbox, Tooltip, Icon, Radio, message } from 'antd';
import moment from "moment";
import styles from './style.css';
import { queryChargeDetail } from 'api/billManage';
import { transformDate, generateAuthFields } from 'helpers/util';
import { host } from 'config/constants';
import { cardable } from 'hoc';

const { RangePicker } = DatePicker;
const RadioGroup = Radio.Group;

const columns = [
	{
		title: '用户',
		dataIndex: 'USER',
		key: 'USER',
	}, {
		title: '动作',
		dataIndex: 'TYPE',
		key: 'TYPE',
		render: (text) => text == 1 ? "领取" : "核销",
	}, {
		title: '时间',
		dataIndex: 'DATE',
		key: 'DATE',
		render: (text) => { let t = text.slice(0, 8) + " " + text.slice(8); return moment(t).format("YYYY-MM-DD HH:mm:ss") }
	}, {
		title: '商户',
		dataIndex: 'SAAS',
		key: 'SAAS'
	}, {
		title: '使用门店',
		dataIndex: 'MARKET',
		key: 'MARKET'
	}, {
		title: '券数',
		dataIndex: 'COUNT',
		key: 'COUNT'
	}, {
		title: '金额',
		dataIndex: 'PRICE',
		key: 'PRICE',
		render: (text) => text / 100 + "元"
	}, {
		title: '流水号',
		dataIndex: 'OUTID',
		key: 'OUTID'
	}, {
		title: '费用',
		dataIndex: 'FEE',
		key: 'FEE',
		render: (text) => text / 100 + "元"
	}];

@cardable([{name: '账单管理', url: '/admin/manage/bill'}, '明细'])
export default class Detail extends Component {
	static contextTypes = {
		history: PropTypes.object.isRequired,
	}
	constructor(props) {
		super(props)
		this.state = { dataSource: [], count: 0, curpage: 1, beginDate: null, endDate: null, loading: false, data: {}, showReceive: true, showVerify: true, radioValue: 0 }
	}

	onDateRangeChange(values, dateStrs) {
		this.setState({ beginDate: values[0], endDate: values[1] }, this.query)
	}

	componentWillMount() {
		this.query()
	}

	downloadDetail(curpage) {
		const detailId = this.props.params.id;
		const { beginDate, endDate, showReceive, showVerify, radioValue} = this.state;
		if (curpage == -1) {
			window.location.assign(`${host}/cp/coupon/account!queryChargeDetail.action?account_id=${generateAuthFields().account_id}&sign=${generateAuthFields().sign}&curpage=${curpage}&dt_start=${beginDate ? moment(beginDate).format('YYYYMMDD') : ""}&dt_end=${endDate ? moment(endDate).format('YYYYMMDD') : ""}&pubid=${detailId}&type=${radioValue}`);
			message.success("下载成功！");
		}
	}

	query() {
		const detailId = this.props.params.id;
		const {curpage, beginDate, endDate, showReceive, showVerify, radioValue} = this.state;
		this.setState({ loading: true })
		queryChargeDetail({ dt_start: beginDate ? moment(beginDate).format('YYYYMMDD') : "", dt_end: endDate ? moment(endDate).format('YYYYMMDD') : "", curpage, pubid: detailId, type: radioValue }).then(res => {
			if (res && res.code === '200' && res.data) {
				this.setState({ data: res.data, count: res.data.TOTALCOUNTPAGE, curpage: res.data.PAGE })
			}
			this.setState({ loading: false })
		}).catch(e => this.setState({ loading: false }))
	}

	renderType(type) {
		switch (type) {
			case '1': return '单品券'
			case '2': return '品牌满减券'
			case '3': return '全场代金券'
			case '4': return '生鲜单品券'
			default: return ''
		}
	}

	changePage(e) {
		this.setState({ curpage: e }, this.query)
	}

	render() {
		const {beginDate, endDate, data, showReceive, showVerify, loading, curpage, count} = this.state
		const pagination = {
			current: Number(curpage),
			total: count,
			onChange: ::this.changePage
		};
		const text = <span>为保证您的券正常发行，请尽快与米雅客服联系，<Icon type="phone" />  0571-86077510</span>;
		return (
			<div>
				<div className={styles.detail}>
					<div className={styles.detail_img}><img src={data.PIC_PATH} alt="" /></div>
					<div className={styles.detail_text}>
						<div className={styles.detail_row}>
							<DetailItem label="名称" value={data.COUPONNAME} loading={loading} />
							<DetailItem label="面额" value={data.FEE / 100 + "元"} loading={loading} />
							<DetailItem label="券类型" value={this.renderType(data.TYPE)} loading={loading} />
							<DetailItem label="发放总量" value={data.TOTALCOUNT} loading={loading} />
						</div>
						<div className={styles.detail_row}>
							<DetailItem label="有效期" value={data.STARTTIME && data.ENDTIME ? `${data.STARTTIME.split(" ")[0]}至${data.ENDTIME.split(" ")[0]}` : '未设置时间区间'} loading={loading} />
							<DetailItem label="状态" value={data.STATUS === '1' ? '正在进行中' : '已结束'} loading={loading} />
							<DetailItem label="领取总量" value={data.GETCOUNT} loading={loading} />
							<DetailItem label="核销总量" value={data.USECOUNT ? data.USECOUNT : 0} loading={loading} />
						</div>
					</div>
				</div>
				<div>
					<label className={styles.label}>查询日期：</label>
					<RangePicker style={{ width: 200, marginRight: 20 }} value={[beginDate, endDate]} format="YYYY-MM-DD" onChange={:: this.onDateRangeChange}/>
          <RadioGroup onChange={(e) => this.setState({ radioValue: e.target.value }, this.query)} value={this.state.radioValue}>
						<Radio key="0" value={0}>全部</Radio>
						<Radio key="1" value={1}>领取</Radio>
						<Radio key="2" value={2}>核销</Radio>
					</RadioGroup>
					<label className={styles.detail_item_label} style={{ marginLeft: 10 }}>总面额值: {!loading ? data.PRICESUM / 100 : "-"}元</label>
					<label className={styles.detail_item_label} style={{ marginLeft: 20 }}>总计服务费: {!loading ? data.FEESUM / 100 : "-"}元</label>
					<label className={styles.detail_item_label} style={{ marginLeft: 20 }}>未结算 <Tooltip placement="bottom" title={text}><span className={styles.question}>?</span></Tooltip></label>
					<Button type="primary" size="small" onClick={() => this.downloadDetail(-1)} style={{ marginLeft: 10 }} >导出</Button>
				</div>
				<Table style={{ marginTop: '20px' }} dataSource={data.DETAILS} columns={columns} loading={loading} pagination={pagination} />
			</div>
		)
	}
}

class DetailItem extends Component {
	render() {
		const {label, value, loading} = this.props;
		return (
			<div className={styles.detail_item}>
				<label className={styles.detail_item_label}>{label}</label>
				<span>: </span>
				<span className={styles.detail_item_value}>{!loading ? value : "-"}</span>
			</div>
		)
	}
} 
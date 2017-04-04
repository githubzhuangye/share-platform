import React, {PropTypes} from 'react';
import {Tabs, Menu, Dropdown} from 'antd';
import {Match} from 'react-router';
import {USER_TYPE} from 'config/constants';

import {
    TicketQueryContainer,
    TabContainer,
    ProductManageContainer,
    MarketManageContainer,
    CardContainer,
    HQCouponContainer
} from 'containers/admin';
import {
    Home,
    CouponPublish,
    ProductGrowth,
    MarketPermeability,
    CouponPermeability,
    CashierPermeability,
    UserManage,
    FreshCodeCtrl,
    CouponAuthSet,
    HCard,
    CouponUsage
} from 'components/admin';
import {
    ProductUsed,
    ProductSale,
    MarketUsed,
    MarketProductUsed,
    MarketProductSale,
    Channel
} from 'components/admin/ReportTables';
import {BrandlerBoard} from 'components/admin/BrandlerAnalysis';
import {BillTotal, BillDetail} from "components/admin/BillManage";
import {RealData, TotalData,UserData,ChannelDataAnalysis,TradesMan,CategoryData,RegionData} from "components/admin/RealtimeData";
import {UserManageContainer} from 'containers/admin/UserManage';
import {MarketUpsertFormContainer} from 'containers/admin/MarketManage';
import {HLink} from 'components/admin';

const {BRANDLER, RETAILER, MIYA} = USER_TYPE;
const TabPane = Tabs.TabPane;

const MatchWhenIsNotBrandler = ({
    component: Component,
    userType,
    ...rest
}) => (
    <Match {...rest} render={props => userType !== BRANDLER.value
        ? <Component {...props}/>
        : null}/>
);

const MatchWhenIsNotRetailer = ({
    component: Component,
    userType,
    ...rest
}) => (
    <Match {...rest} render={props => userType !== RETAILER.value
        ? <Component {...props}/>
        : null}/>
);

const MatchWhenIsMiya = ({
    component: Component,
    userType,
    ...rest
}) => (
    <Match {...rest} render={props => userType === MIYA.value
        ? <Component {...props}/>
        : null}/>
);

const HDropdown = ({tabName, dropdownMenus, tabKey, activeKey}) => {
    const menuContent = (
        <Menu style={{
            transform: 'translateX(-16px)'
        }}>
            {dropdownMenus.map(menu => (
                <Menu.Item key={menu.url}>
                    <HLink to={menu.url}>{menu.name}</HLink>
                </Menu.Item>
            ))}
        </Menu>
    );
    return tabKey === activeKey
        ? <span>{tabName}</span>
        : (
            <Dropdown overlay={menuContent}>
                <span style={{
                    fontSize: '14px'
                }}>{tabName}</span>
            </Dropdown>
        );
};

export default function Main({userType, tabKey, nav, className, onTabChange}) {
    const [coupon,
        manage,
        analysis,
        live] = nav;
    return (
        <div className={className}>
            <Tabs type="card" onChange={onTabChange} activeKey={tabKey}>
                <TabPane tab="首页" key="home">
                    <Match exactly pattern="/admin" component={Home}/>
                </TabPane>
                <TabPane tab={< HDropdown tabName = "会发券" dropdownMenus = {
                    coupon
                }
                activeKey = {
                    tabKey
                }
                tabKey = "coupon" />} key="coupon">
                    <Match exactly pattern="/admin/coupon/publish" component={CouponPublish}/>
                    <Match pattern="/admin/coupon/publish/:id" component={CouponPublish}/>
                    <Match pattern="/admin/coupon/query" component={TicketQueryContainer}/>
                    <Match pattern="/admin/coupon/usage/:id" component={CouponUsage}/>
                    <MatchWhenIsNotBrandler pattern="/admin/coupon/hq" component={HQCouponContainer} userType={userType}/>
                </TabPane>
                <TabPane tab={< HDropdown tabName = "会管理" dropdownMenus = {
                    manage
                }
                activeKey = {
                    tabKey
                }
                tabKey = "manage" />} key="manage">
                    <Match pattern="/admin/manage/product" component={ProductManageContainer}/>
                    <MatchWhenIsNotBrandler exactly pattern="/admin/manage/market" component={MarketManageContainer} userType={userType}/>
                    <MatchWhenIsNotBrandler pattern="/admin/manage/market/new" component={MarketUpsertFormContainer}/>
                    <MatchWhenIsNotBrandler pattern="/admin/manage/market/edit/:id" component={MarketUpsertFormContainer}/>
                    <Match pattern="/admin/manage/customer" component={UserManageContainer}/>
                    <Match exactly pattern="/admin/manage/bill" component={BillTotal}/>
                    <Match pattern="/admin/manage/bill/detail/:id" component={BillDetail}/>
                    <MatchWhenIsNotBrandler pattern="/admin/manage/fresh" component={FreshCodeCtrl} userType={userType}/>
                    <MatchWhenIsMiya pattern="/admin/manage/business" component={CouponAuthSet} userType={userType}/>
                </TabPane>
                <TabPane tab={< HDropdown tabName = "会分析" dropdownMenus = {
                    analysis
                }
                activeKey = {
                    tabKey
                }
                tabKey = "analysis" />} key="analysis">
                    <MatchWhenIsNotRetailer pattern="/admin/analysis/dashboard" component={BrandlerBoard} userType={userType}/>
                    <MatchWhenIsNotBrandler pattern="/admin/analysis/productUsed" component={ProductUsed} userType={userType}/>
                    <MatchWhenIsNotBrandler pattern="/admin/analysis/productSale" component={ProductSale} userType={userType}/>
                    <MatchWhenIsNotBrandler pattern="/admin/analysis/marketUsed" component={MarketUsed} userType={userType}/>
                    <MatchWhenIsNotBrandler pattern="/admin/analysis/marketProductUsed" component={MarketProductUsed} userType={userType}/>
                    <MatchWhenIsNotBrandler pattern="/admin/analysis/marketProductSale" component={MarketProductSale} userType={userType}/>
                    <MatchWhenIsNotBrandler pattern="/admin/analysis/channel" component={Channel} userType={userType}/>
                </TabPane>
                <TabPane tab={< HDropdown tabName = "数据中心" dropdownMenus = {
                    live
                }
                activeKey = {
                    tabKey
                }
                tabKey = "live" />} key="live">
                    <Match pattern="/admin/live/RealData" component={RealData} userType={userType}/>
                    <Match pattern="/admin/live/TotalData" component={TotalData} userType={userType}/>
                    <Match pattern="/admin/live/UserData" component={UserData} userType={userType}/>
                    <Match pattern="/admin/live/ChannelDataAnalysis" component={ChannelDataAnalysis} userType={userType}/>
                    <Match pattern="/admin/live/TradesMan" component={TradesMan} userType={userType}/>
                    <Match pattern="/admin/live/CategoryData" component={CategoryData} userType={userType}/>
                    <Match pattern="/admin/live/RegionData" component={RegionData} userType={userType}/>

                </TabPane>
            </Tabs>
        </div>
    );
}

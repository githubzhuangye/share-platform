const prodHost = 'http://miyapay.com';
const betaHost = 'http://121.43.110.242';
// const test1Host = 'http://114.55.54.147';
const test1Host = 'http://qtest.miyapay.com';
const test2Host = 'http://118.178.109.180';

let devHost;
if (process.env.NODE_ENV === 'debug') {
    devHost = 'http://localhost:3000';
} else {
      // devHost = 'http://114.55.54.147';
    devHost = 'http://qtest.miyapay.com';
}

export let host = devHost;
switch (window.env) {
    case 'prod':
        host = prodHost;
        break;
    case 'beta':
        host = betaHost;
        break;
    case 'test1':
        host = test1Host;
        break;
    case 'test2':
        host = test2Host;
        break;
}

export const SIGN_KEY = 'b881d1c582b5bc357f8b87fcb13dfe72';

export const USER_TYPE = {
    BRANDLER: {
        text: '品牌商',
        value: 1
    },
    RETAILER: {
        text: '零售商',
        value: 2
    },
    MIYA: {
        text: '米雅运营人员',
        value: 4
    }
};

export const PRODUCT_STATUS = {
    STOP: {
        text: '停用',
        value: 0
    },
    START: {
        text: '启用',
        value: 1
    },
    ALL: {
        text: '全部',
        value: 2
    }
}

export const MARKET_STATUS = PRODUCT_STATUS;

export const COUPON_TYPE = {
    SINGLE: {
        text: '单品券',
        value: 1
    },
    BRAND: {
        text: '品牌满减券',
        value: 2
    },
    VOUCHER: {
        text: '全场券',
        value: 3
    },
    FRESH: {
        text: '生鲜券',
        value: 4
    },
    REBATECOUPON: {
        text: '返券',
        value: 5
    },
    SINGLERATE: {
        text: '单品折扣券',
        value: 6
    },
    VOUCHERRATE: {
        text: '全场折扣券',
        value: 7
    }
}

export const WX_TYPE = {
    SINGLES: {
        text: '单品券',
        value: 1
    },
}

export const COUPON_STATUS = {
    VERIFING: {
        text: '待审核',
        value: 0
    },
    VERIFIED: {
        text: '审核通过',
        value: 1
    },
    VERIFIED_FAIL: {
        text: '审核未通过',
        value: 2
    },
    NOT_START: {
        text: '未开始',
        value: 3
    },
    ONGOING: {
        text: '进行中',
        value: 4
    },
    OVER: {
        text: '已结束',
        value: 5
    },
    OFF: {
        text: '已下架',
        value: 6
    },
    ALL: {
        text: '全部',
        value: 7
    }
};

export const COUPON_USAGE_STATUS = {
    PUBLISH_SUCEESS: {
        text: '发行成功',
        value: 2
    },
    RECEIVED: {
        text: '已领取',
        value: 3
    },
    USED: {
        text: '已核销',
        value: 4
    },
    RETURNED: {
        text: '已退货',
        value: 5
    },
    EXPIRED: {
        text: '已过期',
        value: 7
    }
};

export const COUPON_USAGE_TIME = {
    ALL: {
        text: '全部',
        value: 0
    },
    TODAY: {
        text: '今天',
        value: 1
    },
    WEEK: {
        text: '最近一周',
        value: 2
    },
    MONTH: {
        text: '最近15天',
        value: 3
    }
};

/*zhangdingyong 城市查询 类型定义*/
export const COUPON_CITY_QUERY = {
    PROVINCE: {
        text: "查询省列表",
        value: 1
    },
    CITY: {
        text: "查询市列表",
        value: 2
    }
}

export const FORM_MODE = {
    NEW: {
        text: '新增',
        value: 0
    },
    EDIT: {
        text: '修改',
        value: 1
    }
};

// 报表布局相关参数
export const FORM_ITEM_LAYOUT = {
    labelCol: {
        span: 6
    },
    wrapperCol: {
        span: 16
    },
    style: {
        marginTop: '2px',
        marginBottom: '2px'
    }
};

export const MARGIN_STYLE = {
    marginTop: '2px',
    marginBottom: '2px'
};

export const NAV = [
    [
        {
            name: '券发行',
            url: '/admin/coupon/publish'
        }, {
            name: '券查询',
            url: '/admin/coupon/query'
        }, {
            name: '会抢券',
            url: '/admin/coupon/hq'
        }
    ],
    [
        {
            name: '商品管理',
            url: '/admin/manage/product'
        }, {
            name: '门店管理',
            url: '/admin/manage/market'
        }, {
            name: '消费者券管理',
            url: '/admin/manage/customer'
        }, {
            name: '账单管理',
            url: '/admin/manage/bill'
        }, {
            name: '生鲜券管理',
            url: '/admin/manage/fresh'
        }, {
            name: '券业务配置',
            url: '/admin/manage/business'
        }
    ],
    [
        // 品牌商
        {
            name: '看板',
            url: '/admin/analysis/dashboard'
        },
        // 零售商
        {
            name: '单品核销量查询',
            url: '/admin/analysis/productUsed'
        }, {
            name: '单品销售量查询',
            url: '/admin/analysis/productSale'
        }, {
            name: '门店核销量查询',
            url: '/admin/analysis/marketUsed'
        }, {
            name: '门店单品核销量查询',
            url: '/admin/analysis/marketProductUsed'
        }, {
            name: '门店单品销售量查询',
            url: '/admin/analysis/marketProductSale'
        }, {
            name: '领取核销渠道查询',
            url: '/admin/analysis/channel'
        },
    ],
    [
        {
            name: '实时直播',
            url: '/admin/live/realData'
        },
        {
            name: '数据总览',
            url: '/admin/live/totalData'
        },
        {
            name: '用户数据分析',
            url: '/admin/live/userData'
        },
        {
            name: '渠道数据分析',
            url: '/admin/live/ChannelDataAnalysis'
        },
        {
            name: '零售商&门店数据分析',
            url: '/admin/live/TradesMan'
        },
        {
            name: '区域数据分析',
            url: '/admin/live/RegionData'
        },
        {
            name: '类目数据分析',
            url: '/admin/live/CategoryData'
        }
    ]
];

// 高德地图key
export const AMAP_KEY = 'a04b0079cc54c36d41d861a0cfe2d239';

export const IMAGE_TYPE = {
    USER_INFO: {
        text: '商户资质图片',
        value: 1
    },
    LOGO: {
        text: '商户、品牌logo',
        value: 2
    },
    PRODUCT: {
        text: '商品图片',
        value: 3
    }
};

// 设置可选时间范围
export const DATE_INTERVAL = {
    BEFORE: 0,
    AFTER: 1
};

// 品牌上分析的维度
export const DIMENSIONS = {
    SAAS: '1',
    REGION: '2',
    MARKET: '3',
    TREND: '4',
    GOOD: '5',
    REAL_TIME: '6'
};

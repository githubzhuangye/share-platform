import { message } from 'antd';
import { COUPON_TYPE } from 'config/constants';
import { GOOD_NOT_FOUND_VALUE } from 'components/admin/CouponPublish/SearchableInput/SearchableInput';
import moment from 'moment';
const { BRAND, VOUCHER ,FRESH,REBATECOUPON ,SINGLERATE,VOUCHERRATE } = COUPON_TYPE;
const BUDGET = 'budget';
const WXCOUPON = 'WXCOUPON';

const COUPON_FEE = 'couponfee';
const RATE = 'rate';
const GOOD_ID = 'goodid';

export function budgetFieldDecorator(form) {
  return form.getFieldDecorator(BUDGET, {
    rules: [
      {type: 'number', required: true, min: 0, message: '请正确填写预算'},
    ],
    getValueFromEvent: parseIntInputValue,
    onChange: e => {
      const value = e.target.value;
      handleCouponCountChange(form, value, BUDGET);
    },
  });
}

export function couponFeeFieldDecorator(form, couponType) {
  return form.getFieldDecorator(COUPON_FEE, {
    rules: [
      {type: 'number', required: true, min: 0, message: '请正确填写券面额,不能为空和负值'}
    ],
    getValueFromEvent: parseIntInputValue,
    onChange: e => {
      const value = e.target.value;
      handleCouponCountChange(form, value, COUPON_FEE);
      if (couponType === BRAND.value) {
        handleBrandCouponNameChange(form, value);
      } else if (couponType === VOUCHER.value||couponType === REBATECOUPON.value) {
        handleVoucherOrRebateOrRateCouponNameChange(form, value,couponType);
      } else {
        handleCouponNameChange(form, value, COUPON_FEE);
      }
    }
  });
}

export function couponFreshRateFieldDecorator(form) {
  function FreshRateCheck(rule, value, callback){
    if (!value) {
      callback([new Error('请正确填写最低金额优惠,不能为空和负值')]);
    } else {
        if (value<0 || value >10) {
          callback([new Error('最低金额优惠不能为负数且不能大于10！')]);
        } else if(value.indexOf(".")>0){
             value.split(".")[1].length>1?callback([new Error('最低金额优惠小数点最多为一位！')]):void(0);
        } else{
          callback();
        }
    }
  }
  return form.getFieldDecorator("FreshRate", {
    rules: [
      { validator: FreshRateCheck },
    ],
    trigger: ['onChange'],
  });
}

export function couponFreshRegionFieldDecorator(form, value, index) {

  function FreshRegion(rule, value, callback){
    if (!value) {
      callback([new Error('请正确填写最低金额优惠,不能为空和负值')]);
    }
  }

  return form.getFieldDecorator(`value${index}`, {
    rules: [
      {type: 'object', message: '请正确填写完整区间优惠', required: true}
    ],
    trigger: ['onBlur', 'onChange'],
  });
}


//对折扣金额进行验证
export function rateCountFieldDecorator(form,couponType) {

  function rateCount(rule, value, callback){
    if (!value&&value!=0) {
      callback('请输入折扣金额');
    }else if(value<1){
      callback('折扣金额必须1折起！');
    }else if(value>=10){
      callback('折扣金额需小于10折！');
    }else if(value.toString().indexOf(".")>0){
      if(value.toString().split(".")[1].length>1){
        callback('折扣金额最多一位小数！');
      }else{
        callback();
      }
    }else{
        callback();
    }
  }

  return form.getFieldDecorator(`RateCount`, {
    rules: [
       { validator: rateCount },
    ],
    getValueFromEvent: parseIntInputValue,
    onChange: e => {
      const value = e.target.value;
      if (couponType === VOUCHERRATE.value) {
        handleVoucherOrRebateOrRateCouponNameChange(form, value,couponType);
      }else if(couponType === SINGLERATE.value){
        handleCouponNameChange(form, value,`RateCount`)
      }
    }
  });
}

export function couponFreshFeeFieldDecorator(form) {
  function FreshFeeCheck(rule, value, callback){
    if (!value) {
      callback([new Error('请正确填写最低金额优惠,不能为空和负值')]);
    } else {
        if (value<0) {
          callback([new Error('最低金额优惠不能为负数！')]);
        }else  if(value.indexOf(".")>0){
             value.split(".")[1].length>2?callback([new Error('最低金额优惠小数点最多为两位！')]):void(0);
        } else{
          callback();
        }
    }
  }
  return form.getFieldDecorator("FreshFee", {
    rules: [
      { validator: FreshFeeCheck },
    ],
    trigger: ['onChange'],
  });
}

export function rateFieldDecorator(form) {
  return form.getFieldDecorator(RATE, {
    initialValue: '90',
    rules: [{required: 'true', message: '请选择核销率'}],
    onChange: value => handleCouponCountChange(form, value, RATE)
  });
}

export function couponCountFieldDecorator(form) {
  return form.getFieldDecorator('couponcount');
}

export function limitFieldDecorator(form) {
  const warnMessage = '请选择领券限制';
  return form.getFieldDecorator('limit', {
    initialValue: '1',
    rules: [
      {required: true, message: warnMessage}
    ]
  });
}

export function wxTypeFieldDecorator(form,name,val,warnMessage) {
  return form.getFieldDecorator(name, {
    initialValue: val,
    rules: [
      {required: true, message: warnMessage}
    ]
  });
}

export function couponCountFreshFieldProps(form) {
  return form.getFieldDecorator('couponFreshcount',{
    rules: [{required: true,min:0,type:"number", message: '总预算不能为空'}],
    getValueFromEvent: parseIntInputValue
  });
}

export function goodIdFieldDecorator(form, isFresh) {
  function checkIfExistValue(rule, value, callback) {
    if (!value) {
      callback();
    } else if (!value.text) {
      callback('请选择商品名称');
    }else if (value.value === GOOD_NOT_FOUND_VALUE) {
      callback('商品不能手工输入必须是已经添加的商品');
    } else {
      callback();
    }
  }
  return form.getFieldDecorator(GOOD_ID, {
    rules: [
      {type: 'object', required: true, message: '请选择商品名称'},
      {validator: checkIfExistValue},
    ],
    onChange: value => {
      form.setFieldsValue({couponpic: value.pic}); // 设置商品图片
      handleCouponNameChange(form, value, GOOD_ID, isFresh);
    }
  });
}

export function dateFieldDecorator(form) {

  return form.getFieldDecorator('date', {
    rules: [{type: 'array', required: true, message: '请选择券活动有效期限'}]
  });
}

export function rebateDateFieldDecorator(form) {
  const { getFieldsValue } = form;
  const {date} = getFieldsValue();
  const rebateDateFormatStr = 'YYYY-MM-DD';
  function checkRebateDateValue(rule, value, callback) {
    if(!value){
      callback("请选择返券时间段");
    }else{
      if (moment(value[0]).format(rebateDateFormatStr)<moment(date[0]).format(rebateDateFormatStr)) {
          callback("返券开始时间不能早于活动开始时间");
        }else if (moment(value[1]).format(rebateDateFormatStr)>moment(date[1]).format(rebateDateFormatStr)){
          callback("返券结束时间不能晚于活动结束时间")
        }else{
          callback();
        }
    }
  }
  return form.getFieldDecorator('rebateDate', {
    rules: [
      {validator:checkRebateDateValue}
      ]
  });
}


export function preDaysFieldDecorator(form) {
  return form.getFieldDecorator('predays', {
    initialValue: 0,
    rules: [
      {type: 'number', required: true, min: 0, message: '券提前日期不能为负数或空值'},
    ],
    getValueFromEvent: parseIntInputValue
  });
}

//返券需要满足的订单金额条件
export function rebateminfeeDecorator(form) {
   function checkRebateminfeeValue(rule, value, callback) {
    if (!value) {
      callback("订单金额不能为空值");
    }else if(value<0){
      callback("订单金额不能为负数");
    }else if(value.indexOf(".")>0){
      if(value.split(".")[1].length>2){
         callback("订单金额最多为两位小数");
      }else{
        callback();
      }
    }else{
      callback();
    }
  }
  return form.getFieldDecorator('rebateminfee', {
    initialValue: "",
    rules: [
        {validator:checkRebateminfeeValue}
    ],
  });
}

//满足minfee时返回券的数量。
export function rebatecountDecorator(form) {
  const { getFieldsValue } = form;
  const {rebatemaxcount} = getFieldsValue();
  function checkRebatemaxcountValue(rule, value, callback) {
    if (parseInt(value)>parseInt(rebatemaxcount)) {
      callback("可返券数量不能大于最大返券数量！");
    }else{
      callback();
    }
  }
  return form.getFieldDecorator('rebatecount', {
    initialValue: 0,
    rules: [
      {type: 'number', required: true, min: 0, message: '返券数量不能为负数或空值'},
    ],
    getValueFromEvent: parseIntInputValue
  });
}

//满足minfee时返回券的数量。
export function rebatemaxcountDecorator(form) {
  const { getFieldsValue } = form;
  const {rebatecount} = getFieldsValue();
  function checkRebatecountValue(rule, value, callback) {
    if (parseInt(value)<parseInt(rebatecount)) {
      callback("最大返券数量不能小于可返券数量！");
    }else{
      callback();
    }
  }
  return form.getFieldDecorator('rebatemaxcount', {
    initialValue: 0,
    rules: [
      {type: 'number', required: true, min: 0, message: '最多返券数量不能为负数或空值'},
      {validator:checkRebatecountValue}
    ],
    getValueFromEvent: parseIntInputValue
  });
}

export function relativeTimeFieldDecorator(form, values) {
  const { getFieldsValue } = form;
  const { predays } = getFieldsValue();

  function checkRelativeTimeValue(rule, value, callback) {
    // 如果values不是RELATIVE，不校验，直接返回
    if (values !== 'RELATIVE') {
      return callback();
    }
    if (!value || value < 0) {
      callback('券提前有效日期不能为负数或空值');
    } else if (parseInt(value) < parseInt(predays)) {
      callback("券领取有效必须大于券提前领取天数");
    } else{
      callback();
    }
  }

  return form.getFieldDecorator('relative_time', {
    initialValue: 0,
    rules: [
      {validator: checkRelativeTimeValue},
    ],
    getValueFromEvent: parseIntInputValue
  });
}

export function minfeeFieldDecorator(form) {
  const { getFieldsValue } = form;
  const {couponfee} = getFieldsValue();
  function checkMinfeeValue(rule, value, callback) {
    if (!value) {
      callback("限制条件不能为空值");
    }else if(value<0){
      callback("限制条件不能为负数");
    }else if(value==0){
      callback("限制条件最低为0.01元");
    }else if(value.indexOf(".")>0){
      if(value.split(".")[1].length>2){
         callback("限制条件最多为两位小数");
      }else{
        callback();
      }
    }else if(value<couponfee){
      callback("满减条件需要大于券面额");
    }else{
      callback();
    }
  }
  return form.getFieldDecorator('minfee', {
    initialValue: "",
    rules: [{validator: checkMinfeeValue},],
  });
}

//全场折扣券最大优惠金额校验
export function maxfeeFieldDecorator(form) {
  function checkMaxfeeValue(rule, value, callback) {
    if (!value) {
      callback("限制条件不能为空值");
    }else if(value<0){
      callback("限制条件不能为负数");
    }else if(value==0){
      callback("限制条件最低为0.01元");
    }else if(value.indexOf(".")>0){
      if(value.split(".")[1].length>2){
         callback("限制条件最多为两位小数");
      }else{
        callback();
      }
    }else{
      callback();
    }
  }
  return form.getFieldDecorator('maxfee', {
    initialValue: "",
    rules: [{validator: checkMaxfeeValue},],
  });
}

function parseIntInputValue(e) {
  return e.target.value ?(e.target.value>=0? +e.target.value : 0) : '';
}

function parseFloatInputValue(e) {
  return e.target.value && e.target.value>0 ? (e.target.value).toFixed(2) : ''
}


function handleCouponNameChange(form, value, type, isFresh) {
  const { getFieldsValue, setFieldsValue } = form;
  let { couponfee, goodid,RateCount } = getFieldsValue();
  switch (type) {
    case GOOD_ID: goodid = value; break;
    case COUPON_FEE: couponfee = value; break;
    case "RateCount": RateCount = value; break;
  }
  if (couponfee && goodid) {
    let couponname;
    if (goodid.value !== GOOD_NOT_FOUND_VALUE && goodid.text) {
      couponname = `${couponfee}元${goodid.text.split(':')[1]}券`;
    }
    setFieldsValue({couponname});
  }
  if(RateCount&& goodid){
    let couponname;
    if (goodid.value !== GOOD_NOT_FOUND_VALUE && goodid.text) {
      couponname = `${RateCount}折${goodid.text.split(':')[1]}券`;
    }
    setFieldsValue({couponname});
  }
  if (isFresh && goodid) {
    let couponname;
    if (goodid.value !== GOOD_NOT_FOUND_VALUE && goodid.text) {
      couponname = `${goodid.text.split(':')[1]}券`;
    }
    setFieldsValue({couponname});
  }

}

function handleCouponCountChange(form, value, type) {
  const { getFieldsValue, setFieldsValue } = form;
  let { budget, couponfee, rate } = getFieldsValue();
  switch (type) {
    case BUDGET: budget = value; break;
    case COUPON_FEE: couponfee = value; break;
    case RATE: rate = value; break;
  }
  if (budget && couponfee && rate) {
    const couponcount = parseInt(budget / (couponfee * rate / 100));
    setFieldsValue({couponcount});
  }
}

function handleBrandCouponNameChange(form, value) {
  const couponname = `${value}元品牌满减券`;
  if (value) {
    form.setFieldsValue({couponname});
  }
}

function handleVoucherOrRebateOrRateCouponNameChange(form, value,couponType) {
   var couponname=''
  if(couponType === VOUCHER.value){
      couponname = `${value}元全场代金券`;
  }else if(couponType === REBATECOUPON.value){
      couponname = `${value}元返券`;
  }else if(couponType === VOUCHERRATE.value){
      couponname = `${value}折全场折扣券`;
  }
  if (value) {
    form.setFieldsValue({couponname});
  }
}

function parseIntWxValue(e) {
  return e.target.value ?(e.target.value>=0? +e.target.value : 0) : '';
}

export function WxCouponFieldDecorator(form,couponcount,handleNeedPayClick,pubid) {
  return form.getFieldDecorator(WXCOUPON, {
    rules: [
      {type: 'number', required: true, min: 0,max: parseInt(couponcount) - 1, message: '请正确填写库存数量'},
    ],
    getValueFromEvent: parseIntWxValue,
    onChange: e => {
      let value = e.target.value;
      if (parseInt(value) >= parseInt(couponcount)) {
        message.error('输入库存不能大于发行库存');
        e.target.value = parseInt(couponcount)-1;
      } else {
        handleNeedPayClick(pubid,e.target.value);
      }
    },
  });
}

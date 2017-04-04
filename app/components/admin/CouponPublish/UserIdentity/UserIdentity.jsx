import React, { PropTypes } from 'react';
import { Form, Radio, Popover, Icon } from 'antd';
import styles from '../styles.css';
import { USER_TYPE, COUPON_TYPE } from 'config/constants';
import { extractStatus } from 'helpers/util';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const { SINGLE, BRAND } = COUPON_TYPE;

const content = (
  <div style={{width: '200px'}}>
    <p>1.券点用来给"朋友的券"添加库存。每次添加,会根据券的库存单价及添加数量计算出所需要的券点。</p>
    <p style={{marginTop: '5px'}}>2.该账户券点是免费券点和付费券点的总和,价值作用同等,发布活动时券点不够,请自行<a href="" target="_blank" style={{color:'#EA4E4E'}}>前去充值</a>。</p>
  </div>
);



UserIdentity.propTypes = {
  isEdit: PropTypes.bool.isRequired,
  userType: PropTypes.number.isRequired,
  couponType: PropTypes.number.isRequired,
  isSelectMode: PropTypes.number.isRequired,
  isMyVip: PropTypes.bool.isRequired,
  partnerId: PropTypes.string.isRequired,
  hQBusiness: PropTypes.array.isRequired,
  onModeChange: PropTypes.func,
};

UserIdentity.defaultProps = {
  isEdit: false,
  isSelectMode: 0,
};

export default function UserIdentity(props) {
  const { userType, couponType, isSelectMode, onModeChange, isEdit, hQBusiness, onWxModeChange, isWxMode, balance } = props;
  return (
    <div style={{position: 'relative'}}>
        {isSelectMode === 3 ?
            <FormItem className={styles.wxSelect} style={{marginLeft: '47px'}}>
                <RadioGroup value={isWxMode} size="small" onChange={onWxModeChange}>
                  <RadioButton value={0}>普通券</RadioButton>
                  <RadioButton value={1}>微信券</RadioButton>
                </RadioGroup>
            </FormItem> : null
        }


        <FormItem label="当前身份" labelCol={{span: 5}} wrapperCol={{span: 19}} style={{marginTop: '50px'}}>
          <div className={styles.userInfo}>
            <span className={styles.userType}>
              {extractStatus(USER_TYPE)(userType)}
              {isSelectMode === 1 && <span style={{color: '#f55f4e'}}>（会抢模式）</span>}
            </span>

            {isWxMode===1 && isSelectMode === 3 ?
              <Popover content={content} title="券点:" placement="right">
                  <span className={styles.adminMoney}>账户点券: <em>{balance}</em>券点 <Icon type="question-circle" /></span>
              </Popover> : null
            }

            {userType === USER_TYPE.RETAILER.value &&
              <div className={styles.couponPublishMode}>
                  <RadioGroup value={isSelectMode} size="large" onChange={onModeChange}
                    disabled={hQBusiness.length === 0}>
                    <RadioButton value={0}>通用模式</RadioButton>
                    <RadioButton value={2}>口碑营销</RadioButton>
                    <RadioButton value={3}>微信模式</RadioButton>
                  </RadioGroup>
                  {isSelectMode === 1 && <p>可在"会抢"APP中指定门店或零售商发布券</p>}
                  {isSelectMode === 2 && <p>可在支付宝口碑-米雅会员营销服务中查看</p>}
              </div>
            }

            {userType === USER_TYPE.BRANDLER.value &&
              <div className={styles.couponPublishMode}>
                  <RadioGroup value={isSelectMode} size="large" onChange={onModeChange}
                    disabled={hQBusiness.length === 0}>
                    <RadioButton value={0}>通用模式</RadioButton>
                    <RadioButton value={1}>会抢模式</RadioButton>
                  </RadioGroup>
              </div>
            }

            {userType === USER_TYPE.MIYA.value &&
              <div className={styles.couponPublishMode}>
                  <RadioGroup value={isSelectMode} size="large" onChange={onModeChange}
                    disabled={hQBusiness.length === 0}>
                    <RadioButton value={0}>通用模式</RadioButton>
                    <RadioButton value={1}>会抢模式</RadioButton>
                    <RadioButton value={2}>口碑营销</RadioButton>
                    <RadioButton value={3}>微信模式</RadioButton>
                  </RadioGroup>
              </div>
            }
          </div>
        </FormItem>
    </div>
  );
}

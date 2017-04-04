import React, { PropTypes, Component } from 'react';
import { Form, Cascader, Input, message, Modal, Row, Col } from 'antd';
import axios from 'axios';
import { FORM_ITEM_LAYOUT, AMAP_KEY, FORM_MODE } from 'config/constants';
import { addRequiredDecorator, transformProviceAndCity } from 'helpers/util';
import EventEmitter, { MARKET_MODAL_CLOSE, GEO, GEO_SUCCESS, GEO_MAP } from 'helpers/event';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {span: 3},
  wrapperCol: {span: 20}
};

export function getPoint(address) {
  const decodeUrl = `http://restapi.amap.com/v3/geocode/geo?key=${AMAP_KEY}&address=${address}`;
  return axios.get(encodeURI(decodeUrl))
    .then(data => data.data)
    .then(data => {
      if (parseInt(data.status) === 1) {
        const geocode = data.geocodes[0];
        const location = geocode.location;
        return {
          longitude: location.split(',')[0],
          latitude: location.split(',')[1],
        };
      } else {
        throw new Error('地址解析有误,请仔细查看您输入的地址信息!');
      }
    });
}

export function getFullAddress(region, address) {
  const [ province, city ] = region;
  const [ , provinceName ] = province.split('-');
  const [ cityCode, cityName ] = city.split('-');

  return {
    fullAddress: `${provinceName}${cityName}${address}`,
    cityCode,
  };
}

export default class AddressSelection extends Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    provinceAndCity: PropTypes.array.isRequired,
    region: PropTypes.array.isRequired,
    setRegion: PropTypes.func.isRequired
  }
  state = {
    fullAddress: '',
    isMapShowed: false,
  }
  componentDidMount() {
    EventEmitter.on(GEO, () => {
      this.getLocation(this.props.region);
    });

    // TODO: this is an ugly way to auto fill map
    if (this.props.mode === 'edit') {
      const timer = setInterval(() => {
        const { region, form } = this.props;
        const address = form.getFieldValue('address');
        if (region && region.length > 0 && address ) {
          this.getLocation(region);
          clearInterval(timer);
        }
      }, 500); 
    }  
  }
  componentWillUnmount() {
    this.props.setRegion([]);
    EventEmitter.off(GEO);
  }
  setupMap() {
    return new Promise(resolve => {
      AMap.plugin('AMap.Geocoder',function(){
        const map = new AMap.Map('location-map',{
          resizeEnable: true,
          zoom: 17,
        });
        const geocoder = new AMap.Geocoder({});
        const marker = new AMap.Marker({
          bubble: true,
          map,
        });
        EventEmitter.on(GEO_MAP, fullAddress => {
          geocoder.getLocation(fullAddress, function(status,result){
            if(status=='complete' && result.geocodes.length){
              const geocode = result.geocodes[0];
              marker.setPosition(geocode.location);
              map.setCenter(marker.getPosition());
            }
          });
        });
        resolve();
      });
    });
  }
  handleAddressBlur() {
    this.getLocation(this.props.region);
  }
  handleRegionChange(value) {
    this.props.setRegion(value);
    this.getLocation(value);
  }
  getLocation(region) {
    const { form } = this.props;
    const { address } = form.getFieldsValue();

    if (region && region.length) {
      var { fullAddress, cityCode } = getFullAddress(region, address);
    } else {
      message.error('请选择区域!');
      return;
    }

    if (address) {
      getPoint(fullAddress)
        .then(({longitude, latitude}) => {
          this.setState({fullAddress}, () => {
            // 第一次解析地址成功时，打开地图
            if (!this.state.isMapShowed) {
              this.showMap();
            }
          });
          EventEmitter.emit(GEO_SUCCESS, {citycode: cityCode || 0, address, longitude, latitude});
          EventEmitter.emit(GEO_MAP, fullAddress);
        })
        .catch(error => message.error(error.message));
    } else {
      this.setState({fullAddress: ''});
    }
  }
  showMap() {
    const { isMapShowed, fullAddress } = this.state;
    if (isMapShowed) {
      EventEmitter.emit(GEO_MAP, fullAddress);
    } else {
      this.setState({isMapShowed: true}, () => {
        this.setupMap()
          .then(EventEmitter.emit(GEO_MAP, fullAddress));
      });
    }
  }
  render() {
    const { form, provinceAndCity, region } = this.props;
    const { getFieldDecorator, getFieldsValue } = form;
    const { fullAddress, locationPreviewVisible } = this.state;
    const requiredFieldDecorators = addRequiredDecorator(['address'], getFieldDecorator);
    return (
      <div>
       <FormItem label="地址" {...formItemLayout} required>
          <Row>
            <Col span={5}>
              <Cascader placeholder="请选择区域"
                options={transformProviceAndCity(provinceAndCity)}
                value={region}
                onChange={::this.handleRegionChange}/>
            </Col>
            <Col span={18} offset={1}>
              {requiredFieldDecorators('address')(
                <Input placeholder="详细地址: 区+街道+门牌号,便于用户精确定位门店位置"
                  onBlur={::this.handleAddressBlur}/>
              )}
            </Col>
          </Row>
          <div id="location-map" 
            style={{width: '100%', height: '300px', marginTop: '16px', display: fullAddress ? 'block' : 'none'}}>
          </div>
        </FormItem>
      </div>
    );
  }
}

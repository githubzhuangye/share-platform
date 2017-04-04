import { DataPublicApi } from 'api';
const PREFIX = '@@DATACHARTS/';
const FETCH_CHANNELDATA = PREFIX + 'FETCH_CHANNELDATA';

const IS_LOADING_CHANNEL = PREFIX + 'IS_LOADING_CHANNEL';

export function fetchChannelData(ChannelData) {
  return {
    type: FETCH_CHANNELDATA,
    ChannelData
  };
}
export function isloadingChannel() {
  return {
    type: IS_LOADING_CHANNEL
  };
}


export function handleChannelData(type,activeid,begin_time,end_time) {
  return (dispatch, getState) => {
      dispatch(isloadingChannel());
      return DataPublicApi.channelDataAnalysis(type,activeid,starttime,endtime)
      .then(data => dispatch(fetchChannelData(data)))
      .then(dispatch(isloadingChannel()));
  };
}

const initialState = {
  ChannelData: {},
  isloadingChannel: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_CHANNELDATA:
      return {...state, ChannelData: action.ChannelData};
    case IS_LOADING_CHANNEL:
      return {...state, isloadingChannel: !state.isloadingChannel};
    default:
      return state;
  }
}

import React from 'react';
import { storiesOf } from '@storybook/react';
import { OrderStatus } from '../components';
import addressDoc from '../components/OrderStatus/README.md';
import DemoContainer from '../tools/DemoContainer';
import { handleLogin } from '../utils/utils';
import axios from '../http';

class Demo1 extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      waybills: [],
      trackInfo: {},
      token: ""
    }
  }

  componentDidMount() {
    this.initOrderInfo();
  }

  handleSearchOrders = (params) => {
    const { token } = this.state;
    return axios.get('/api/v1/order/list', {
      ...params,
      headers: { "x-token": token }
    })
  }

  handleSearchOrderStatus = (waybillNo) => {
    const { token } = this.state;
    return axios.get(`/api/v1/order/track/${waybillNo}`, {
      headers: { "x-token": token }
    })
  }

  initOrderInfo = async () => {
    let resLogin = await handleLogin();
    if (resLogin.errorCode === 0) {
      const token = resLogin.data.token;
      this.setState({ token });
    }

    let resWaybills = await this.handleSearchOrders({ pageIndex: 1, pageSize: 8 });
    if ((resWaybills.errorCode === 0) && (resWaybills.data.length > 0)) {
      const waybills = resWaybills.data;
      this.setState({ waybills });

      const waybillNo = waybills[0].waybillNo;

      let resOrderStatus = await this.handleSearchOrderStatus(waybillNo);
      if (resOrderStatus.errorCode === 0) {
        const trackInfo = resOrderStatus.data;
        this.setState({ trackInfo });
      }
    }
  }

  render() {
    const { trackInfo } = this.state;

    return (
      <DemoContainer>
        <OrderStatus
          trackInfo={trackInfo}
        />
      </DemoContainer>
    )
  }
}
storiesOf('OrderStatus', module)
  .add('OrderStatus',
    () => <Demo1 />,
    { notes: addressDoc }
  )
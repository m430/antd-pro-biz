import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { storiesOf } from '@storybook/react';
import { ProductCard } from '../components';
import addressDoc from '../components/ProductCard/README.md';
import DemoContainer from '../tools/DemoContainer';
import { handleLogin } from '../utils/utils';
import { Col, Row } from 'antd';
import axios from '../http';

class Demo1 extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      products: [],
      token: ""
    }
  }

  componentDidMount() {
    this.initProducts();
  }

  handleSearchProducts = (params) => {
    const { token } = this.state;
    return axios.get('/api/v1/products', {
      ...params,
      headers: { "x-token": token }
    })
  }

  initProducts = async () => {
    let resLogin = await handleLogin();
    if (resLogin.errorCode === 0) {
      const token = resLogin.data.token;
      this.setState({ token });
    }

    let resProducts = await this.handleSearchProducts({ pageIndex: 1, pageSize: 8 });
    if (resProducts.errorCode === 0) {
      const products = resProducts.data;
      this.setState({ products });
    }
  }

  render() {
    const { products } = this.state;
    return (
      <DemoContainer>
        <MemoryRouter>
          <Row type="flex" justify="center" align="bottom" gutter={24}
            style={{ width: '1136px', marginLeft: 'auto', marginRight: 'auto' }}
          >
            {products.map(item => (
              <Col
                key={item.id}
                span={6}
                style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}
              >
                <ProductCard item={item} selectedServices={[]} ></ProductCard>
              </Col>
            ))}
          </Row>
        </MemoryRouter>
      </DemoContainer>
    )
  }
}
storiesOf('ProductCard', module)
  .add('Products',
    () => <Demo1 />,
    { notes: addressDoc }
  )
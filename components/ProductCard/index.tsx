import React, { Component } from 'react';
import _ from 'lodash';
import { Card } from 'antd';
import Link from 'umi/link';
import MyIcon from '../../tools/MyIcon';
import { Ellipsis } from 'antd-pro-toolkit';
import './style';

const { Meta } = Card;

export interface ProductInfo {
  id: string;
  name: string;
  introduction: string;
  brand: string;
  image: string;
  // addressType: number;
  // serviceTypes?: any[];
  tagNameList?: string[];
}

export interface ProductCardProps {
  item: ProductInfo;
  link: string;
}

export interface ProductCardState {
  services: Array<any>,
}

export default class ProductCard extends Component<ProductCardProps, ProductCardState> {

  constructor(props: ProductCardProps) {
    super(props);
  }

  componentDidMount() {
    const { } = this.props;
  }

  render() {
    const { item, link } = this.props;

    const iconType = 'icon-' + item.brand;
    const tags = item.tagNameList ? (
      item.tagNameList.map((tag: string, index: number) => {
        return (
          <Ellipsis key={index} tooltip length={6} className="productTag">
            {tag}
          </Ellipsis>
        );
      })
    ) : (
        <div className="productTag" />
      );
    return (
      <Link to={link}>
        <Card
          hoverable
          cover={
            <img
              className="productImg"
              alt="example"
              src={
                item.image || 'https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png'
              }
            />
          }
          // headStyle={{ lineHeight: 1, marginBottom: 30 }}
          bodyStyle={{
            padding: '20px 12px 12px',
            height: 122,
            width: 264,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'spaceBetween',
          }}
        >
          <Meta
            title={
              <Ellipsis tooltip length={12}>
                {item.name}
              </Ellipsis>
            }
            style={{ flex: 1 }}
            description={
              <Ellipsis tooltip length={12}>
                {item.introduction}
              </Ellipsis>
            }
          />
          <div
            style={{
              height: 20,
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'start',
                alignContent: 'center',
              }}
            >
              {tags}
            </div>
            <MyIcon type={iconType} style={{ fontSize: 30, marginRight: -5 }} />
          </div>
        </Card>
      </Link>
    );
  }
}

import React, { Component } from 'react';
import _ from 'lodash';
import { Card } from 'antd';
<<<<<<< HEAD
=======
import MyIcon from '../../tools/MyIcon';
>>>>>>> 073ce645735447a67f4cbf54502537ed6fa90772
import { Ellipsis } from 'antd-pro-toolkit';
import './style';

const { Meta } = Card;

export interface ProductInfo {
  id: string;
  name: string;
  introduction: string;
  brand: string;
  image: string;
  tagNameList?: string[];
}

export interface ProductCardProps {
  item: ProductInfo;
<<<<<<< HEAD
  brandIcon: React.ReactNode;
=======
>>>>>>> 073ce645735447a67f4cbf54502537ed6fa90772
  onClick?: ((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void) | undefined;
}

export interface ProductCardState {
  services: Array<any>,
}

export default class ProductCard extends Component<ProductCardProps, ProductCardState> {

  constructor(props: ProductCardProps) {
    super(props);
  }

  render() {
<<<<<<< HEAD
    const { item, onClick, brandIcon } = this.props;
=======
    const { item, onClick } = this.props;
>>>>>>> 073ce645735447a67f4cbf54502537ed6fa90772

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
      <div onClick={onClick}>
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
          <div className="featuresContainer">
            <div className="tagContainer">
              {tags}
            </div>
            {brandIcon}
          </div>
        </Card>
      </div>
    );
  }
}

import React, { Component, Fragment } from 'react';
import { Divider, Timeline, Icon } from 'antd';
import './style';

export interface TrackingStep {
  id: number;
  time: string;
  statusName: string;
  trackMessage: string;
  year?: string;
  week?: string;
}

export interface TrackingInfo {
  date: string;
  whichDay: string;
  trackingList: TrackingStep[];
}

export interface OrderTrackingStatus {
  [index: string]: TrackingInfo[];
}

export interface OrderStatusProps {
  trackInfo: OrderTrackingStatus;
}

export default class OrderStatus extends Component<OrderStatusProps, any> {

  constructor(props: OrderStatusProps) {
    super(props);
  }

  render() {
    const { trackInfo } = this.props;
    let trackKeys = Object.keys(trackInfo);
    let subWaybillsList = Object.entries(trackInfo)
    const timelineDot = (index: number) => {
      if (index === 0) {
        return <span className="dotfist"><Icon type="check" /></span>
      } else {
        return <span className="dots"></span>
      }
    }

    const content = subWaybillsList.length > 0 && subWaybillsList.map(([key, val], index1) => {
      let list = val.map((item: TrackingInfo) => {
        return item.trackingList.map((sub: TrackingStep, index: number) => {
          if (index === 0) {
            return Object.assign({}, sub, { year: item.date, week: item.whichDay })
          }
          return sub
        })
      }).reduce((total: TrackingInfo[], current) => {
        return [...total, ...current]
      }, [])
      return (
        <div style={{ width: 600, paddingTop: 24 }} key={index1}>
          {trackKeys.length > 1 && (
            <Divider orientation="left" style={{ width: 400 }}>子单号：{key}</Divider>
          )}
          <div className="timelines">
            <div className="timelinesItem">
              <Timeline>
                {
                  list.map((item: TrackingStep, index: number) => {
                    return (
                      <Fragment key={index}>
                        <Timeline.Item dot={timelineDot(index)}>
                          {item.year && <div className="whichDay">{item.year}&nbsp;{item.week}</div>}
                          <span className="messageTime">{item.time}</span>
                          <span className="statusName">{item.statusName}</span>
                          <span className="trackMessage">{item.trackMessage}</span>
                        </Timeline.Item>
                      </Fragment>
                    )
                  })
                }
              </Timeline>
            </div>
          </div>
        </div>
      );
    });

    return content;
  }
}

import React, { Component } from 'react';
import _ from 'lodash';
import { TabCascader, PanelData, Item, Result } from 'antd-pro-toolkit';
import { CascaderProps } from 'antd-pro-toolkit/lib/TabCascader';

export interface GroupData {
  code: string;
  name: string;
  maxLevel: number;
}

export interface AddressSelectorProps extends CascaderProps {
  type?: number;
  value?: Array<Item>;
  topTabData: Array<GroupData>;
  onSearch: (params?: any) => Promise<Result>;
}

export interface AddressSelectorState {
  hotCities: Array<any>,
  dataSource: Array<PanelData>
}

export default class AddressSelector extends Component<AddressSelectorProps, AddressSelectorState> {

  constructor(props: AddressSelectorProps) {
    super(props);
    this.state = {
      hotCities: [],
      dataSource: []
    }
  }

  componentDidMount() {
    const { topTabData, value } = this.props;
    if (topTabData && topTabData.length > 0) {
      this.initDataSource(topTabData, value);
    }
  }

  componentWillReceiveProps(nextProps: AddressSelectorProps) {
    const { topTabData, value } = nextProps;
    this.initDataSource(topTabData, value);
  }

  initDataSource = async (topTabData: Array<GroupData>, value?: Array<Item>) => {
    let { hotCities, dataSource } = this.state;

    // 只初始化一次
    if (hotCities.length == 0) {
      let resFirst = await this.searchArea({ isHot: true });
      let hotCities = resFirst.data || [];

      this.setState({ hotCities })
    }

    let groups = topTabData;
    dataSource = groups.map((g: GroupData) => {
      let dataItem: PanelData = {
        title: g.name,
        maxLevel: g.maxLevel,
        code: g.code,
        data: []
      }
      if (g.code === '0') {
        dataItem.data = [
          {
            title: '常用市',
            level: 3,
            entry: false,
            items: hotCities
          },
          {
            title: '省/直辖市',
            level: 2,
            entry: false,
            items: []
          }
        ];
      } else if (g.code === '1') {
        dataItem.data = [
          {
            title: '港澳台',
            level: 2,
            entry: false,
            items: []
          }
        ]
      } else if (g.code === '2') {
        dataItem.data = [
          {
            title: '海外',
            level: 1,
            entry: false,
            items: []
          }
        ]
      }
      return dataItem;
    });
    if (value && value.length > 0) {
      this.setInitialValue(dataSource, value);
    }
    this.setState({ dataSource });
  }

  setInitialValue = async (dataSource: Array<PanelData>, value: Array<Item>) => {
    debugger;
    let groupCode = value[0].groupCode;
    let panelData = dataSource.find((panelData: PanelData) => panelData.code == groupCode);
    if (panelData && panelData.data.length > 0) {
      for (let i = 0; i < value.length; i++) {
        let panelIdx = i;
        if (groupCode == '0') panelIdx++;
        if (!panelData.data[panelIdx]) {
          panelData.data[panelIdx] = {
            title: '',
            level: 0,
            entry: false,
            items: []
          };
        }
        panelData.data[panelIdx].title = value[i].name;
        panelData.data[panelIdx].level = value[i].level;
        panelData.data[panelIdx].entry = true;
        if (i == value.length - 1) {
          // 最后一级要把数据初始化出来
          let res = await this.searchArea({ parentCode: value[i].parentCode, level: value[i].level });
          if (res.errorCode === 0) {
            panelData.data[panelIdx].items = res.data;
          }
        }
      }
      for (let j = 0; j < dataSource.length; j++) {
        if (dataSource[j].code == groupCode) {
          dataSource[j] = panelData;
          break;
        }
      }
      this.setState({ dataSource });
    }
  }

  searchArea = async ({
    isHot = false,
    pageSize = 999,
    ...rest
  }: any) => {
    const { type, onSearch } = this.props;
    let res = await onSearch({
      isHot,
      pageSize,
      type,
      ...rest
    })
    return res;
  }

  handleSearch = async (val: string) => {
    let res = await this.searchArea({ content: val });
    return res.data;
  }

  handleTopTabChange = (topKey: number) => {
    const { dataSource } = this.state;
    let tabData = dataSource[topKey].data;
    if (topKey != 0 && tabData.length > 0 && tabData[0].items.length === 0) {
      this.searchArea({ groupCode: topKey, level: tabData[0].level }).then(res => {
        tabData[0].items = res.data;
        dataSource[topKey].data = tabData;
        this.setState({ dataSource });
      })
    }
  }

  handleTabChange = (key: number, topKey: number, item: Item) => {
    const { dataSource } = this.state;
    let tabData = dataSource[topKey].data;
    let level = tabData[key].level;
    let query: any = { groupCode: topKey };
    if (key == 0) {
      query.isHot = true;
    } else {
      if (item) {
        query.parentCode = item.parentCode;
      } else {
        query.level = level;
      }
    }
    return this.searchArea(query).then(res => {
      tabData[key].items = res.data;
      if (topKey == 0 && key > 0) {
        tabData = tabData.slice(0, key + 1);
      }
      dataSource[topKey].data = tabData;
      this.setState({ dataSource });
      return res;
    });
  }

  buildDataSource = (key: number, topKey: number, item: Item, data: Array<Item>) => {
    let { dataSource } = this.state;
    let tabData = dataSource[topKey].data;
    let currentData = tabData[key];
    if (key == 0 && topKey == 0) {
      tabData = tabData.slice(0, key + 2);
      tabData[1].title = '省/直辖市';
      tabData[1].entry = false;
    } else {
      tabData = tabData.slice(0, key + 1);
      tabData[0].entry = false;
      tabData[key].title = item.name;
    }
    if (item.level !== 4) {
      tabData.push({
        title: '请选择',
        level: currentData.level + 1,
        entry: false,
        items: data
      });
    }
    tabData[key].entry = true;

    dataSource[topKey].data = tabData;
    this.setState({ dataSource });
    return dataSource;
  }

  handleItemClick = (key: number, topKey: number, item: Item) => {
    let { dataSource } = this.state;
    if (item.level === dataSource[topKey].maxLevel) {
      dataSource[topKey].data[key].title = item.name;
      dataSource[topKey].data[key].entry = true;
      this.setState({ dataSource });
      return Promise.resolve(dataSource[topKey].data.length - 1);
    }
    return this.searchArea({ parentCode: item.code, level: item.level + 1 }).then(res => {
      this.buildDataSource(key, topKey, item, res.data);
    });
  }

  handleSearchItemClick = (item: Item) => {
    let { dataSource } = this.state;
    let gCode = Number(item.groupCode);
    let maxLevel = dataSource[gCode].maxLevel;
    let groupData = dataSource[gCode].data;
    let lastData = groupData[groupData.length - 1];
    let betweenLastLevel = item.level - lastData.level;
    const fillGroupData = async () => {
      for (let i = 0; i < groupData.length; i++) {
        let dataItem = groupData[i];
        if (gCode == 0 && i == 0) {
          dataItem.entry = false;
          continue;
        }
        let level = dataItem.level;
        dataItem.title = level === item.level ? item.name : item[`areaName${level}`];
        dataItem.entry = true;
        dataItem.items = [];
      }
      let query: any = {};
      if (item.level !== maxLevel) {
        query.parentCode = item.code;
        query.level = item.level + 1;
      } else {
        query.parentCode = item.parentCode;
        query.level = item.level;
      }
      let res = await this.searchArea(query);
      if (item.level !== maxLevel) {
        groupData.push({
          title: '请选择',
          level: item.level + 1,
          entry: false,
          items: res.data
        });
      } else {
        groupData[groupData.length - 1].items = res.data;
      }

      return groupData;
    }
    if (betweenLastLevel > 0) { // 点击的级别大于tab最后一个的级别
      // 补齐level
      for (let i = lastData.level + 1; i <= item.level; i++) {
        groupData.push({
          title: '',
          level: i,
          entry: false,
          items: []
        });
      }
    } else {
      groupData = groupData.slice(0, groupData.length - Math.abs(betweenLastLevel));
    }
    return fillGroupData().then(() => {
      dataSource[gCode].data = groupData;
      this.setState({ dataSource });
    })
  }

  render() {
    const { dataSource } = this.state;
    const { placeholder, hint, addonAfter, style, className, onChange, value } = this.props;

    console.log('disdbisni', value)
    return (
      <TabCascader
        onTabChange={this.handleTabChange}
        onTopTabChange={this.handleTopTabChange}
        onItemClick={this.handleItemClick}
        onSearchItemClick={this.handleSearchItemClick}
        onSearch={this.handleSearch}
        onChange={onChange}
        value={value}
        style={style}
        className={className}
        dataSource={dataSource}
        placeholder={placeholder}
        addonAfter={addonAfter}
        hint={hint}
      />
    )
  }
}

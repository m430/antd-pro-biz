import React, { Component } from 'react';
import _ from 'lodash';
import { TabCascader, PanelData, Item, Result } from 'antd-pro-toolkit';
import { CascaderProps, TabData } from 'antd-pro-toolkit/es/TabCascader';

export interface GroupData {
  code: string;
  name: string;
  maxLevel: number;
}

export interface AddressSelectorProps extends CascaderProps {
  type?: number;
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
    const { dataSource } = this.state;
    if (topTabData != this.props.topTabData) {
      this.initDataSource(topTabData, value);
    }
    if (!value && value != this.props.value && topTabData && topTabData.length > 0 && dataSource.length > 0) {
      this.initDataSource(topTabData, value);
    }
  }

  initDataSource = async (topTabData: Array<GroupData>, value?: Array<Item>) => {
    let { dataSource, hotCities } = this.state;

    // 只初始化一次
    if (hotCities.length == 0) {
      let resFirst = await this.searchArea({ isHot: true });
      hotCities = resFirst.data || [];
      this.setState({ hotCities });
    }

    let groups = topTabData;
    dataSource = groups.map((g: GroupData) => {
      let dataItem: PanelData = {
        title: g.name,
        maxLevel: g.maxLevel,
        code: g.code,
        items: []
      }
      if (g.code === '0') {
        dataItem.items = [
          {
            title: '热门',
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
        dataItem.items = [
          {
            title: '港澳台',
            level: 2,
            entry: false,
            items: []
          }
        ]
      } else if (g.code === '2') {
        dataItem.items = [
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
      await this.setInitialValue(dataSource, value);
    }
    this.setState({ dataSource });
  }

  setInitialValue = async (dataSource: Array<PanelData>, value: Array<Item>) => {
    let groupCode = value[0].groupCode;
    let panelData = dataSource.find((panelData: PanelData) => panelData.code == groupCode);
    if (panelData && panelData.items.length > 0) {
      panelData.items = this.handlePatchPanelData(panelData.items, value[value.length - 1]);
      let valueIdx = 0
      for (let i = 0; i < panelData.items.length; i++) {
        if (groupCode == '0' && i == 0) i++;
        let dataItem = panelData.items[i];
        valueIdx = value.findIndex(vItem => vItem.level == dataItem.level);
        dataItem.entry = true;
        if (valueIdx == -1) {
          continue;
        } else {
          dataItem.title = value[valueIdx].name;
          if (value[valueIdx].level == panelData.maxLevel) {
            // 最后一级要把数据初始化出来
            let res = await this.searchArea({
              groupCode,
              parentCode: value[valueIdx].parentCode,
              level: value[valueIdx].level
            });
            if (res.errorCode === 0) {
              dataItem.items = res.data;
            }
            break;
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
    let { dataSource } = this.state;
    let tabData = dataSource[topKey].items;

    dataSource = dataSource.map((ds: PanelData) => {
      if (ds.code === '0') {
        ds.items = ds.items.slice(0, 2);
      } else if (ds.code === '1') {
        ds.items = ds.items.slice(0, 1);
      } else if (ds.code === '2') {
        ds.items = ds.items.slice(0, 1);
      }
      return ds;
    });

    if (topKey != 0 && tabData.length > 0 && tabData[0].items.length === 0) {
      this.searchArea({
        groupCode: dataSource[topKey].code,
        level: tabData[0].level
      }).then(res => {
        tabData[0].items = res.data;
        dataSource[topKey].items = tabData;
        this.setState({ dataSource });
      })
    }
  }

  handleTabChange = (key: number, topKey: number, item: Item) => {
    const { dataSource } = this.state;
    let tabData = dataSource[topKey].items;
    let level = tabData[key].level;
    let query: any = { groupCode: dataSource[topKey].code };
    if (key == 0 && dataSource[topKey].code == '0') {
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
      dataSource[topKey].items = tabData;
      this.setState({ dataSource });
      return res;
    });
  }

  buildDataSource = (key: number, topKey: number, item: Item, data: Array<Item>) => {
    let { dataSource } = this.state;
    let panelData: PanelData = dataSource[topKey];
    let tabData = dataSource[topKey].items;
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
    if (item.level !== panelData.maxLevel) {
      tabData.push({
        title: '请选择',
        level: currentData.level + 1,
        entry: false,
        items: data
      });
    }
    tabData[key].entry = true;

    dataSource[topKey].items = tabData;
    this.setState({ dataSource });
    return dataSource;
  }

  handleItemClick = (key: number, topKey: number, item: Item) => {
    let { dataSource } = this.state;
    if (item.level === dataSource[topKey].maxLevel) {
      dataSource[topKey].items[key].title = item.name;
      dataSource[topKey].items[key].entry = true;
      this.setState({ dataSource });
      return Promise.resolve(dataSource[topKey].items.length - 1);
    }
    return this.searchArea({
      groupCode: item.groupCode,
      parentCode: item.code,
      level: item.level + 1
    }).then(res => {
      this.buildDataSource(key, topKey, item, res.data);
    });
  }

  handleSearchItemClick = (item: Item) => {
    let { dataSource } = this.state;
    let gCode = Number(item.groupCode);
    let maxLevel = dataSource[gCode].maxLevel;
    let groupData = dataSource[gCode].items;
    const fillGroupData = async () => {
      for (let i = 0; i < groupData.length; i++) {
        let dataItem = groupData[i];
        if (gCode == 0 && i == 0) {
          dataItem.entry = false;
          continue;
        }
        let level = dataItem.level;
        dataItem.title = level === item.level ? item.name : item.parents[item.parents.length - 1].name;
        dataItem.entry = true;
        dataItem.items = [];
      }
      let query: any = {
        groupCode: item.groupCode,
      };
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
    groupData = this.handlePatchPanelData(groupData, item);
    return fillGroupData().then(() => {
      dataSource[gCode].items = groupData;
      this.setState({ dataSource });
    })
  }

  handlePatchPanelData = (tabDatas: Array<TabData>, lastItem: Item): Array<TabData> => {
    let newDatas: Array<TabData> = [];

    for (let i = 0; i < tabDatas.length; i++) {
      let currentData = tabDatas[i];
      if (currentData.level <= lastItem.level || i == 0) {
        newDatas.push(currentData);
      }
    }

    if (newDatas.length > 0 && newDatas[newDatas.length - 1].level < lastItem.level) {
      for (let j = newDatas[newDatas.length - 1].level + 1; j <= lastItem.level; j++) {
        newDatas.push({
          title: '',
          level: j,
          entry: false,
          items: []
        });
      }
    }
    return newDatas;
  }

  render() {
    const { type, topTabData, onSearch, ...restProps } = this.props;
    const { dataSource } = this.state;

    return (
      <TabCascader
        onTabChange={this.handleTabChange}
        onTopTabChange={this.handleTopTabChange}
        onItemClick={this.handleItemClick}
        onSearchItemClick={this.handleSearchItemClick}
        onSearch={this.handleSearch}
        dataSource={dataSource}
        {...restProps}
      />
    )
  }
}

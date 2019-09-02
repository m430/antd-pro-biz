import React from 'react';
import { storiesOf } from '@storybook/react';
import { AddressSelector } from '../components';
import addressDoc from '../components/AddressSelector/README.md';
import DemoContainer from '../tools/DemoContainer';
import { Icon } from 'antd';
import axios from '../http';

class Demo1 extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      groups: []
    }
  }

  componentDidMount() {
    this.initGroups();
  }

  handleSearch = (params) => {
    return axios.get('/api/v1/areas/search', {
      params
    });
  }

  handleSearchGroup = (params) => {
    return axios.get('/api/v1/areas/search/group', {
      params
    })
  }

  initGroups = async () => {
    let { groups } = this.state;
    let resGroup = await this.handleSearchGroup({ type: 1 });
    if (resGroup.errorCode === 0) {
      groups = resGroup.data.map((g) => {
        if (g.code == '0') {
          g.maxLevel = 4;
        } else if (g.code == '1') {
          g.maxLevel = 3;
        } else {
          g.maxLevel = 2;
        }
        return g;
      });
    }
    this.setState({ groups });
  }

  handleChange = (selectedItems) => {
    console.log(selectedItems);
  }

  render() {
    const { groups } = this.state;
    console.log('groups,', groups)

    let test = [
      {
        areaCode1: "CN",
        areaCode2: "130000",
        areaCode3: "130600",
        areaCode4: null,
        areaName1: "中国",
        areaName2: "河北省",
        areaName3: "保定市",
        areaName4: null,
        code: "130600",
        groupCode: "0",
        id: 54,
        level: 3,
        name: "保定市",
        parentCode: "130000",
      },
      {
        areaCode1: "CN",
        areaCode2: "130000",
        areaCode3: "130600",
        areaCode4: "130602",
        areaName1: "中国",
        areaName2: "河北省",
        areaName3: "保定市",
        areaName4: "竞秀区",
        code: "130602",
        groupCode: "0",
        id: null,
        level: 4,
        name: "竞秀区",
        parentCode: "130600",
      }
    ]

    console.log('test value', test);
    return (
      <DemoContainer>
        <AddressSelector
          type={1}
          topTabData={groups}
          onSearch={this.handleSearch}
          onChange={this.handleChange}
          placeholder="请选择地址"
          addonAfter={<Icon type="ellipsis" />}
          value={test}
          style={{ width: 500 }}
          hint="温馨提示：支持中文、拼音或首字母，如：西安 或 XA"
        />
      </DemoContainer>
    )
  }
}
storiesOf('Address', module)
  .add('TabCascader',
    () => <Demo1 />,
    { notes: addressDoc }
  )
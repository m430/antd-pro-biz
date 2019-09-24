import React from 'react';
import { storiesOf } from '@storybook/react';
import { WaybillNoSelect } from '../components';
import addressDoc from '../components/WaybillNoSelect/README.md';
import DemoContainer from '../tools/DemoContainer';

class Demo1 extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      fileInfoList: [],
    }
  }

  componentDidMount() {
  }

  handleChange = (items) => {
    console.log(items);
  }

  render() {
    return (
      <DemoContainer>
        <WaybillNoSelect
          placeholder="最多可查询10条订单，请以都好、空格或者回车隔开"
          onChange={this.handleChange}
        />
      </DemoContainer>
    )
  }
}
storiesOf('WaybillNoSelect', module)
  .add('WaybillNoInput',
    () => <Demo1 />,
    { notes: addressDoc }
  )
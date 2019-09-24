import React from 'react';
import { storiesOf } from '@storybook/react';
import { Uploader } from '../components';
import addressDoc from '../components/Uploader/README.md';
import DemoContainer from '../tools/DemoContainer';
import LocaleWrapper from '../utils/localeWrapper';
import { handleLogin } from '../utils/utils';
import { setLocale } from 'umi-plugin-locale';

class Demo1 extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      fileInfoList: [],
      token: ""
    }
  }

  componentDidMount() {
    setLocale("zh-CN")
    this.initUserLogin();
  }

  initUserLogin = async () => {
    let resLogin = await handleLogin();
    if (resLogin.errorCode === 0) {
      const token = resLogin.data.token;
      this.setState({ token });
    }
  }

  handleChange = info => {
    const { fileInfoList } = this.state;
    this.setState({ fileInfoList: [...fileInfoList, { id: info.file.response.data.id }] });
    console.log(info);
  };

  handleRemove = info => {
    const { fileInfoList } = this.state;
    this.setState({ fileInfoList: fileInfoList.filter(item => item.id !== info.id) });
    console.log(info);
  };

  render() {
    return (
      <DemoContainer>
        <LocaleWrapper>
          <Uploader
            // ref={ref => this.uploadRef = ref}
            style={{ marginTop: 24 }}
            width={380}
            uploadInfo={{
              action: '/api/v1/sys/files/upload',
              accept: '.jpg,.jpeg,.png,.zip,.rar,.doc,.docx,.xls,.xlsx,.pdf',
            }}
            handleChange={this.handleChange}
            handleRemove={this.handleRemove}
          />
        </LocaleWrapper>
      </DemoContainer>
    )
  }
}
storiesOf('Uploader', module)
  .add('Normal',
    () => <Demo1 />,
    { notes: addressDoc }
  )
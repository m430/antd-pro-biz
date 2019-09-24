import React, { Component } from 'react';
import { Upload, Modal, message, Icon, Button } from 'antd';
import { UploadFile, UploadChangeParam } from 'antd/lib/upload/interface';
import _ from 'lodash';
import { formatMessage } from 'umi-plugin-locale';
import UploaderFile, { FileInfo } from './UploaderFile';

export interface UploadInfo {
  action: string;
  accept: string;
}

export interface UploaderProps {
  uploadInfo: UploadInfo;
  isView: boolean;
  width: number;
  fileList: FileInfo[];
  handleChange: (params?: UploadChangeParam<UploadFile>) => void;
  handleRemove: (params?: FileInfo) => void;
}

export interface UploaderState {
  previewVisible: boolean,
  previewImage: string,
  fileUploading: boolean,
  fileList: FileInfo[],
}

export default class Uploader extends Component<UploaderProps, UploaderState> {

  constructor(props: UploaderProps) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: '',
      fileUploading: false,
      fileList: [],
    }
  }

  componentDidMount() {
    const { fileList } = this.props;
    if (fileList && fileList.length) {
      this.setState({ fileList });
    }
  }

  componentWillReceiveProps(props: UploaderProps) {
    const { fileList } = props;
    if (fileList && fileList.length) {
      this.setState({ fileList });
    }
  }

  beforeUpload = (file: File) => {
    if (!/\.(jpg|jpeg|png|zip|rar|doc|docx|xls|xlsx|pdf)$/.test(file.name)) {
      message.error(
        formatMessage({ id: 'antd-pro-biz.errorMessage.wrongFileFormat' })
      );
      return false;
    }
    const imgType = ['jpg', 'jpeg', 'png'];
    const fileType = file.type.split('/')[1];
    const isImg = imgType.includes(fileType);
    let maxSize = isImg ? 2 : 10;
    const scaleOut = file.size / 1024 / 1024 <= maxSize;
    if (!scaleOut) {
      message.error(
        formatMessage({ id: 'antd-pro-biz.errorMessage.wrongSize' }) +
        `${maxSize}MB!`
      );
      return false;
    }
    return scaleOut;
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = (item: FileInfo) => {
    const imgType = ['jpg', 'jpeg', 'png'];
    const fileType = item.type.split('/')[1];
    const isImg = imgType.includes(fileType);
    if (!isImg)
      return message.error(
        formatMessage({ id: 'antd-pro-biz.errorMessage.previewNotSupport' })
      );
    this.setState({
      previewImage: (item.path || '').replace('_150x150', ''),
      previewVisible: true,
    });
  };

  handleChange = (info: UploadChangeParam<UploadFile>) => {
    const { handleChange } = this.props;
    const { fileList } = this.state;
    if ('uploading' === info.file.status) {
      this.setState({ fileUploading: true });
      return;
    }
    if ('done' === info.file.status) {
      if (info.file.response.errorCode === 0) {
        this.setState({ fileUploading: false, fileList: [...fileList, info.file.response.data] });
        handleChange(info);
      } else {
        this.setState({ fileUploading: false });
        message.error(info.file.response.msg);
      }
    }
  };

  handleRemoveFile = (file: FileInfo) => {
    const { handleRemove } = this.props;
    const { fileList } = this.state;
    this.setState({ fileList: fileList.filter(item => item.id !== file.id) });
    handleRemove(file);
  };

  render() {
    const { uploadInfo, isView = false, width = 300 } = this.props;
    const { previewVisible, previewImage, fileUploading, fileList } = this.state;
    return (
      <div style={{ width: width }}>
        <Upload
          {...uploadInfo}
          showUploadList={false}
          beforeUpload={this.beforeUpload}
          onChange={this.handleChange}
        >
          {!isView && (
            <Button>
              <Icon type={fileUploading ? 'loading' : 'paper-clip'} />{' '}
              {formatMessage({
                id: 'antd-pro-biz.attachment.upload',
              })}
            </Button>
          )}
        </Upload>
        {fileList.map((item: FileInfo) => (
          <UploaderFile
            isUploading={!isView}
            key={item.id}
            item={item}
            handlePreview={this.handlePreview}
            handleRemove={this.handleRemoveFile}
          />
        ))}
        <Modal
          maskClosable={false}
          keyboard={false}
          visible={previewVisible}
          footer={null}
          onCancel={this.handleCancel}
          width={800}
        >
          <img style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

import * as React from 'react';
import { UploadFile, UploadChangeParam } from 'antd/lib/upload/interface';

export interface FileInfo {
  id: string;
  name: string;
  originPath: string;
  path: string;
  thumbnailPath: string;
  type: string;
}

export interface IUploaderFileProps {
  item: FileInfo,
  isUploading: boolean;
  handlePreview: (params: FileInfo) => void;
  handleRemove: (params: FileInfo) => void;
}

export default class UploaderFile extends React.Component<IUploaderFileProps, any> { }
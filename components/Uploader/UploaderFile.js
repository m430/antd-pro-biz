import React from 'react';
import { Icon } from 'antd';
import './style';
import { Ellipsis } from 'antd-pro-toolkit';
const UploaderFile = ({ item, handlePreview, isUploading = true, handleRemove }) => {
  const imgType = ['png', 'jpeg', 'jpg'];
  const ext = item.path.substr(item.path.lastIndexOf('.') + 1);
  const isImg = imgType.includes(ext);
  return (
    <span className="uploadFile">
      <div className="ant-upload-list ant-upload-list-text">
        <div className="ant-upload-list-item ant-upload-list-item-done">
          <div className="ant-upload-list-item-info">
            <span className="name">
              <Icon style={{ fontSize: 14 }} type={isImg ? 'file-image' : 'file'} />
              <a className="name" style={{ marginLeft: 20 }}>
                <Ellipsis tooltip length={13}>
                  {item.name}
                </Ellipsis>
              </a>
            </span>
          </div>
          {isUploading ? (
            <Icon style={{ fontSize: 14 }} type="close" onClick={() => handleRemove(item)} />
          ) : (
              <a
                href={item.path}
                download={`${item.name}`}
                style={{ color: 'rgba(0, 0, 0, 0.65)', marginLeft: 10 }}
              >
                <Icon style={{ fontSize: 14 }} type="download" />
              </a>
            )}
          {isImg && (
            <Icon style={{ fontSize: 14 }} type="eye" onClick={() => handlePreview(item)} />
          )}
        </div>
      </div>
    </span>
  );
};

export default UploaderFile;

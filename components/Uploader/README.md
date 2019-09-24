## 何时使用

需要给服务器从电脑上传图片等文件时。组件可以上传文件，并且展示已经上传的文件：

### Properties

| 参数        | 说明                             | 类型               | 默认值 |
| ----------- | -------------------------------- | ------------------ | ------ |
| uploadInfo  | `UploadInfo`参考下面的结构         | `UploadInfo`            |        |
| isView       | 上传+展示组件/展示组件             | `Boolean`      |        |
| width       | 宽度样式                         | `Number`    |        |
| fileList   | `Array<FileInfo>`参考下面的结构    | `Array<FileInfo>`    |        |

### Events

| 参数     | 说明                       | 类型                    | 默认值 |
| -------- | -------------------------- | ----------------------- | ------ |
| onRemove | 搜索地址接口               | function(params)        | 无     |
| onChange | 选择的`Item`发生变化的事件 | function(selectedItems) | 无     |

### Models

`UploadInfo`定义如下：

```json
{
  action: string;
  accept: string;
}
```

`FileInfo`定义如下：

```json
{
  id: string;
  name: string;
  originPath: string;
  path: string;
  thumbnailPath: string;
  type: string;
}
```

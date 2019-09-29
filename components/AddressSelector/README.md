## 何时使用

多级地址选择，且支持地址搜索，可以使用`AddressSelector`：

### Properties

| 参数        | 说明                             | 类型               | 默认值 |
| ----------- | -------------------------------- | ------------------ | ------ |
| type        | 寄/收地址类型，此处根据接口定义填入  | `any`              |        |
| topTabData  | `Array<GroupData>`参考下面的Model | `Array`            |        |

### Events

| 参数     | 说明                       | 类型                    | 默认值 |
| -------- | -------------------------- | ----------------------- | ------ |
| onSearch | 搜索地址接口               | function(params)        | 无     |


> 注意： `AddressSelector`的Props支持所有`TabCascader`的属性，其余属性请参考[这里](https://m430.github.io/antd-pro-toolkit/?path=/info/advance--tabcascader)

### Models

`GroupData`定义如下：

```json
{
  code: string,       // 此Tab的code
  name: string,       // 此Tab的名称
  maxLevel: number   // 此Tab最大可选择到的级别
}
```

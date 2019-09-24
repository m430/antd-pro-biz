## 何时使用
需要通过卡片的方式展示物流产品时，组件会展示

* 产品配图
* 产品名称
* 所属品牌
* 产品特点

### Properties

| 参数        | 说明                             | 类型               | 默认值 |
| ----------- | -------------------------------- | ------------------ | ------ |
| item        | `ProductInfo`参考上面的结构         | `Object`            |        |

### Models

`ProductInfo`定义如下：

```json
{
  id: string;
  name: string;
  introduction: string;
  addressType: number;
  brand: string;
  image: string;
  serviceTypes: any[];
  tagNameList: string[];
}
```
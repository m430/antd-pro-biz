## 何时使用

多级地址选择，且支持地址搜索，可以使用`AddressSelector`：

### Properties

| 参数        | 说明                             | 类型               | 默认值 |
| ----------- | -------------------------------- | ------------------ | ------ |
| topTabData  | `Array<GroupData>`参考上面的结构 | `Array`            |        |
| value       | 选择的`item`值                   | `Array<Item>`      |        |
| style       | 样式对象                         | `CSSProperties`    |        |
| className   | 样式类                           | `String/Object`    |        |
| placeholder | 输入框提示语                     | `String/ReactNode` |        |
| addonAfter  | 输入框后置标签                   | `String/ReactNode` |        |
| hint        | `Tab`选择下拉框上方的提示语      | `String/ReactNode` |        |

### Events

| 参数     | 说明                       | 类型                    | 默认值 |
| -------- | -------------------------- | ----------------------- | ------ |
| onSearch | 搜索地址接口               | function(params)        | 无     |
| onChange | 选择的`Item`发生变化的事件 | function(selectedItems) | 无     |


### Models

`GroupData`定义如下：

```json
{
  code: string,       // 此Tab的code
  name: string,       // 此Tab的名称
  maxLevel: number   // 此Tab最大可选择到的级别
}
```

## 何时使用
运单号输入框

* 非法运单号需要标红
* 分隔符分割成Tags
  * 逗号
  * 句号
  * 空格
  * 回车分割成tag
* 点X删除：

### Properties

| 参数        | 说明                             | 类型               | 默认值 |
| ----------- | -------------------------------- | ------------------ | ------ |
| placeholder | 输入框提示语                     | `String/ReactNode` |        |

### Events

| 参数     | 说明                       | 类型                    | 默认值 |
| -------- | ------------------------ | ----------------------- | ------ |
| onChange | 输入的`运单号`发生变化的事件 | function(SelectParams)    | 无     |

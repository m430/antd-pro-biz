import React, { Component } from 'react';
import _ from 'lodash';
import {
  Select,
} from 'antd';
import * as R from "ramda";
import './style';

// 【ID1001206】订单查询-提示改进:使用占位的options为了在回车时不会反选已经输入的订单号
const dummy_option: string = 'dummy_option';

export interface SelectParams {
  key: string;
  label: JSX.Element;
}

export interface WaybillNoSelectProps {
  placeholder?: string;
  onChange: (params: SelectParams[]) => void;
}

export interface WaybillNoSelectState {
  waybillNos: SelectParams[],
  hackTimer: any,
}

export default class WaybillNoSelect extends Component<WaybillNoSelectProps, WaybillNoSelectState> {
  private textInput: Select<SelectParams[]> | null;
  constructor(props: WaybillNoSelectProps) {
    super(props);
    this.state = {
      waybillNos: [],
      hackTimer: null,
    }
    this.focus = this.focus.bind(this);
    this.blur = this.blur.bind(this);
  }

  public focus() {
    if (this.textInput !== null) {
      this.textInput.focus();
    }
  }

  public blur() {
    if (this.textInput !== null) {
      this.textInput.blur();
    }
  }

  componentDidMount() {
    const { } = this.props;

  }

  componentWillUnmount() {
    clearTimeout(this.state.hackTimer);
  }

  handleKeyDown = (e: any) => {
    if (e.keyCode == 13) {
      this.blur();
      let hackTimer = setTimeout(() => this.focus(), 50);
      this.setState({
        hackTimer,
      });
    }
  };

  handleInputChange = (values: SelectParams[]) => {
    const { onChange } = this.props;
    const uniqKeys = R.pipe<
      SelectParams[],
      string[],
      string[],
      string[]
    >(
      R.map(R.prop('key')),
      R.map((item: string) => item.trim()),
      R.uniq
    )(values);

    const waybillNos: SelectParams[] = this.manipulationWaybillNos(uniqKeys);
    this.setState({ waybillNos: waybillNos.filter(item => item.key) });
    onChange(waybillNos);
  };

  manipulationWaybillNos = (keys: string[]): SelectParams[] => {
    const waybillNos: SelectParams[] = R.pipe<
      string[],
      string[],
      SelectParams[]
    >(
      R.filter((item: string) => {
        return item !== dummy_option;
      }),
      R.map(this.constructLabelInValue)
    )(keys);

    return waybillNos
  }

  makeLabelNode = (label: string, validNo: boolean): JSX.Element => {
    const className = validNo ? "validLabel" : "invalidLabel";
    return (
      <div
        className={className}
      >
        {label}
      </div>
    );
  };

  constructLabelInValue = (key: string): SelectParams => {
    // 英文或数字
    const pattern = /^[a-zA-Z0-9-]+$/;
    let str = key.trim();

    const isValidNo = pattern.test(str);

    const retVal = {
      key: str,
      label: this.makeLabelNode(key, isValidNo),
    };

    return retVal;
  };

  patternCheck = (orderString: string) => {
    const pattern = /^[a-zA-Z0-9-]+$/;
    let str = orderString.trim();

    return pattern.test(str);
  };

  render() {
    const { waybillNos } = this.state;
    const { placeholder } = this.props;

    return (
      <Select
        ref={(ref) => this.textInput = ref}
        allowClear
        defaultActiveFirstOption={true}
        autoFocus={true}
        labelInValue
        value={waybillNos}
        mode="tags"
        style={{ width: '100%' }}
        placeholder={placeholder}
        onChange={this.handleInputChange}
        showArrow={false}
        size="large"
        tokenSeparators={[',', '，', ' ', ';']}
        menuItemSelectedIcon={null}
        onInputKeyDown={this.handleKeyDown}
        dropdownRender={() => {
          return <></>;
        }}
      >
      </Select>
    )
  }
}

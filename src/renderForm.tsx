import React from 'react';
import { Input, List, Switch, TextArea, Button, Search } from 'antd-mobile';
import { View } from '@tarojs/components';
const _mapKeys = require('lodash.mapkeys');

import { getFormLabel } from './config';

let types: any = {};
interface IRenderForm {
  data: any;
  key: string;
  index: number;
  form: any;
  onChange: (
    key: string,
    index: number,
    data?: number
    // method: 'DELETE' | 'ADD' | 'REPLACE'
  ) => void;
  disabled: boolean;
}

type IRenderObjectMap = {
  data: any;
  form: any;
  onChange: (
    key: string,
    index: number,
    data?: any
    // method: 'DELETE' | 'ADD' | 'REPLACE'
  ) => void;
  disabled?: boolean;
  onUpdateSelect?: (key: string, index: number, data: any) => void;
  filterObject?: boolean;
};

export function renderForm({ data, key, index, form, onChange, disabled = false }: IRenderForm) {
  const { getFieldProps } = form;
  let result;

  types[key] = typeof data;
  if (typeof data === 'string' && /^[\[\{]/g.test(data)) {
    types[key] = 'code';
  }
  switch (types[key]) {
    case 'code':
      <List.Item
        key={`${key}.${index}`}
        title={key
          .split('.')
          .map((v) => getFormLabel(v))
          .join(' / ')}
      >
        <TextArea
          rows={1}
          autoSize={{ minRows: 1, maxRows: 5 }}
          disabled={disabled}
          {...getFieldProps(key)}
          value={data}
          placeholder={key}
          onChange={onChange(key, index, data)}
          className="edit-code"
        />
      </List.Item>;
      break;
    case 'number':
      result = (
        <List.Item
          key={`${key}.${index}`}
          title={key
            .split('.')
            .map((v) => getFormLabel(v))
            .join(' / ')}
        >
          <Input
            {...getFieldProps(key)}
            type="number"
            disabled={disabled}
            value={data}
            placeholder={key}
            onChange={onChange(key, index, data)}
          />
        </List.Item>
      );
      break;
    case 'boolean':
      result = (
        <List.Item
          key={`${key}.${index}`}
          title={key
            .split('.')
            .map((v) => getFormLabel(v))
            .join(' / ')}
        >
          <Switch {...getFieldProps(key)} disabled={disabled} checked={data} onChange={onChange(key, index, data)} />
        </List.Item>
      );
      break;
    case 'symbol':
      result = null;
      break;
    case 'function':
      result = (
        <List.Item
          key={`${key}.${index}`}
          title={key
            .split('.')
            .map((v) => getFormLabel(v))
            .join(' / ')}
        >
          <TextArea
            rows={1}
            autoSize={{ minRows: 1, maxRows: 5 }}
            disabled={disabled}
            {...getFieldProps(key)}
            style={{
              color: '#fff',
              backgroundColor: '#000',
            }}
            value={data.toString()}
            placeholder={key}
            onChange={() => onChange(key, index, data)}
          />
        </List.Item>
      );
      break;
    default:
      result = (
        <List.Item
          key={`${key}.${index}`}
          title={key
            .split('.')
            .map((v) => getFormLabel(v))
            .join(' / ')}
        >
          <TextArea
            rows={1}
            autoSize={{ minRows: 1, maxRows: 5 }}
            disabled={disabled}
            {...getFieldProps(key)}
            value={data.toString()}
            placeholder={key}
            onChange={onChange(key, index, data)}
          />
        </List.Item>
      );
      break;
  }
  return result;
}
export function renderObjectMap({
  data,
  form,
  onChange,
  onUpdateSelect,
  disabled = false,
  filterObject = false,
}: IRenderObjectMap) {
  return Object.keys(data).map((key, index) => {
    // ????????? null ???
    if (typeof data[key] == 'object' && data[key] == null) {
      return renderForm({
        data: '',
        key,
        index,
        form,
        onChange,
        disabled,
      });
    }
    // ?????????????????????filterObject ??? true ????????????
    if (typeof data[key] == 'object' && filterObject) {
      return;
    }
    // ?????????????????????????????????????????????
    if (typeof data[key] == 'object' && !Array.isArray(data[key])) {
      return renderObjectMap({
        data: _mapKeys(data[key], (val, k1) => {
          return `${key}.${k1}`;
        }),
        form,
        onChange,
        disabled,
        onUpdateSelect,
        filterObject,
      });
      // ??????????????????????????????????????????
    } else if (Array.isArray(data[key])) {
      const result = data[key].map((val, i) =>
        renderObjectMap({
          data: _mapKeys(val, (value, k2) => {
            return `${key}.${i}.${k2}`;
          }),
          form,
          onChange,
          disabled,
          onUpdateSelect,
          filterObject,
        })
      );
      result.push(
        <View className="form-actions" key={`${key}.${index}`}>
          <View className="form-action-group">
            <Search
              className="form-action"
              placeholder="???????????????"
              showCancelButton={false}
              onSearch={(value) =>
                onUpdateSelect &&
                onUpdateSelect(
                  key,
                  index,
                  data[key].slice(0, Number(value) - 1).concat(data[key].slice(Number(value))) || []
                )
              }
              // onCancel={(value) => onUpdateSelect && onUpdateSelect(
              //   key,
              //   index,
              //   data[key].slice(0, Number(value) - 1).concat(data[key].slice(Number(value))) || []
              // )}
            />
            <Button
              className="form-action"
              onClick={() => {
                data[key].push(data[key][0]);
                onUpdateSelect && onUpdateSelect(key, index, data[key] || []);
              }}
            >
              ????????????
            </Button>
          </View>
        </View>
      );
      return result;
    } else {
      return renderForm({
        data: data[key],
        key,
        index,
        form,
        onChange,
        disabled,
      });
    }
  });
}

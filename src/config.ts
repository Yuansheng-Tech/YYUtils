export const formLabel = {
  backgroundColor: '背景颜色',

  id: 'ID',
  data: '数据',
  name: '名称',
  status: '状态',
  start_time: '开始时间',
  end_time: '结束时间',
  created_time: '创建时间',
  updated_time: '更新时间',
  distanceSpace: '配送距离',
  updateId: '修改人ID',
  deleted: '是否删除',
  path: '路径',
  type: '类型',
  miniUserId: '用户 ID',
  ename: '英文名称',
  logo: 'LOGO',
  desc: '描述',
  qrcode: '二维码路径',

  shop: '店铺',
  address: '地址',
  area: '省',
  city: '市',
  full_address: '详细地址',

  contacts: '联系人',
  phone: '手机号',
  notice: '提示',
};

export const getFormLabel = (label) => {
  return formLabel[label] || label;
};

export const formLabel = {
  backgroundColor: '背景颜色',
  color: '字体颜色',
  icon: '图标',

  tabList: '标签列表',
  title: '标题',
  value: '数值',
  url: '跳转路径',

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

  dilivery_start_price: '起送时间',
  dilivery_price: '配送费用',
  distanceTime: '距离耗时',

  defaultValue: '默认值',

  total_sale: '总销售',
  goods: '商品',
  price: '价格',
  original_price: '原价',

  margin: '外变局',
  padding: '内边距',
  borderRadius: '圆角',
  locationImage: '定位图片',
  summary: '简介',
  orderPrice: '订单价格',
  num: '个数',
  selected: '是否选中',
};

export const getFormLabel = (label) => {
  return formLabel[label] || label;
};

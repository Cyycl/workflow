'use strict';

const { OperationNode } = require('../../../index');
const rq = require('request-promise-native');

async function handler(ctx) {
  const res = await rq({
    uri: 'http://rap2api.taobao.org/app/mock/7782/GET/getBrands',
    json: true,
  });
  const data = res.data;
  ctx.brandList = data;
}

const getBrandList = new OperationNode({
  name: 'getBrandList',
  description: '获取品牌列表',
  handler,
});

module.exports = getBrandList;

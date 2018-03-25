'use strict';

const { OperationNode } = require('../../../index');
const rq = require('request-promise-native');

async function handler(ctx) {
  const res = await rq({
    uri: 'http://rap2api.taobao.org/app/mock/7782/GET/getGroups',
    json: true,
  });
  const data = res.data;
  ctx.smartList = data;
}

const getSmartList = new OperationNode({
  name: 'getSmartList',
  description: '获取品牌商列表',
  handler,
});

module.exports = getSmartList;

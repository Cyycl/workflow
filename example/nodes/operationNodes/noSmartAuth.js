'use strict';
const { OperationNode } = require('../../../index');

function handler(ctx) {
  ctx.body = `没有品牌商权限, ${this.flowTrace}`;
}

const noSmartAuth = new OperationNode({
  name: 'noSmartAuth',
  description: '没有品牌商权限',
  handler,
});

module.exports = noSmartAuth;

'use strict';
const { OperationNode } = require('../../../index');

function handler(ctx) {
  ctx.body = `没有品牌权限, ${this.flowTrace}`;
}

const noBrandAuth = new OperationNode({
  name: 'noBrandAuth',
  description: '没有品牌权限',
  handler,
});

module.exports = noBrandAuth;

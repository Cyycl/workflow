'use strict';

const { OperationNode } = require('../../../index');

function handler(ctx) {
  ctx.body = `进入首页, ${this.flowTrace}`;
}

const goToIndexPage = new OperationNode({
  name: 'goToIndexPage',
  description: '进入首页',
  handler,
});

module.exports = goToIndexPage;

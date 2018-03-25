'use strict';

const { OperationNode } = require('../../../index');

function handler(ctx) {
  ctx.body = `前往登陆页, ${this.flowTrace}`;
}

const goToLogin = new OperationNode({
  name: 'goToLogin',
  description: '进入登陆页面',
  handler,
});

module.exports = goToLogin;

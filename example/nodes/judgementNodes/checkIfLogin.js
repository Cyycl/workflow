'use strict';

const { JudgementNode } = require('../../../index');

function handler(ctx) {
  // throw new Error('checkIfLogin error');
  if (ctx.isLogin) return true;
  return false;
}

const checkIfLogin = new JudgementNode({
  name: 'checkIfLogin',
  description: '是否登陆',
  handler,
});

module.exports = checkIfLogin;

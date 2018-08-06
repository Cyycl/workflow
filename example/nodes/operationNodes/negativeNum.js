'use strict';
const { OperationNode } = require('../../../index');

const negativeNum = new OperationNode({
  name: 'negativeNum',
  description: '是负数',
  handler: async ctx => {
    ctx.body = '是负数';
  },
});

module.exports = negativeNum;

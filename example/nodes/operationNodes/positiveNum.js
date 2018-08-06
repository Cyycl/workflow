'use strict';
const { OperationNode } = require('../../../index');

const positiveNum = new OperationNode({
  name: 'positiveNum',
  description: '是正数',
  handler: async ctx => {
    ctx.body = '是正数';
  },
});

module.exports = positiveNum;

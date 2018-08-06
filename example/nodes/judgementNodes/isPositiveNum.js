'use strict';

const { JudgementNode } = require('../../../index');

// 判断节点。handler返回结果为true时，其下游节点是节点关系中yes对应的节点，否则是no对应的节点
const isPositiveNum = new JudgementNode({
  name: 'isPositiveNum',
  description: '判断是否是正数',
  handler: async ctx => {
    return ctx.num > 0;
  },
});

module.exports = isPositiveNum;

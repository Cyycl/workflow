'use strict';

const { JudgementNode } = require('../../../index');

function handler(ctx) {
  const smartId = ctx.smartId;
  const isValid = ctx.smartList.some(smart => {
    return smart.smartId === smartId;
  });
  return isValid;
}

const checkSmartId = new JudgementNode({
  name: 'checkSmartId',
  description: '品牌商Id是否合法',
  handler,
});

module.exports = checkSmartId;

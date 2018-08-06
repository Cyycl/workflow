'use strict';

const { OperationNode } = require('../../../index');

function sleep(time) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, time || 100);
  });
}
async function getNum(ctx) {
  await sleep(200);
  ctx.num = -1;
}
// 定义了一个异步操作节点
const asyncGetNum = new OperationNode({
  name: 'asyncGetNum',
  description: '异步获取数字',
  handler: getNum,
});

module.exports = asyncGetNum;

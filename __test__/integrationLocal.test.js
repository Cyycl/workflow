'use strict';

const {
  JudgementNode,
  OperationNode,
  workFlowFactory,
} = require('../index');


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

// 普通判断节点。handler返回结果为true时，其下游节点是节点关系中yes对应的节点，否则是no对应的节点
const isPositiveNum = new JudgementNode({
  name: 'isPositiveNum',
  description: '判断是否是正数',
  handler: async ctx => {
    return ctx.num > 0;
  },
});

const positiveNum = new OperationNode({
  name: 'positiveNum',
  description: '是正数',
  handler: async ctx => {
    ctx.result = '正数';
  },
});

const negativeNum = new OperationNode({
  name: 'negativeNum',
  description: '是负数',
  handler: async ctx => {
    ctx.result = '负数';
  },
});

const Wf = workFlowFactory({
  startNode: asyncGetNum,
  judgementNodes: [{
    node: isPositiveNum,
    yes: positiveNum,
    no: negativeNum,
  }],
  operationNodes: [{
    node: asyncGetNum,
    next: isPositiveNum,
  },
  {
    node: positiveNum,
    next: null,
  },
  {
    node: negativeNum,
    next: null,
  },
  ],
});

test('local integration test', async () => {
  const oWf = new Wf(); // 生成工作流对象
  const ctx = {};
  await oWf.run(ctx); // 运行工作流对象
  expect(ctx.result).toEqual('负数');
  expect(oWf.flowTrace).toEqual('异步获取数字 -> 判断是否是正数 -> 是负数');
});

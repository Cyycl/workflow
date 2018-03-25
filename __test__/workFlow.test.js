// The Test For src/WorkFlow.js
'use strict';
const {
  JudgementNode,
  OperationNode,
  workFlowFactory,
} = require('../index');

const yesNode = new OperationNode({
  name: 'yesNode',
  description: 'yes节点',
  handler: ctx => {
    ctx.passNodeList.push('yes');
    return 'yes';
  },
});
const noNode = new OperationNode({
  name: 'noNode',
  description: 'no节点',
  handler: ctx => {
    ctx.passNodeList.push('no');
    return 'no';
  },
});

/**
 *  --- start
 *  测试节点抛出错误，能成功捕获错误信息
 */
// 抛出错误的判断节点
const errJudgementNodeHandler = async () => {
  throw new Error('judgement node throw error');
};
const errJudgementNode = new JudgementNode({
  name: 'errJudgementNode',
  description: '出错的判断节点',
  handler: errJudgementNodeHandler,
});
// 抛出错误的普通节点
const errOperationNodeHandler = async () => {
  throw new Error('operation node throw error');
};
const errOperationNode = new OperationNode({
  name: 'errOperationNode',
  description: '出错的普通节点',
  handler: errOperationNodeHandler,
});

// 包含抛出错误的判断节点的工作流
const Wf1ForErr = workFlowFactory({
  startNode: errJudgementNode,
  operationNodes: [
    {
      node: yesNode,
      next: null,
    },
    {
      node: noNode,
      next: null,
    },
  ],
  judgementNodes: [{
    node: errJudgementNode,
    yes: yesNode, // 因为叶子节点只能是普通节点，判断节点的yes和no节点不能为null
    no: noNode,
  }],
});
// 包含抛出错误的普通节点的工作流
const Wf2ForErr = workFlowFactory({
  startNode: errOperationNode,
  operationNodes: [
    {
      node: errOperationNode,
      next: null,
    },
  ],
});

describe('node occur error', () => {
  it('judgement node occur error', async () => {
    const oWf1 = new Wf1ForErr();
    try {
      await oWf1.run();
    } catch (error) {
      expect(error.message).toContain('judgement node throw error');
    }
  });
  it('operation node occur error', async () => {
    const oWf2 = new Wf2ForErr();
    try {
      await oWf2.run();
    } catch (error) {
      expect(error.message).toContain('operation node throw error');
    }
  });
});
/**
 *  --- end
 */

/**
 *  --- start
 *  测试节点正常运行
 */
const yesJudgementNode = new JudgementNode({
  name: 'successJudgementNode',
  description: 'Yes的判断节点',
  handler: async ctx => {
    return new Promise(resolve => {
      setTimeout(() => {
        ctx.passNodeList.push('yes judgement'); // ctx是工作流对象的全局上下文
        resolve(true);
      }, 200);
    });
  },
});

const noJudgementNode = new JudgementNode({
  name: 'successJudgementNode',
  description: 'no的判断节点',
  handler: ctx => {
    ctx.passNodeList.push('no judgement');
    return false;
  },
});

const successOperationNode = new OperationNode({
  name: 'successOperationNode',
  description: '操作节点',
  handler: async ctx => {
    return new Promise(resolve => { // 模拟异步
      setTimeout(() => {
        ctx.passNodeList.push('operation');
        resolve();
      }, 200);
    });
  },
});

const WfForSuccess = workFlowFactory({
  startNode: successOperationNode,
  judgementNodes: [
    {
      node: yesJudgementNode,
      yes: noJudgementNode,
      no: noNode,
    },
    {
      node: noJudgementNode,
      yes: yesNode,
      no: noNode,
    },
  ],
  operationNodes: [
    {
      node: successOperationNode,
      next: yesJudgementNode,
    },
    {
      node: yesNode,
      next: null,
    },
    {
      node: noNode,
      next: null,
    },
  ],
});

describe('nodes run successfully', () => {
  it('success case', async () => {
    const oWf = new WfForSuccess();
    const ctx = {
      passNodeList: [],
    };
    await oWf.run(ctx);
    expect(oWf.flowTrace).toEqual('操作节点 -> no的判断节点 -> no节点');
    expect(ctx.passNodeList).toEqual(expect.arrayContaining([ 'operation', 'no judgement', 'no' ]));
  });
});
/**
 *  --- end
 */

/**
 *  --- start
 *  节点关系配置不对，报错
 */
describe('config error', () => {
  it('missing node', () => {
    try {
      // 配置中出现了noNode节点，但是没有在operationNodes中配置noNode节点
      workFlowFactory({
        startNode: successOperationNode,
        judgementNodes: [
          {
            node: yesJudgementNode,
            yes: noJudgementNode,
            no: noNode,
          },
          {
            node: noJudgementNode,
            yes: yesNode,
            no: noNode,
          },
        ],
        operationNodes: [
          {
            node: successOperationNode,
            next: yesJudgementNode,
          },
          {
            node: yesNode,
            next: null,
          },
        ],
      });
    } catch (error) {
      expect(error.message).toEqual('workFlowFactory() error: the nodes of noNode is not configured!');
    }
  });

  it('less configuration of judgementNode', () => {
    try {
      workFlowFactory({
        startNode: successOperationNode,
        judgementNodes: [
          {
            node: yesJudgementNode,
            yes: noJudgementNode,
            no: noNode,
          },
          {
            node: noJudgementNode,
            // yes: yesNode, // 少配置了yesNode
            no: noNode,
          },
        ],
        operationNodes: [
          {
            node: successOperationNode,
            next: yesJudgementNode,
          },
          {
            node: yesNode,
            next: null,
          },
        ],
      });
    } catch (error) {
      expect(error.message).toEqual('The successJudgementNode error: instance requires property "yes"');
    }
  });

  it('less configuration of operationNode', () => {
    try {
      workFlowFactory({
        startNode: successOperationNode,
        judgementNodes: [
          {
            node: yesJudgementNode,
            yes: noJudgementNode,
            no: noNode,
          },
          {
            node: noJudgementNode,
            yes: yesNode,
            no: noNode,
          },
        ],
        operationNodes: [
          {
            node: successOperationNode,
            // next: yesJudgementNode, // 缺少next属性
          },
          {
            node: yesNode,
            next: null,
          },
        ],
      });
    } catch (error) {
      expect(error.message).toEqual('The successOperationNode node is a operation node， but not define the next property!');
    }
  });
});
/**
 *  --- end
 */


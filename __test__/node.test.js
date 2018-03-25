const {
  JudgementNode,
  OperationNode,
  workFlowFactory,
} = require('../index');
const Node = require('../src/Node/Node');

// common properties include name， description, handler
test("node don't define common properties", () => {
  const nodeForIncorrectHandler = new OperationNode({
    name: 'nodeForIncorrectHandler',
    description: 'handler类型定义错误',
    handler: {},
  });
  try {
    workFlowFactory({
      startNode: nodeForIncorrectHandler,
      operationNodes: [{
        node: nodeForIncorrectHandler,
        next: null,
      }],
    });
  } catch (error) {
    expect(error.message).toEqual('The nodeForIncorrectHandler error: instance.handler does not conform to the "function" format');
  }
});

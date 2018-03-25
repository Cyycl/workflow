'use strict';
module.exports = {
  WorkFlow: require('./src/WorkFlow').WorkFlow,
  workFlowFactory: require('./src/WorkFlow').workFlowFactory,
  visualize: require('./src/visualize'),
  nodeType: require('./src/Node/nodeType'),
  OperationNode: require('./src/Node/OperationNode'),
  JudgementNode: require('./src/Node/JudgementNode'),
};

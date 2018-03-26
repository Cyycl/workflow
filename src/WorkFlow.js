'use strict';
const cons = require('./Node/nodeType');
const _ = require('lodash');

class WorkFlow {
  constructor({ startNodeName = '', nodes = [] } = {}) {
    this.startNodeName = startNodeName;
    this.flowTraceArr = []; // 工作流经过的节点
    this.nodeList = nodes;
    this.nodes = this._getNodeMap(nodes);
  }

  // set flowTrace(str) {
  //   throw new Error('flow Trace can not reset!');
  // }

  get flowTrace() {
    return this.flowTraceArr.join(' -> ');
  }

  _getNodeMap(nodeList) {
    const nodeMap = {};
    for (const node of nodeList) {
      nodeMap[node.name] = node;
    }
    return nodeMap;
  }

  _operationNodeDispatch(dispatch, nextNodeName) {
    return () => {
      nextNodeName && this.flowTraceArr.push(this.nodes[nextNodeName].description); // 不为null时记录
      return dispatch(nextNodeName);
    };
  }

  _judgementNodeDispatch(dispatch, yesNodeName, noNodeName) {
    return result => {
      let nextNodeName;
      if (result) {
        nextNodeName = yesNodeName;
      } else {
        nextNodeName = noNodeName;
      }
      this.flowTraceArr.push(this.nodes[nextNodeName].description);
      return dispatch(nextNodeName);
    };
  }

  async _runHandler(handler, ctx, node) {
    let msg;
    try {
      return await handler.call(this, ctx);
    } catch (err) {
      msg = `The ${node.name}(${node.description}) occurs error,
      flow trace is ${this.flowTrace},
      ${err.message}`;
      err.message = msg;
      throw err;
    }
  }

  run(ctx) {
    const _this = this;
    this.flowTraceArr.push(this.nodes[this.startNodeName].description);
    return dispatch(this.startNodeName);
    function dispatch(nodeName) {
      if (nodeName === null) {
        return Promise.resolve();
      }
      const node = _this.nodes[nodeName];
      const nodeType = node.type;
      const handler = node.handler;
      // 普通节点
      if (nodeType === cons.operationNodeType) {
        const nextNodeName = node.next;
        return Promise.resolve(_this._runHandler(handler, ctx, node)).then(_this._operationNodeDispatch(dispatch, nextNodeName).bind(_this));
      }
      // 判断节点
      if (nodeType === cons.judgementNodeType) {
        const yesNodeName = node.yes;
        const noNodeName = node.no;
        return Promise.resolve(_this._runHandler(handler, ctx, node)).then(_this._judgementNodeDispatch(dispatch, yesNodeName, noNodeName));
      }
    }
  }
}

function configureNextNode(obj = {}) {
  const node = Object.create(obj.node); // 避免副作用
  const nextNodeConfig = _.omit(obj, 'node');
  node.addNextNode(nextNodeConfig);
  return node;
}

function getAllNodeNameInANode(node) {
  const nameList = [];
  node.name && nameList.push(node.name);
  node.next && nameList.push(node.next);
  node.yes && nameList.push(node.yes);
  node.no && nameList.push(node.no);
  return nameList;
}

function checkIfAllNodeDefine(nameListOfAllNode, nameListOfDefineNode) {
  let result = true;
  const nameListOfNotDefineNode = [];
  if (nameListOfAllNode.length > nameListOfDefineNode.length) {
    result = false;
  }
  if (!result) {
    for (const name of nameListOfAllNode) {
      if (!nameListOfDefineNode.includes(name)) {
        nameListOfNotDefineNode.push(name);
      }
    }
  }
  return {
    result,
    list: nameListOfNotDefineNode,
  };
}

function workFlowFactory({ startNode, operationNodes = [], judgementNodes = [] } = {}) {
  const startNodeName = startNode && startNode.name;
  // config中定义的节点
  const configNodes = [ ...operationNodes, ...judgementNodes ];
  // config中定义的所有节点的名称
  let nameListOfDefinedNodes = [];
  // config中出现的所有节点的名称列表
  let nameListOfallNodes = [ startNodeName ];
  const nodes = [];
  let node;
  for (const configNode of configNodes) {
    node = configureNextNode(configNode); // 添加下一步节点
    node.checkNodeProperties(); // 检测节点属性和类型, 节点的属性检测全部在这收口
    nameListOfDefinedNodes.push(node.name);
    nameListOfallNodes = [ ...nameListOfallNodes, ...getAllNodeNameInANode(node) ];
    nodes.push(node);
  }
  nameListOfallNodes = Array.from(new Set(nameListOfallNodes)); // 去重
  nameListOfDefinedNodes = Array.from(new Set(nameListOfDefinedNodes));
  // 检测是否有出现在配置中的节点没有定义过
  const checkResult = checkIfAllNodeDefine(nameListOfallNodes, nameListOfDefinedNodes);
  if (!checkResult.result) throw new Error(`workFlowFactory() error: the nodes of ${checkResult.list.toString()} is not configured!`);

  function workFlowInstanceGenerator() {
    return new WorkFlow({ startNodeName, nodes });
  }
  workFlowInstanceGenerator.config = nodes;
  return workFlowInstanceGenerator;
}

module.exports = {
  WorkFlow,
  workFlowFactory,
};


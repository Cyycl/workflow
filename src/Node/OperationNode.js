'use strict';
const Node = require('./Node');
const cons = require('./nodeType');
const operationNodeSchema = {
  id: 'operationNodeSchema',
  type: 'object',
  properties: {
    next: {
      type: [ 'string', 'null' ],
    },
  },
  required: [ 'next' ],
};

module.exports = class OperationNode extends Node {
  constructor({ name, description, handler } = {}) {
    super();
    this.name = name;
    this.description = description;
    this.type = cons.operationNodeType;
    this.instanceNodeSchema = operationNodeSchema;
    this.handler = handler;
  }

  addNextNode({ next } = {}) {
    if (next === undefined) {
      throw new Error(`The ${this.name} node is a operation node， but not define the next property!`);
    }
    // null表示结束
    if (next === null) {
      this.next = next;
      return;
    }
    this.next = next.name;
  }

  /**
   * @param {Object} node 表示本节点，其中next表示下游节点名称
   * @return {String | null} 下一个节点名称，如果为null，表示该节点为叶子节点
   */
  goToNextNode(node) {
    return node.next;
  }
};

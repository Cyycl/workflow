'use strict';
const Node = require('./Node');
const cons = require('./nodeType');
const judgementNodeSchema = {
  id: 'judgementNodeSchema',
  type: 'object',
  properties: {
    yes: {
      type: 'string',
    },
    no: {
      type: 'string',
    },
  },
  required: [ 'yes', 'no' ],
};

module.exports = class JudgementNode extends Node {
  constructor({ name, description, handler } = {}) {
    super();
    this.name = name;
    this.description = description;
    this.type = cons.judgementNodeType;
    this.instanceNodeSchema = judgementNodeSchema;
    this.handler = handler;
  }

  addNextNode({ yes, no } = {}) {
    this.yes = yes && yes.name;
    this.no = no && no.name;
  }

  /**
   * @param {Object} node 表示本节点，其中yes表示result为true的下游节点名称，no相反
   * @param {Boolean} result handler返回的结果
   * @return {String} 返回现一个节点的名称
   */
  goToNextNode(node, result) {
    if (result) {
      return node.yes;
    }
    return node.no;
  }
};

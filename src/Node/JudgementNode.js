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
};

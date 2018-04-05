'use strict';
const Validator = require('../utils/validate');
const WorkFlowError = require('../Error/WorkFlowError');
const v = new Validator();
const commonNodeSchema = {
  id: 'nodeSchema',
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
    type: {
      format: 'symbol', // 自定义
    },
    handler: {
      format: 'function',
    },
  },
  required: [ 'name', 'type', 'description', 'handler' ],
};

module.exports = class Node {
  constructor() {
    this.commonValidationMap = commonNodeSchema;
  }

  // 根据jsonschema定义的校验规则进行属性类型校验，暴露给外部的workFlowFactory使用
  checkNodeProperties() {
    const commonNodeSchema = this.commonValidationMap || {};
    const instanceNodeSchema = this.instanceNodeSchema || {};
    // public validation
    const commonValidationResult = v.validate(this, commonNodeSchema);
    if (!commonValidationResult.valid) {
      throw new WorkFlowError(`${commonValidationResult.errors[0].stack}`, this);
    }
    // instance validation
    const instanceValidationResult = v.validate(this, instanceNodeSchema);
    if (!instanceValidationResult.valid) {
      throw new WorkFlowError(`${instanceValidationResult.errors[0].stack}`, this);
    }
  }

  // 为了实现多态，addNextNode 和 goToNextNode 相当于两个抽象方法，子类必须要实现
  // 注释掉是因为现在只需要普通节点和判断节点这两个节点类就可以支持比较复杂的流程定义，暂时不需要扩展其他节点类，也就懒得写测试用例覆盖这块了
  // addNextNode() {
  //   throw new Error('subclass of Node must implement the addNextNode method');
  // }

  // goToNextNode() {
  //   throw new Error('subclass of Node must implement the goToNextNode method');
  // }
};

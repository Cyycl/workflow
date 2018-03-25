'use strict';
/* istanbul ignore next */
const BasicError = require('./BasicError');
class WorkFlowError extends BasicError {
  constructor(msg, node) {
    super();
    let errMsg = msg;
    if (node && typeof node === 'object') {
      errMsg = `The ${node.name || node.description} error: ${msg}`;
    }
    this.message = errMsg;
    this.name = 'WorkFlowError';
  }
}

module.exports = WorkFlowError;


'use strict';
/* istanbul ignore next */
class BasicError extends Error {
  constructor(msg) {
    super(msg);
    // Error.captureStackTrace(this, this.constructor); // 返回调用堆栈信息，因此在自定义Error类的内部经常会使用该函数，用以在error对象上添加合理的stack属性
    this.message = msg || 'Error';
    this.name = 'Basic Error';
  }
}

module.exports = BasicError;

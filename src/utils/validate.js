'use strict';

const Validator = require('jsonschema').Validator;
// 自定义
Validator.prototype.customFormats.function = function(input) {
  return typeof input === 'function';
};
Validator.prototype.customFormats.symbol = function(input) {
  return typeof input === 'symbol';
};
module.exports = Validator;

'use strict';

const {
  checkIfLogin,
  checkSmartId,
  checkBrandId,
  isPositiveNum,
} = require('./nodes/judgementNodes');
const {
  getSmartList,
  goToIndexPage,
  goToLogin,
  noSmartAuth,
  getBrandList,
  noBrandAuth,
  asyncGetNum,
  negativeNum,
  positiveNum,
} = require('./nodes/operationNodes');
const { workFlowFactory } = require('../index');

const ComplexWF = workFlowFactory({
  startNode: checkIfLogin,
  operationNodes: [
    { node: getSmartList, next: checkSmartId },
    { node: goToIndexPage, next: null },
    { node: goToLogin, next: null },
    { node: noSmartAuth, next: null },
    { node: noBrandAuth, next: null },
    { node: getBrandList, next: checkBrandId },
  ],
  judgementNodes: [
    { node: checkIfLogin, yes: getSmartList, no: goToLogin },
    { node: checkSmartId, yes: getBrandList, no: noSmartAuth },
    { node: checkBrandId, yes: goToIndexPage, no: noBrandAuth },
  ],
});

const SimpleWF = workFlowFactory({
  startNode: asyncGetNum,
  judgementNodes: [
    {
      node: isPositiveNum,
      yes: positiveNum,
      no: negativeNum,
    },
  ],
  operationNodes: [
    {
      node: asyncGetNum,
      next: isPositiveNum,
    },
    {
      node: positiveNum,
      next: null,
    },
    {
      node: negativeNum,
      next: null,
    },
  ],
});

module.exports = {
  ComplexWF,
  SimpleWF,
};

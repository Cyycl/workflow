'use strict';

const {
  checkIfLogin,
  checkSmartId,
  checkBrandId,
} = require('./nodes/judgementNodes');
const {
  getSmartList,
  goToIndexPage,
  goToLogin,
  noSmartAuth,
  getBrandList,
  noBrandAuth,
} = require('./nodes/operationNodes');
const { workFlowFactory } = require('../index');

const WF = workFlowFactory({
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

module.exports = WF;

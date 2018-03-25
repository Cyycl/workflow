'use strict';

const { JudgementNode } = require('../../../index');

function handler(ctx) {
  const brandId = ctx.brandId;
  const isValid = ctx.brandList.some(brand => {
    return brand.brandId === brandId;
  });
  return isValid;
}

const checkBrandId = new JudgementNode({
  name: 'checkBrandId',
  description: '品牌Id是否合法',
  handler,
});
module.exports = checkBrandId;

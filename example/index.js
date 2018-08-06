'use strict';
const Koa = require('koa');
const Router = require('koa-router');
const {
  ComplexWF: WF,
  SimpleWF,
} = require('./config');
const { visualize } = require('../index');

const app = module.exports = new Koa();
const router = new Router();

// 判断是否是正数
router.get('/simple/visualize', async ctx => {
  const vizGraphStr = visualize(SimpleWF.config); // 流程图，流程图在线生成网站：https://dreampuf.github.io/GraphvizOnline/
  ctx.body = vizGraphStr;
});
router.get('/simple', async ctx => {
  try {
    const oWf = new SimpleWF();
    await oWf.run(ctx);
  } catch (error) {
    console.log(error);
  }
});

// 流程可视化
router.get('/visualize', async ctx => {
  const vizGraphStr = visualize(WF.config);
  ctx.body = vizGraphStr;
});
// 没有登录
router.get('/login', async ctx => {
  try {
    ctx.isLogin = false;
    const oWf = new WF();
    await oWf.run(ctx);
  } catch (error) {
    console.log('error of not login', error);
  }
});
router.get('/notGroupAuth', async ctx => {
  try {
    ctx.isLogin = true;
    ctx.smartId = 555; // 正确的是：5556
    ctx.brandId = 4444;
    const oWf = new WF();
    await oWf.run(ctx);
  } catch (error) {
    console.log('workFlow error: ', error);
  }
});
router.get('/notBrandAuth', async ctx => {
  try {
    ctx.isLogin = true;
    ctx.smartId = 5556;
    ctx.brandId = 444; // 正确的是：44444
    const oWf = new WF();
    await oWf.run(ctx);
  } catch (error) {
    console.log('workFlow error: ', error);
  }
});
router.get('/index', async ctx => {
  try {
    ctx.isLogin = true;
    ctx.smartId = 5556;
    ctx.brandId = 44444;
    const oWf = new WF();
    await oWf.run(ctx);
  } catch (error) {
    console.log('workFlow error: ', error);
  }
});
app
  .use(router.routes())
  .use(router.allowedMethods());
if (!module.parent) { // module.parent 指向的是第一个require这个模块的文件，没有为null。这里是为了防止在其他文件中加载了app(如测试文件)，并已经监听了3000端口，导致 listen EADDRINUSE :::3000错误
  app.listen(3000);
  console.log('server is listening on the port of 3000!');
}

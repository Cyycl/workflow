'use strict';
const request = require('supertest');
const app = require('../example/index');

describe('integration test', () => {
  let server;
  beforeAll(() => {
    server = app.listen(3000);
  });
  // 没有登录
  it('not login', done => {
    request(server)
      .get('/login')
      .set('Accept', 'text/plain')
      .end((err, res) => {
        expect(res.text).toBe('前往登陆页, 是否登陆 -> 进入登陆页面');
        done();
      });
  });
  // 没有品牌商权限
  it('no group auth', done => {
    request(server)
      .get('/notGroupAuth')
      .set('Accept', 'text/plain')
      .end((err, res) => {
        expect(res.text).toBe('没有品牌商权限, 是否登陆 -> 获取品牌商列表 -> 品牌商Id是否合法 -> 没有品牌商权限');
        done();
      });
  });
  // 没有品牌权限
  it('no brand auth', done => {
    request(server)
      .get('/notBrandAuth')
      .set('Accept', 'text/plain')
      .end((err, res) => {
        expect(res.text).toBe('没有品牌权限, 是否登陆 -> 获取品牌商列表 -> 品牌商Id是否合法 -> 获取品牌列表 -> 品牌Id是否合法 -> 没有品牌权限');
        done();
      });
  });
  // 通过所有校验
  it('pass all check', done => {
    request(server)
      .get('/index')
      .set('Accept', 'text/plain')
      .end((err, res) => {
        expect(res.text).toBe('进入首页, 是否登陆 -> 获取品牌商列表 -> 品牌商Id是否合法 -> 获取品牌列表 -> 品牌Id是否合法 -> 进入首页');
        done();
      });
  });
  afterAll(() => {
    server.close();
  });
});

1. 目录结构

    example
    ├── config.js 配置节点关系
    ├── index.js  入口文件
    ├── node 定义节点
        ├── operationNodes 普通节点
        |   └── ...
        ├── judgementNodes 判断节点
            └── ...

2. 流程说明

example 描述的流程如下图所示：



ps：上面流程图是根据http://127.0.0.1:3000/visualize 生成的字符串，在 https://dreampuf.github.io/GraphvizOnline/ 上画出来的

2.1 节点函数(nodes/*/.js)的说明

- judgementNode
  - checkIfLogin.js: 是否登录
  - scheckSmartId.js: 品牌商Id是否合法
  - checkBrandId.js: 品牌Id是否合法
- operationNodes
  - goToLogin.js: 进入登陆页(/login)
  - getSmartList.js: 获取品牌商列表
  - getBrandList.js: 获取品牌列表
  - noBrandAuth.js: 没有品牌权限(/notBrandAuth)
  - noSmartAuth.js: 没有品牌商权限(/notGroupAuth)
  - goToIndexPage: 进入首页(/index)

3.  启动说明

在项目根目录下，npm install  ->  npm run dev。

由于使用了内网的rap平台，请确保内网已连接

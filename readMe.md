# node-jigsaw

[![Build Status](https://travis-ci.org/Cyycl/workflow.svg?branch=master)](https://travis-ci.org/Cyycl/workflow)
[![codecov](https://codecov.io/gh/Cyycl/workflow/branch/master/graph/badge.svg)](https://codecov.io/gh/Cyycl/workflow)


`node-jigsaw`(节点拼图) 是一款轻量级的nodejs工作流引擎，并且可以根据配置产出工作流的流程图。
使用流程可以概括为： 定义节点 -> 配置节点关系 -> 生成工作流 -> 产出流程图。
详细栗子参考`example`文件夹下的例子


## 1. 实现的功能
- 节点可定义
  - 支持`普通操作节点`和`判断节点`的定义，来构造复杂的工作流。
- 节点关系可配置
  - 节点关系可配置，实现了节点的可复用。
- 流程可视化
  - 根据配置，产出流程图，帮助你清晰了解整个工作流脉络。
- 流程可追踪
	- 节点流转路径可追踪。帮助你快速定位一个流程所经过的节点。
	- 节点出错可追踪。某个节点操作出错，可以追踪到出错节点，节点流转路径，以及错误的堆栈信息，帮助你快速定位和解决错误。

## 2. 运行要求

- node：>= 8.9.0

## 3. 本地开发

``` js
  npm run dev
```

具体操作参考`example/readMe.md`


## 4. 使用说明

### 4.1 定义节点

```js
const {
  JudgementNode,
  OperationNode,
} = require('node-jigsaw');


function sleep(time) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time || 100);
  });
}
async function getNum(ctx) {
  await sleep(200);
  ctx.num = -1;
}
// 定义了一个异步操作节点
const asyncGetNum = new OperationNode({
  name: 'asyncGetNum',
  description: '异步获取数字',
  handler: getNum,
});

// 普通判断节点。handler返回结果为true时，其下游节点是节点关系中yes对应的节点，否则是no对应的节点
const isPositiveNum = new JudgementNode({
  name: 'isPositiveNum',
  description: '判断是否是正数',
  handler: async ctx => {
    return ctx.num > 0;
  }
});

const positiveNum = new OperationNode({
  name: 'positiveNum',
  description: '是正数',
  handler: async ctx => {
    console.log('正数');
  }
});
const negativeNum = new OperationNode({
  name: 'negativeNum',
  description: '是负数',
  handler: async ctx => {
    console.log('负数');
  }
});
```

## 4.2 配置节点关系

注意： 

- `普通操作节点`只有一个下游节点，由节点关系中`next`定义。
- 工作流的叶子节点只能是`普通操作节点`, 当其`next` 为`null`时，表示该节点是叶子节点。
- `判断节点`中handler属性函数返回结果为`true`时，其下游节点是节点关系中`yes`指向的节点，否则是`no`指向的节点
- `判断节点`的`yes`和`no`不能为空，指向的必须是`普通操作节点`或`判断节点`。这是因为`判断节点`不可能是叶子节点，也就是说它必然有下游节点。

```js
const {
  workFlowFactory,
} = require('node-jigsaw');

const Wf = workFlowFactory({
  startNode: asyncGetNum,
  judgementNodes: [
    {
      node: isPositiveNum,
      yes: positiveNum,
      no: negativeNum,
    }
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
    }
  ],
});
```

## 4.3 生成工作流

```js
async function run() {
  const oWf = new Wf(); // 生成工作流对象
  const ctx = {};
  await oWf.run(ctx);  // 运行工作流
  console.log('**trace**');
  console.log(oWf.flowTrace); // 异步获取数字 -> 判断是否是正数 -> 是负数
}

run();
```

## 4.4 生成流程图

```js
const {
  visualize,
} = require('node-jigsaw');

const graphStr = visualize(Wf.config)
```

图表字符串`graphStr`为：

```
digraph "fsm" {
  "异步获取数字";
  "是正数";
  "是负数";
  "判断是否是正数";

  "异步获取数字" -> "判断是否是正数"[label = ""];
  "判断是否是正数" -> "是正数"[label = "yes"];
  "判断是否是正数" -> "是负数"[label = "no"];
}
```

将`graphStr`粘贴到 https://dreampuf.github.io/GraphvizOnline/ 上，可以生成对应的流程图，如下：

![](https://img.alicdn.com/tfs/TB1Wb.1f.R1BeNjy0FmXXb0wVXa-278-305.png)

## 5. TODO
- 流程图的美化


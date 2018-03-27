# node-jigsaw

[![Build Status](https://travis-ci.org/Cyycl/workflow.svg?branch=master)](https://travis-ci.org/Cyycl/workflow)
[![codecov](https://codecov.io/gh/Cyycl/workflow/branch/master/graph/badge.svg)](https://codecov.io/gh/Cyycl/workflow)


`node-jigsaw`(节点拼图) 是一款轻量级的nodejs工作流引擎，并且可以根据配置产出工作流的流程图。

使用流程可以概括为：定义节点 -> 配置节点关系 -> 使用工作流 -> 产出流程图。

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
`node-jigsaw` 提供了普通操作节点类`OperationNode ` 和 判断节点类`JudgementNode `。

这两种类都需要`name`, `description ` 和 `handler `三种初始化属性。其中：

- `name` \<String\>: 用于唯一标识该节点， 必选。
- `description` \<String\> : 用于描述该节点，必选。
- `handler` \<Function\>: 用于定义该节点的处理逻辑，必选。 注意：
	- 在`JudgementNode `类型的对象中`handler`方法必须返回`true`或`false`, 供工作流引擎查找下一个节点。 
	- `handler`函数有一个`ctx`的形参，是使用者在启动工作流时，传递给工作流对象的，详见 4.3 。其类似于`koa`的全局上下文，用于节点间数据的传递。

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

// 判断节点。handler返回结果为true时，其下游节点是节点关系中yes对应的节点，否则是no对应的节点
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

### 4.2 配置节点关系

 `workFlowFactory`是一个工厂函数，通过指定的配置，生成一个工作流类。

 配置的三种属性：
 
 - `startNode` \<OperationNode\> | \<JudgementNode\>: 工作流的开始节点，必选。
 - `judgementNodes`：定义工作流中出现的判断节点的关系，可选。 其中：
 
 	- `node` \<JudgementNode\>: 判断节点对象
 	- `yes` \<OperationNode\> | \<JudgementNode\>: 判断节点对象的`handler`函数返回值为`true`时，所指向的下一级节点
 	- `no` \<OperationNode\> | \<JudgementNode\>: 判断节点对象的`handler`函数返回值为`false`时，所指向的下一级节点

-  `operationNodes`: 定义工作流中出现的普通节点的关系，必选(因为工作流的叶子结点必须是普通节点)。其中：
	
	- `node` \<OperationNode\>: 普通结点对象
	- `next` \<OperationNode\> | \<JudgementNode\> | null: 用于定于普通结点的下一级节点，其中值为`null`时，表示该节点为工作流的叶子节点


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

### 4.3 使用工作流

要使用定义好的工作流，必须要先使用`4.2`中产生的特定的工作流类`WF`来生成工作流对象。 使用工作流对象时，需要注意三点：

- 需要传递一个全局上下文对象`ctx`给工作流对象，供节点间通信使用。
- 如果包含异步处理，请务必使用`await oWf.run(ctx)`方式启动工作流。
- 工作流对象`oWf`中的	`flowTrace`属性，可以表示出此流程所流经的节点顺序。

```js
async function run() {
  const oWf = new Wf(); // 生成工作流对象
  const ctx = {};
  await oWf.run(ctx);  // 运行工作流
  console.log('**trace**');
  console.log(oWf.flowTrace); // 此次流程流经的节点的顺序：异步获取数字 -> 判断是否是正数 -> 是负数
}

run();
```

### 4.4 生成流程图

`4.2` 中产生的工作流类中有一个静态属性`config`，它的值为该工作流的节点关系配置，通过 `visualize `可以生成`vizGraph`字符串，可以通过该字符串生成对应的 状态流程图。

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
- 自动生成流程图和流程图的美化


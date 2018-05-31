'use strict';
const {
  operationNodeType,
  judgementNodeType,
} = require('./Node/nodeType');

let nodeMap;
const shapeMap = {
  [judgementNodeType]: 'diamond',
  [operationNodeType]: 'box',
};
const colorMap = {
  [judgementNodeType]: 'lightgrey',
  [operationNodeType]: '',
};
const style = {
  [judgementNodeType]: 'filled',
  [operationNodeType]: '',
};
function getGraphNode(node = {}) {
  return {
    name: node.name,
    description: node.description,
    shape: shapeMap[node.type],
    color: colorMap[node.type],
    style: style[node.type],
  };
}

function getGraphLine(node) {
  const from = node.name;
  if (node.next) {
    return [
      {
        from,
        to: nodeMap[node.next].name,
        label: '',
      },
    ];
  }
  // 判断节点
  if (node.yes) {
    return [
      {
        from,
        to: nodeMap[node.yes].name,
        label: 'yes',
      },
      {
        from,
        to: nodeMap[node.no].name,
        label: 'no',
      },
    ];
  }
}

function getNodeMap(nodeList) {
  const nodeMap = {};
  for (const node of nodeList) {
    nodeMap[node.name] = node;
  }
  return nodeMap;
}

function formatIntoVizFormat(graphNodeList, graphLineList) {
  let nodeStr = '';
  let lineStr = '';
  for (const node of graphNodeList) {
    nodeStr += `"${node.name}"[label="${node.description}" shape="${node.shape}" color="${node.color}" style="${node.style}"];
    `; // 换行
  }
  for (const line of graphLineList) {
    lineStr += `"${line.from}" -> "${line.to}" [ label = "${line.label}"];
    `; // 换行
  }

  return `digraph "fsm" {
    ${nodeStr}
    ${lineStr}

  }`;
}

function visualize(nodeList) {
  nodeMap = getNodeMap(nodeList);
  const graphNodeList = [];
  const graphLineList = [];
  Object.keys(nodeMap).forEach(nodeName => {
    const node = nodeMap[nodeName];
    const graphNode = getGraphNode(node);
    const graphLine = getGraphLine(node);
    graphNode && graphNodeList.push(graphNode);
    graphLine && graphLineList.push(...graphLine);
  });
  const vizGraphStr = formatIntoVizFormat(graphNodeList, graphLineList);
  return vizGraphStr;
}


module.exports = visualize;

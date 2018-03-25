'use strict';
let nodeMap;

function getGraphNode(node) {
  return node && node.description;
}

function getGraphLine(node) {
  const from = node.description;
  if (node.next) {
    return [
      {
        from,
        to: nodeMap[node.next].description,
        label: '',
      },
    ];
  }
  // 判断节点
  if (node.yes) {
    return [
      {
        from,
        to: nodeMap[node.yes].description,
        label: 'yes',
      },
      {
        from,
        to: nodeMap[node.no].description,
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
    nodeStr += `"${node}";
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

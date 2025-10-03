export type Node__v2 = Omit<Node, "fromSchema">

export function isNodeV2(node: any): node is Node__v2 {
  return node.fromSchema === undefined
}

import { ComponentToExport, JSONTreeNode } from "../../../types"

/**
 * JSX Node types for structured JSX representation
 */
export type JSXNodeType = "component" | "frame" | "conditional"

/**
 * JSX Node structure representing a single node in the JSX tree
 */
export type JSXNode = {
  type: JSXNodeType
  name: string
  path: string
  propVarName: string // e.g., "buttonIconic2Props"
  propKeyName?: string // e.g., "buttonIconic2" (for interface prop keys)
  children?: JSXNode[]
  condition?: string // For conditional rendering (prop name that controls visibility)
  className?: string
  grandchildProps?: Array<{
    propKey: string
    propVarName: string
  }> // For grandchildren passed as props
}

/**
 * JSX Structure containing the root node and extracted prop maps
 */
export type JSXStructure = {
  root: JSXNode
  propValuesMap: Map<string, string>
  propKeysMap: Map<string, string>
}

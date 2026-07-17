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
  ref?: string // Node reference handle, emitted as data-seldon-ref
  grandchildProps?: Array<{
    propKeyName: string // child component's slot name, e.g. "icon"
    propVarName: string // parent's variable name, e.g. "buttonIconicIconProps"
    // Present when the forwarded leaf is a conditional (inline-extra) prop. The
    // guard is the source prop name, so the attribute only renders when the
    // caller supplies it, e.g. `textLabel={textLabel && textLabelProps}`. Absent
    // for canonical leaves, which forward unconditionally.
    guard?: string
    // Present when the authored instance dropped this canonical slot. The
    // attribute forwards `null` so the embedded element suppresses its own
    // default child, e.g. `icon={null}`.
    nullLiteral?: boolean
  }> // For grandchildren passed as props
}

/**
 * JSX Structure containing the root node and the prop name map.
 *
 * `propNames` maps a node path to the parent component's prop name for that
 * node. It is the single name map consumed by the interface, signature,
 * declaration, and default-prop generators.
 */
export type JSXStructure = {
  root: JSXNode
  propNames: Map<string, string>
}

import { CSSProperties, createContext, useContext } from "react"

/**
 * React context for tracking the current indentation level in the tree.
 * Defaults to 0 at the root level.
 */
export const IndentationContext = createContext<number>(0)

/**
 * Provider component that increments the indentation context for nested children.
 * Wraps children and provides them with a context value of (current level + 1).
 *
 * @param children - React children to wrap with incremented indentation context
 */
export const IndentationContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const indentation = useIndentation()
  const nextLevel = indentation + 1

  return (
    <IndentationContext.Provider value={nextLevel}>
      {children}
    </IndentationContext.Provider>
  )
}

/**
 * Component that wraps children and applies indentation padding based on the current level.
 * Calculates padding for the next level (level N+1) that children will see, applies it
 * via a wrapper div, and provides incremented indentation context to nested children.
 *
 * @param children - React children (typically ProjectTreeRow components) to indent
 * @example
 * ```tsx
 * <IndentationLevel>
 *   <ProjectTreeRow type="node" data={variant} />
 * </IndentationLevel>
 * ```
 */
export const IndentationLevel = ({
  children,
}: {
  children: React.ReactNode
}) => {
  // Apply incremental padding using CSS token for padding tight
  // This adds padding-tight to the existing padding, not a cumulative total
  const indentationGap = 0
  // Apply only the additional padding for this level using the CSS token
  const indentationPadding =
    indentationGap === 0
      ? "var(--sdn-padding-cozy)"
      : `calc(var(--sdn-padding-cozy) + ${indentationGap}px)`

  const wrapperStyle: CSSProperties = {
    paddingLeft: indentationPadding,
    width: "100%",
    minWidth: 0,
  }

  return (
    <IndentationContextProvider>
      <div style={wrapperStyle}>{children}</div>
    </IndentationContextProvider>
  )
}

/**
 * Hook to get the current indentation level from the IndentationContext.
 * Returns 0 if no provider is found (root level).
 *
 * @returns The current indentation level (0-based)
 */
export const useIndentation = () => useContext(IndentationContext) ?? 0

"use client"

import { createContext, useCallback, useContext, useMemo, useState } from "react"

import type { ReactNode } from "react"

/**
 * A property rendered on its own as a card, rather than as a row in the inspector.
 *
 * The token card opens a single property away from the sidebar, so its disclosure state
 * is its own: opening a compound in the card must not open the same compound in the
 * sidebar, and vice versa. The scope holds that local state. Its presence also tells a
 * row it is in a card, so the card's child facets sit flush instead of indented like the
 * tree.
 */
interface PropertyCardScope {
  expanded: Record<string, boolean>
  toggle: (propertyKey: string, shouldExpand?: boolean) => void
}

const PropertyCardScopeContext = createContext<PropertyCardScope | null>(null)

/** The card scope for the current row, or `null` when it is an inspector row. */
export function usePropertyCardScope(): PropertyCardScope | null {
  return useContext(PropertyCardScopeContext)
}

/** Holds one card's disclosure state, so it opens compounds without touching the sidebar. */
export function PropertyCardScopeProvider({ children }: { children: ReactNode }) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const toggle = useCallback((propertyKey: string, shouldExpand?: boolean) => {
    setExpanded((current) => ({
      ...current,
      [propertyKey]: shouldExpand ?? !current[propertyKey],
    }))
  }, [])

  const scope = useMemo<PropertyCardScope>(() => ({ expanded, toggle }), [expanded, toggle])

  return (
    <PropertyCardScopeContext.Provider value={scope}>{children}</PropertyCardScopeContext.Provider>
  )
}

import { inject, provide, reactive } from "vue"

import type { InjectionKey } from "vue"

/**
 * A property rendered on its own as a card, rather than as a row in the inspector.
 *
 * The token card opens a single property away from the sidebar, so its disclosure
 * state is its own: opening a compound in the card must not open the same compound
 * in the sidebar, and vice versa. The scope holds that local state. Its presence
 * also tells a row it is in a card, so the card's child facets sit flush instead
 * of indented like the tree. Vue port of the React `PropertyCardScope` context.
 */
export interface PropertyCardScope {
  expanded: Record<string, boolean>
  toggle: (propertyKey: string, shouldExpand?: boolean) => void
}

const PropertyCardScopeKey: InjectionKey<PropertyCardScope> = Symbol("property-card-scope")

/** The card scope for the current row, or `null` when it is an inspector row. */
export function usePropertyCardScope(): PropertyCardScope | null {
  return inject(PropertyCardScopeKey, null)
}

/** Holds one card's disclosure state, so it opens compounds without touching the sidebar. */
export function providePropertyCardScope(): PropertyCardScope {
  const expanded = reactive<Record<string, boolean>>({})

  const scope: PropertyCardScope = {
    expanded,
    toggle(propertyKey, shouldExpand) {
      expanded[propertyKey] = shouldExpand ?? !expanded[propertyKey]
    },
  }

  provide(PropertyCardScopeKey, scope)

  return scope
}

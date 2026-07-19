import { inject, provide, type Ref } from "vue"

type Direction = 1 | -1

export interface PropertyEditRowEntry {
  el: Ref<HTMLElement | null>
  activate: () => void
  isNavigable: boolean
}

export interface PropertyEditNavigationApi {
  register: (key: string, entry: PropertyEditRowEntry) => void
  unregister: (key: string) => void
  /**
   * Moves edit focus from `currentKey` to the adjacent navigable row in DOM
   * order. Returns true when a target row was activated.
   */
  moveFocus: (currentKey: string, direction: Direction) => boolean
}

const PROPERTY_EDIT_NAVIGATION_KEY = Symbol("seldon-property-edit-navigation")

/**
 * Vue provide/inject port of the React property-edit navigation context. Only
 * the row being edited mounts an input, so native Tab cannot reach siblings.
 * Rows register their element and an activate callback; `moveFocus` orders the
 * registered rows by DOM position and enters edit mode on the adjacent one.
 */
export function providePropertyEditNavigation(): PropertyEditNavigationApi {
  const rows = new Map<string, PropertyEditRowEntry>()

  function register(key: string, entry: PropertyEditRowEntry): void {
    rows.set(key, entry)
  }

  function unregister(key: string): void {
    rows.delete(key)
  }

  function moveFocus(currentKey: string, direction: Direction): boolean {
    const ordered = Array.from(rows.entries())
      .filter(([, entry]) => entry.isNavigable && entry.el.value)
      .sort(([, a], [, b]) => {
        const aEl = a.el.value!
        const bEl = b.el.value!
        const position = aEl.compareDocumentPosition(bEl)
        return position & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
      })

    const index = ordered.findIndex(([key]) => key === currentKey)
    if (index === -1) return false
    const target = ordered[index + direction]
    if (!target) return false
    target[1].activate()
    return true
  }

  const api: PropertyEditNavigationApi = { register, unregister, moveFocus }
  provide(PROPERTY_EDIT_NAVIGATION_KEY, api)
  return api
}

export function usePropertyEditNavigation(): PropertyEditNavigationApi | null {
  return inject<PropertyEditNavigationApi | null>(
    PROPERTY_EDIT_NAVIGATION_KEY,
    null,
  )
}

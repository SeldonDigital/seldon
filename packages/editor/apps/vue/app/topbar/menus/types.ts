import type { AppState } from "@app/editor/use-app-state"

export type MenuItemId = string

/** A single actionable row in a topbar dropdown. */
export interface MenuItem {
  id: MenuItemId
  label: string
  action?: () => void
  shortcut?: string
  disabled?: boolean
  /**
   * When `false`, the item renders dimmed and is not selectable. Convenience
   * inverse of `disabled`; `disabled` takes precedence when both are set.
   */
  enabled?: boolean
  /** Used to determine if the item should be highlighted. */
  active?: boolean
  /** Marker shown when `active`. Defaults to a check; `"bullet"` for radio sets. */
  activeMarker?: "check" | "bullet"
  /** Theme icon id for the leading slot. */
  icon?: string
  /** Optional visibility control by app state. */
  visibleIn?: AppState[]
}

/** A dropdown menu in the topbar menu bar. */
export interface MenuDropdown {
  id: string
  label: string
  items: (MenuItem | "separator")[]
  /** Optional visibility control by app state. */
  visibleIn?: AppState[]
}

/** Configuration for the entire menu bar. */
export type MenuConfig = MenuDropdown[]

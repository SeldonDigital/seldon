/**
 * Types for the menu system
 */
import { AppState } from "@lib/hooks/use-app-state"

export type MenuItemId = string

/**
 * Represents a menu item in the menu bar system
 */
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
  /** Used to determine if item should be highlighted */
  active?: boolean
  /** Marker shown when `active`. Defaults to a check; `"bullet"` for radio sets. */
  activeMarker?: "check" | "bullet"
  icon?: React.ReactNode
  /** Optional visibility control by app state */
  visibleIn?: AppState[]
}

/**
 * Dropdown menu in the menu bar
 */
export interface MenuDropdown {
  id: string
  label: string
  items: (MenuItem | "separator")[]
  /** Optional visibility control by app state */
  visibleIn?: AppState[]
}

/**
 * Configuration for the entire menu bar
 */
export type MenuConfig = MenuDropdown[]

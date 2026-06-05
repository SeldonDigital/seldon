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
  /** Used to determine if item should be highlighted */
  active?: boolean
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

/**
 * Configuration for the toolbar section
 */
export interface ToolbarConfig {
  /** Should the toolbar be shown */
  visible: boolean
}

/**
 * Configuration for all header elements
 */
export interface HeaderConfig {
  /** Menu bar configuration */
  menuConfig: MenuConfig
  /** Toolbar configuration */
  toolbarConfig: ToolbarConfig
  /** Dialog states */
  dialogs: {
    showExportDialog: boolean
    setShowExportDialog: (show: boolean) => void
  }
}

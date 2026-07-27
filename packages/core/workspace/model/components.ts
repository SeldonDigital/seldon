import type { Properties } from "../../properties/types/properties"
import type {
  ComponentTreeRef,
  FontCollectionEntryRef,
  IconSetEntryRef,
  MediaEntryRef,
  ThemeEntryRef,
} from "./component-tree"
import type { EntryNodeLevel } from "./entry-node"
import type { WorkspaceStringMap } from "./string-maps"

export type BoardKey = string

export type ComponentThemeRef = string

export interface ComponentBoard {
  type: "component"
  level: EntryNodeLevel
  catalogId: string
  label: string
  author: string
  componentTheme: ComponentThemeRef
  componentProperties: Properties
  variants: ComponentTreeRef[]
  intent?: string
  tags?: string[]
  license?: WorkspaceStringMap
  __editor?: Record<string, unknown>
}

/**
 * A workspace-authored component board with no catalog schema. Its root node is
 * an `authored` entry that templates from a Container or Frame catalog id, but
 * the board owns identity, name, and declared `level`. The declared level is
 * enforced for containment and picks the export folder. Authored boards support
 * user variants and instances the same way component boards do, but they have
 * no reset-to-catalog for the board, the authored root, or its variants.
 *
 * `id` mirrors the board's map key so a row resolves its own key.
 */
export interface AuthoredComponentBoard {
  type: "authored-component"
  level: EntryNodeLevel
  label: string
  componentTheme: ComponentThemeRef
  componentProperties: Properties
  variants: ComponentTreeRef[]
  id?: BoardKey
  author?: string
  intent?: string
  tags?: string[]
  license?: WorkspaceStringMap
  __editor?: Record<string, unknown>
}

/**
 * A playground board. `id` mirrors the playground container's map key so a row
 * resolves its own key.
 */
export interface PlaygroundBoard {
  type: "playground"
  label: string
  componentTheme: ComponentThemeRef
  componentProperties: Properties
  variants: ComponentTreeRef[]
  id?: BoardKey
  intent?: string
  tags?: string[]
  __editor?: Record<string, unknown>
}

export interface ThemeBoard {
  type: "theme"
  catalogId: string
  label: string
  author: string
  componentPreview: string
  componentTheme: ComponentThemeRef
  componentProperties: Properties
  variants: ThemeEntryRef[]
  intent?: string
  tags?: string[]
  license?: WorkspaceStringMap
  __editor?: Record<string, unknown>
}

export interface FontCollectionBoard {
  type: "font-collection"
  catalogId: string
  label: string
  componentPreview: string
  componentTheme: ComponentThemeRef
  componentProperties: Properties
  variants: FontCollectionEntryRef[]
  license?: WorkspaceStringMap
  credentials?: WorkspaceStringMap
  intent?: string
  tags?: string[]
  __editor?: Record<string, unknown>
}

export interface IconSetBoard {
  type: "icon-set"
  catalogId: string
  label: string
  componentPreview: string
  componentTheme: ComponentThemeRef
  componentProperties: Properties
  variants: IconSetEntryRef[]
  license?: WorkspaceStringMap
  credentials?: WorkspaceStringMap
  intent?: string
  tags?: string[]
  __editor?: Record<string, unknown>
}

export interface MediaBoard {
  type: "media"
  catalogId: string
  label: string
  componentPreview: string
  componentTheme: ComponentThemeRef
  componentProperties: Properties
  variants: MediaEntryRef[]
  license?: WorkspaceStringMap
  credentials?: WorkspaceStringMap
  intent?: string
  tags?: string[]
  __editor?: Record<string, unknown>
}

export type Board =
  | ComponentBoard
  | AuthoredComponentBoard
  | PlaygroundBoard
  | ThemeBoard
  | FontCollectionBoard
  | IconSetBoard
  | MediaBoard

export function isComponentBoard(entry: Board): entry is ComponentBoard {
  return entry.type === "component"
}

export function isAuthoredBoard(entry: Board): entry is AuthoredComponentBoard {
  return entry.type === "authored-component"
}

export function isPlaygroundBoard(entry: Board): entry is PlaygroundBoard {
  return entry.type === "playground"
}

export function isThemeBoard(entry: Board): entry is ThemeBoard {
  return entry.type === "theme"
}

export function isFontCollectionBoard(entry: Board): entry is FontCollectionBoard {
  return entry.type === "font-collection"
}

export function isIconSetBoard(entry: Board): entry is IconSetBoard {
  return entry.type === "icon-set"
}

export function isMediaBoard(entry: Board): entry is MediaBoard {
  return entry.type === "media"
}

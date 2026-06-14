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
  intent?: string
  tags?: string[]
  license?: WorkspaceStringMap
  componentTheme: ComponentThemeRef
  componentProperties: Properties
  variants: ComponentTreeRef[]
  __editor?: Record<string, unknown>
}

export interface PlaygroundBoard {
  type: "playground"
  /** Mirrors the playground container's map key so a row resolves its own key. */
  id?: BoardKey
  label: string
  intent?: string
  tags?: string[]
  componentTheme: ComponentThemeRef
  componentProperties: Properties
  variants: ComponentTreeRef[]
  __editor?: Record<string, unknown>
}

export interface ThemeBoard {
  type: "theme"
  catalogId: string
  label: string
  author: string
  intent?: string
  tags?: string[]
  license?: WorkspaceStringMap
  componentPreview: string
  componentTheme: ComponentThemeRef
  componentProperties: Properties
  variants: ThemeEntryRef[]
  __editor?: Record<string, unknown>
}

export interface FontCollectionBoard {
  type: "font-collection"
  catalogId: string
  label: string
  license?: WorkspaceStringMap
  credentials?: WorkspaceStringMap
  intent?: string
  tags?: string[]
  componentPreview: string
  componentTheme: ComponentThemeRef
  componentProperties: Properties
  variants: FontCollectionEntryRef[]
  __editor?: Record<string, unknown>
}

export interface IconSetBoard {
  type: "icon-set"
  catalogId: string
  label: string
  license?: WorkspaceStringMap
  credentials?: WorkspaceStringMap
  intent?: string
  tags?: string[]
  componentPreview: string
  componentTheme: ComponentThemeRef
  componentProperties: Properties
  variants: IconSetEntryRef[]
  __editor?: Record<string, unknown>
}

export interface MediaBoard {
  type: "media"
  catalogId: string
  label: string
  license?: WorkspaceStringMap
  credentials?: WorkspaceStringMap
  intent?: string
  tags?: string[]
  componentPreview: string
  componentTheme: ComponentThemeRef
  componentProperties: Properties
  variants: MediaEntryRef[]
  __editor?: Record<string, unknown>
}

export type Board =
  | ComponentBoard
  | PlaygroundBoard
  | ThemeBoard
  | FontCollectionBoard
  | IconSetBoard
  | MediaBoard

export function isComponentBoard(entry: Board): entry is ComponentBoard {
  return entry.type === "component"
}

export function isPlaygroundBoard(entry: Board): entry is PlaygroundBoard {
  return entry.type === "playground"
}

export function isThemeBoard(entry: Board): entry is ThemeBoard {
  return entry.type === "theme"
}

export function isFontCollectionBoard(
  entry: Board,
): entry is FontCollectionBoard {
  return entry.type === "font-collection"
}

export function isIconSetBoard(entry: Board): entry is IconSetBoard {
  return entry.type === "icon-set"
}

export function isMediaBoard(entry: Board): entry is MediaBoard {
  return entry.type === "media"
}

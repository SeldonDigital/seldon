/**
 * Workspace file-format API.
 *
 * This module intentionally re-exports only the model surface defined by
 * `WORKSPACE.md` and `workspace/model/*`.
 */
export { WORKSPACE_SPEC_VERSION } from "./model"
export type { WorkspaceFileStringMap } from "./model"
export type { WorkspaceFileMetadata } from "./model"
export type { ComponentResourceRef, ComponentTreeRef } from "./model"
export type { Board } from "./helpers/is-board"
export type {
  ComponentEntry,
  ComponentCatalogLevel,
  ComponentBoard,
  FontCollectionBoard,
  IconSetBoard,
  ComponentKey,
  MediaBoard,
  PlaygroundBoard,
  ThemeBoard,
  ComponentThemeRef,
} from "./model"
export {
  isComponentBoard,
  isFontCollectionBoard,
  isIconSetBoard,
  isMediaBoard,
  isPlaygroundBoard,
  isThemeBoard,
} from "./model"
export type {
  EntryNode,
  EntryNodeId,
  EntryNodeLevel,
  EntryNodeThemeRef,
  EntryNodeType,
} from "./model"
export { isEntryNodeDefault, isEntryNodeInstance, isEntryNodeVariant } from "./model"
export type {
  EntryTheme,
  EntryThemeId,
  EntryThemeTokenOverrides,
  EntryThemeType,
} from "./model"
export { isEntryThemeDefault, isEntryThemeVariant } from "./model"
export type { EntryFontCollection, EntryFontCollectionId } from "./model"
export type { EntryIconSet, EntryIconSetId } from "./model"
export type { EntryMedia, EntryMediaId } from "./model"
export {
  formatNodeCatalog,
  formatNodeLink,
  formatThemeCatalog,
  formatThemeLink,
  parseNodeCatalog,
  parseNodeLink,
  parseNodeTemplate,
  parseThemeCatalog,
  parseThemeLink,
  parseThemeTemplate,
} from "./model"
export type { Workspace } from "./model"
export type {
  DefaultVariant,
  Instance,
  RulesNodeOrComponent,
  UserVariant,
  Variant,
} from "./helpers/rules/rules-node-subject"
export { isEntryNodeForRules } from "./helpers/rules/rules-node-subject"
export type {
  InstanceId,
  NodePath,
  ReferenceId,
  VariantId,
} from "./helpers/rules/workspace-node-ids"
export type {
  ExtractPayload,
  InsertDefaultInstance,
  WorkspaceAction,
} from "./reducers/types"
export type { Action, Middleware } from "./middleware/compose/action-types"

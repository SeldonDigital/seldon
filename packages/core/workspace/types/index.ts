/**
 * Workspace file-format API.
 *
 * This module intentionally re-exports only the model surface defined by
 * `WORKSPACE.md` and `workspace/model/*`.
 */
export { WORKSPACE_SPEC_VERSION } from "../model"
export type { WorkspaceStringMap } from "../model"
export type { WorkspaceMetadata } from "../model"
export type { ComponentResourceRef, ComponentTreeRef } from "../model"
export type {
  Board,
  ComponentBoard,
  FontCollectionBoard,
  IconSetBoard,
  BoardKey,
  MediaBoard,
  PlaygroundBoard,
  ThemeBoard,
  ComponentThemeRef,
} from "../model"
export {
  isComponentBoard,
  isFontCollectionBoard,
  isIconSetBoard,
  isMediaBoard,
  isPlaygroundBoard,
  isThemeBoard,
} from "../model"
export type { PlaygroundContainer, PlaygroundKey } from "../model"
export { isPlaygroundContainer } from "../model"
export type {
  EntryNode,
  EntryNodeId,
  EntryNodeLevel,
  EntryNodeThemeRef,
  EntryNodeType,
  NodeOrigin,
} from "../model"
export {
  isEntryNodeDefault,
  isEntryNodeInstance,
  isEntryNodeVariant,
} from "../model"
export type {
  CustomState,
  EntryNodeStates,
  NodeState,
  NormalState,
  ReservedStateName,
} from "../model"
export {
  NORMAL_STATE,
  RESERVED_STATE_LABELS,
  RESERVED_STATE_NAMES,
  isReservedStateName,
} from "../model"
export type {
  EntryTheme,
  EntryThemeId,
  EntryThemeOverrides,
  EntryThemeType,
} from "../model"
export { isEntryThemeDefault, isEntryThemeVariant } from "../model"
export type { EntryFontCollection, EntryFontCollectionId } from "../model"
export type { EntryIconSet, EntryIconSetId } from "../model"
export type { EntryMedia, EntryMediaId } from "../model"
export {
  formatNodeCatalog,
  formatNodeLink,
  formatThemeCatalog,
  formatThemeLink,
  parseNodeCatalog,
  parseNodeLink,
  parseNodeTemplate,
  parseThemeTemplate,
} from "../model"
export type { Workspace } from "../model"
export type {
  DefaultVariant,
  Instance,
  RulesNodeOrComponent,
  UserVariant,
  Variant,
} from "../helpers/rules/rules-node-subject"
export { isEntryNodeForRules } from "../helpers/rules/rules-node-subject"
export type {
  InstanceId,
  NodePath,
  ReferenceId,
  VariantId,
} from "../helpers/rules/workspace-node-ids"
export type {
  ExtractPayload,
  InsertDefaultInstance,
  ScaleTokenInput,
  ScaleTokenSection,
  ThemeCustomTokenSection,
  WorkspaceAction,
} from "../reducers/types"
export {
  THEME_CUSTOM_TOKEN_SECTIONS,
  isThemeCustomTokenSection,
} from "../reducers/types"
export type { Action, Middleware } from "../middleware/compose/action-types"

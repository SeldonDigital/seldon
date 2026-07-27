/**
 * Core and factory seam for the Vue editor.
 *
 * The Vue editor consumes `@seldon/core` and `@seldon/factory` as pure
 * functions. This module re-exports the exact set the app layer uses, so the
 * rest of the editor imports from one place and the coupling surface stays
 * explicit. No wrappers, no logic.
 */

// Reducer and validation.
export { workspaceReducer } from "@seldon/core/workspace/reducers/reducer"
export { WorkspaceValidationError } from "@seldon/core/workspace/middleware/validation/validation.middleware"

// Catalog access.
export {
  getComponentSchema,
  getComponentExportConfig,
} from "@seldon/core/components/catalog"

// Component identity + native primitive maps used by the canvas tag resolver.
export {
  ComponentId,
  NATIVE_REACT_PRIMITIVES,
} from "@seldon/core/components/constants"
export { WrapperElement } from "@seldon/core/properties"

// Node property and child resolution.
export { getNodeProperties } from "@seldon/core/workspace/helpers/nodes/get-node-properties"

// Theme compute (read-side selectors).
export {
  getComputedTheme,
  computeWorkspaceThemes,
} from "@seldon/core/workspace/compute"

// Factory compute + CSS bridge.
export { buildContext } from "@seldon/factory/helpers/compute-workspace"
export { getCssFromProperties } from "@seldon/factory/styles/css-properties/get-css-from-properties"

// Commonly used runtime values and helpers from the core barrel.
export {
  invariant,
  resolveNodeRepeat,
  ValueType,
  Display,
  MAX_REPEAT_COUNT,
} from "@seldon/core"

// Types consumed across the editor.
export type {
  Action,
  Workspace,
  Board,
  Instance,
  InstanceId,
  Variant,
  VariantId,
  Properties,
} from "@seldon/core"
export type { NativeReactPrimitive } from "@seldon/core/components/types"
export type { EntryNode, EntryNodeId } from "@seldon/core/workspace/types"
export type { ComputeContext } from "@seldon/core/properties/compute"
export type { NodeState } from "@seldon/core/workspace/model/node-state"

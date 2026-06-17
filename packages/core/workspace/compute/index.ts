/**
 * Workspace **read-side** orchestration for themes and node properties: materialized
 * themes (`getComputedTheme`), effective merges (`getEffectiveNodeProperties`), parent
 * context for `#parent.*`, then delegation to `properties/compute`. Resolution to CSS
 * strings lives in `helpers/resolution` after `computeProperties`. See `./README.md`.
 */
export {
  computeWorkspaceThemes,
  getComputedTheme,
} from "./compute-workspace-themes"
export {
  computeNodeProperties,
  getEffectiveNodeProperties,
  getNodeComputeContext,
  mergeEffectiveProperties,
} from "./compute-node-properties"
export type { ComputeContext } from "../../properties/compute"
export { resolveLayoutMode } from "../helpers/nodes/resolve-layout-mode"
export { buildNodeParentIndex } from "../helpers/graph/build-node-parent-index"
export type { NodeParentIndex } from "../helpers/graph/build-node-parent-index"
export type {
  ComputeNodePropertiesOptions,
  WorkspacePropertySource,
} from "./compute-node-properties"

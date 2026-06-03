import * as componentConstants from "./components/constants"
import * as propertiesConstants from "./properties"
import * as propertiesValues from "./properties/values"

export namespace Seldon {
  export const Constants = {
    ...propertiesConstants,
    ...componentConstants,
  }

  export const Values = {
    ...propertiesValues,
  }
}

export * from "./components/constants"
export * from "./components/types"
export * from "./components/catalog"
export * from "./helpers/utils/get-google-font-url"
export {
  getRemoteFontUrl,
  isRemoteFontFamily,
} from "./font-collections/helpers/remote-font-url"
export { getFamilyNameByValue } from "./font-collections/helpers/get-family-name-by-value"
export * from "./helpers/utils/invariant"
export * from "./properties"
export * from "./properties/compute"
export * from "./themes/compute/get-dynamic-swatch-color"
export * from "./themes/types"
export {
  SHADOW_LOOK_NONE,
  GRADIENT_LOOK_NONE,
  BACKGROUND_LOOK_NONE,
  BORDER_LOOK_NONE,
  FONT_LOOK_NORMAL,
} from "./themes/looks/built-in-looks"
export {
  LOOK_FACETS,
  isBridgedLookFacet,
  isLookSection,
} from "./themes/looks/look-facets"
export type {
  BridgedLookFacet,
  InlineLookFacet,
  LookFacetControlType,
  LookFacetEntry,
  LookSection,
} from "./themes/looks/look-facets"
export * from "./workspace/compute"
export * from "./workspace/types"
export * from "./workspace/services/index"
export {
  WORKSPACE_EDITABLE_THEME_ENTRY_ID,
  ensureWorkspaceEditableThemeEntry,
} from "./workspace/helpers/themes/workspace-editable-theme"
export { createEmptyWorkspace } from "./workspace/helpers/create-empty-workspace"

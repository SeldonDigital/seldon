import { IconId, iconIds, iconLabels } from "../../../icon-sets"
import { getAvailableIcons } from "../../../icon-sets/helpers/get-available-icons"
import {
  getAddedIconSetPrefixes,
  getWorkspaceEnabledIcons,
} from "../../../icon-sets/helpers/get-workspace-enabled-icons"
import { Workspace } from "../../../workspace/types"
import { ValueType } from "../../constants"
import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"
import { StringValue } from "../shared/exact/string"
import { InheritValue } from "../shared/inherit/inherit"

/** Stores an icon id or string key as one fixed picker choice. */
export interface SymbolOptionValue {
  type: ValueType.OPTION
  value: IconId | string
}

/** Empty, inherit, a catalog symbol id (`option`), or a custom id string (`exact`). */
export type SymbolValue =
  | EmptyValue
  | InheritValue
  | SymbolOptionValue
  | StringValue

/**
 * Builds picker options from the icons turned on across the workspace's
 * icon-set boards. Falls back to all available icons when no icon-set boards
 * exist, and to the full icon list when no workspace is provided.
 */
function symbolPresetOptions(workspace?: Workspace) {
  let ids: readonly IconId[]
  if (!workspace) {
    ids = iconIds
  } else if (getAddedIconSetPrefixes(workspace).size === 0) {
    ids = getAvailableIcons(workspace)
  } else {
    ids = getWorkspaceEnabledIcons(workspace)
  }

  return ids.map((id) => {
    const label = iconLabels[id]
    if (!label) {
      return {
        value: id,
        name: "[Unused Icon]",
      }
    }
    return {
      value: id,
      name: label,
    }
  })
}

/** Defines labels, allowed shapes, checks, and preset choices for `symbol`. */
export const symbolSchema: PropertySchema = {
  name: "symbol",
  description: "Icon symbol for icon components",
  supports: ["empty", "inherit", "exact", "option"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: unknown) => typeof value === "string" && value.length > 0,
    option: (value: unknown) => typeof value === "string" && value.length > 0,
  },
  presetOptions: symbolPresetOptions,
}

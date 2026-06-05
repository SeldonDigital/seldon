import { IconId, iconIds, iconLabels } from "../../../icon-sets"
import { getAvailableIcons } from "../../../icon-sets/helpers/get-available-icons"
import { Workspace } from "../../../workspace/types"
import { ValueType } from "../../constants"
import { PropertySchema } from "../../types/schema"
import { StringValue } from "../shared/exact/string"
import { EmptyValue } from "../shared/empty/empty"
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

/** Builds picker options: each id maps to its label, or a visible fallback when no label exists. */
function symbolPresetOptions(workspace?: Workspace) {
  const ids = workspace ? getAvailableIcons(workspace) : iconIds

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
    exact: (value: unknown) =>
      typeof value === "string" && value.length > 0,
    option: (value: unknown) =>
      typeof value === "string" && value.length > 0,
  },
  presetOptions: symbolPresetOptions,
}

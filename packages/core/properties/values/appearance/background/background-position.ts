import { Unit, ValueType } from "../../../constants"
import { PropertySchema } from "../../../types/schema"
import { EmptyValue } from "../../shared/empty/empty"
import { PercentageValue } from "../../shared/exact/percentage"
import { PixelValue } from "../../shared/exact/pixel"
import { RemValue } from "../../shared/exact/rem"
import { DoubleAxisValue } from "../../shared/option/double-axis"

/** Named anchors for where the picture sits inside the layer box. */
export enum BackgroundPosition {
  DEFAULT = "default",
  TOP_LEFT = "top-left",
  TOP_CENTER = "top-center",
  TOP_RIGHT = "top-right",
  CENTER_LEFT = "center-left",
  CENTER = "center",
  CENTER_RIGHT = "center-right",
  BOTTOM_LEFT = "bottom-left",
  BOTTOM_CENTER = "bottom-center",
  BOTTOM_RIGHT = "bottom-right",
}

/** Stores one named anchor as an option pick. */
export interface BackgroundPositionOptionValue {
  type: ValueType.OPTION
  value: BackgroundPosition
}

/** Where the picture sits for one layer: empty, lengths, named anchor, or paired lengths. */
export type BackgroundPositionValue =
  | EmptyValue
  | PixelValue
  | RemValue
  | PercentageValue
  | BackgroundPositionOptionValue
  | DoubleAxisValue

function isMeasurePayload(u: unknown): boolean {
  if (typeof u !== "object" || u === null) return false
  const m = u as { value?: unknown; unit?: unknown }
  if (typeof m.value !== "number" || !Number.isFinite(m.value)) return false
  return m.unit === Unit.PX || m.unit === Unit.REM || m.unit === Unit.PERCENT
}

/** Validates position storage on one background paint layer. */
export const backgroundPositionSchema: PropertySchema = {
  name: "backgroundPosition",
  description:
    "Sets where the picture sits in this layer using named anchors or measured offsets.",
  supports: ["empty", "inherit", "exact", "option"] as const,
  units: {
    allowed: [Unit.PX, Unit.REM, Unit.PERCENT],
    default: Unit.PX,
    validation: "both",
  },
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: unknown) => {
      if (typeof value !== "object" || value === null) return false
      const v = value as Record<string, unknown>
      if ("x" in v && "y" in v) {
        return isMeasurePayload(v.x) && isMeasurePayload(v.y)
      }
      return isMeasurePayload(value)
    },
    option: (value: unknown) =>
      typeof value === "string" &&
      (Object.values(BackgroundPosition) as string[]).includes(value),
  },
  presetOptions: () => Object.values(BackgroundPosition),
}

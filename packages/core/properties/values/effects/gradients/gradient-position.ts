import { Unit, ValueType } from "../../../constants"
import { PropertySchema } from "../../../types/schema"
import { EmptyValue } from "../../shared/empty/empty"
import { PercentageValue } from "../../shared/exact/percentage"
import { PixelValue } from "../../shared/exact/pixel"
import { RemValue } from "../../shared/exact/rem"

/** Named anchors for the radial gradient center along the horizontal axis. */
export enum GradientPositionX {
  LEFT = "left",
  CENTER = "center",
  RIGHT = "right",
}

/** Named anchors for the radial gradient center along the vertical axis. */
export enum GradientPositionY {
  TOP = "top",
  CENTER = "center",
  BOTTOM = "bottom",
}

/** Stores one named axis anchor for a radial gradient center. */
export interface GradientPositionOptionValue {
  type: ValueType.OPTION
  value: GradientPositionX | GradientPositionY
}

/**
 * Unset, a measured offset, or a named anchor for a radial gradient center
 * along one axis. The keyword set is validated per axis by the axis schema.
 */
export type GradientPositionValue =
  | EmptyValue
  | PixelValue
  | RemValue
  | PercentageValue
  | GradientPositionOptionValue

function isMeasurePayload(u: unknown): boolean {
  if (typeof u !== "object" || u === null) return false
  const m = u as { value?: unknown; unit?: unknown }
  if (typeof m.value !== "number" || !Number.isFinite(m.value)) return false
  return m.unit === Unit.PX || m.unit === Unit.REM || m.unit === Unit.PERCENT
}

/** Validates the horizontal axis of a radial gradient center position. */
export const gradientPositionXSchema: PropertySchema = {
  name: "gradientPositionX",
  description:
    "Sets the radial gradient center on the horizontal axis using px, rem, percent, or a named anchor.",
  supports: ["empty", "inherit", "exact", "option"] as const,
  units: {
    allowed: [Unit.PX, Unit.REM, Unit.PERCENT],
    default: Unit.PERCENT,
    validation: "both",
  },
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: unknown) => isMeasurePayload(value),
    option: (value: unknown) =>
      typeof value === "string" &&
      (Object.values(GradientPositionX) as string[]).includes(value),
  },
  presetOptions: () => Object.values(GradientPositionX),
}

/** Validates the vertical axis of a radial gradient center position. */
export const gradientPositionYSchema: PropertySchema = {
  name: "gradientPositionY",
  description:
    "Sets the radial gradient center on the vertical axis using px, rem, percent, or a named anchor.",
  supports: ["empty", "inherit", "exact", "option"] as const,
  units: {
    allowed: [Unit.PX, Unit.REM, Unit.PERCENT],
    default: Unit.PERCENT,
    validation: "both",
  },
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: unknown) => isMeasurePayload(value),
    option: (value: unknown) =>
      typeof value === "string" &&
      (Object.values(GradientPositionY) as string[]).includes(value),
  },
  presetOptions: () => Object.values(GradientPositionY),
}

import { Unit } from "../../../constants"
import { ImageFit } from "../../shared/utilities/image-fit"

import type { PropertySchema } from "../../../types/schema"
import type { EmptyValue } from "../../shared/empty/empty"
import type { PercentageValue } from "../../shared/exact/percentage"
import type { PixelValue } from "../../shared/exact/pixel"
import type { RemValue } from "../../shared/exact/rem"
import type { DoubleAxisValue } from "../../shared/option/double-axis"
import type { ImageFitValue } from "../../shared/utilities/image-fit"

/** One size choice before pairing: empty, lengths, or a named fit. */
export type SingleBackgroundSizeValue =
  | EmptyValue
  | PixelValue
  | RemValue
  | PercentageValue
  | ImageFitValue

/** All size shapes for one background layer. */
export type BackgroundSizeValue = EmptyValue | SingleBackgroundSizeValue | DoubleAxisValue

function isMeasurePayload(u: unknown): boolean {
  if (typeof u !== "object" || u === null) return false
  const m = u as { value?: unknown; unit?: unknown }

  if (typeof m.value !== "number" || !Number.isFinite(m.value)) return false

  return m.unit === Unit.PX || m.unit === Unit.REM || m.unit === Unit.PERCENT
}

/** Validates size storage on one background paint layer. */
export const backgroundSizeSchema: PropertySchema = {
  name: "backgroundSize",
  description:
    "Sets how the picture scales in this layer using a fit name, lengths, or width and height together.",
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
      typeof value === "string" && (Object.values(ImageFit) as string[]).includes(value),
  },
  presetOptions: () => Object.values(ImageFit),
}

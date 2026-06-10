import { FONT_COLLECTIONS } from "../../../../font-collections/catalog"
import { Theme, ThemeFontFamilyKey } from "../../../../themes/types"
import { Workspace } from "../../../../workspace/types"
import { ValueType } from "../../../constants"
import { PropertySchema } from "../../../types/schema"
import { EmptyValue } from "../../shared/empty/empty"
import { StringValue } from "../../shared/exact/string"
import { InheritValue } from "../../shared/inherit/inherit"

/**
 * Stored option values from every packaged collection (`system` + `googleFonts`). Local
 * families store their CSS token (`family.stack`); remote families store their `name`.
 * Used to validate option values.
 */
const PACKAGED_FAMILY_VALUES: ReadonlySet<string> = new Set(
  FONT_COLLECTIONS.flatMap((collection) =>
    Object.values(collection.families).map(
      (family) => family.stack ?? family.name,
    ),
  ),
)

/** Picks one catalog or bundled font name as an option value. */
export interface FontFamilyOptionValue {
  type: ValueType.OPTION
  value: string
}

/** References a named font family slot from the theme. */
export interface FontFamilyThemeValue {
  type: ValueType.THEME_CATEGORICAL
  value: ThemeFontFamilyKey
}

/**
 * Resolved font family as a concrete string, stored like a fixed picker choice
 * for downstream CSS (`ValueType.OPTION`).
 */
export type FontFamilyPresetValue = {
  type: ValueType.OPTION
  value: string
}

/** Empty, inherit, theme slot, bundled list entry, or a custom family string (`exact`). */
export type FontFamilyValue =
  | EmptyValue
  | InheritValue
  | StringValue
  | FontFamilyOptionValue
  | FontFamilyThemeValue

/** Validates stored font family values. */
export const fontFamilySchema: PropertySchema = {
  name: "fontFamily",
  description:
    "Sets the typeface from theme slots, the bundled list, or a custom name you type.",
  supports: [
    "empty",
    "inherit",
    "exact",
    "option",
    "themeCategorical",
  ] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: unknown) => typeof value === "string" && value.length > 0,
    option: (value: unknown) => {
      if (typeof value !== "string" || value.length === 0) return false
      if (value.startsWith("@fontFamily.")) return true
      return PACKAGED_FAMILY_VALUES.has(value)
    },
    themeCategorical: (value: unknown, theme?: Theme) => {
      if (!theme || typeof value !== "string") return false
      return (Object.keys(theme.fontFamily) as string[]).some(
        (id) => value === `@fontFamily.${id}`,
      )
    },
  },
  presetOptions: (_workspace?: Workspace) => {
    // Families come from the workspace's font collection boards, injected by the
    // picker layer. Theme font slots come from `themeCategoricalKeys` below, so
    // this list stays empty to avoid duplicating them.
    return []
  },
  themeCategoricalKeys: (theme: Theme) =>
    (Object.keys(theme.fontFamily) as string[]).map(
      (id) => `@fontFamily.${id}` as ThemeFontFamilyKey,
    ),
}

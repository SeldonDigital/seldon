import { EntryTheme } from "../../types"
import { isVariantKind } from "../general/variant-kind"

export function isUserThemeVariant(
  theme: EntryTheme,
): theme is EntryTheme & { type: "variant" } {
  return isVariantKind(theme)
}

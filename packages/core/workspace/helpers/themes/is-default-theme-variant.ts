import { EntryTheme } from "../../types"
import { isDefaultVariantKind } from "../general/variant-kind"

export function isDefaultThemeVariant(
  theme: EntryTheme,
): theme is EntryTheme & { type: "default" } {
  return isDefaultVariantKind(theme)
}

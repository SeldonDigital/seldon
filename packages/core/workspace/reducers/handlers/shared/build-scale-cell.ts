import { TokenType } from "../../../../themes/constants/token-type"
import type { ThemeExact, ThemeModulation } from "../../../../themes/types"
import type { ScaleTokenInput } from "../../types"

/** Builds a scale-table cell (`ThemeModulation` or `ThemeExact`) from a discriminated payload. */
export function buildScaleCell(
  payload: { name: string; intent?: string } & ScaleTokenInput,
): ThemeModulation | ThemeExact {
  if (payload.kind === "modulated") {
    return {
      type: TokenType.MODULATED,
      name: payload.name,
      intent: payload.intent,
      parameters: payload.parameters,
    }
  }
  return {
    type: TokenType.EXACT,
    name: payload.name,
    intent: payload.intent,
    parameters: payload.parameters,
  }
}

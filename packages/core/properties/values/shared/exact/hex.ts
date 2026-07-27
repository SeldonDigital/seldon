import type { ValueType } from "../../../constants"

export type Hex = `#${string}`

export interface HexValue {
  type: ValueType.EXACT
  value: Hex
}

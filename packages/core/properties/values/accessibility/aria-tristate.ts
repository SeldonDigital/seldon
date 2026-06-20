import { ValueType } from "../../constants"
import { EmptyValue } from "../shared/empty/empty"

/** Tristate keyword shared by `ariaChecked` and `ariaPressed`. */
export enum AriaTristate {
  TRUE = "true",
  FALSE = "false",
  MIXED = "mixed",
}

/** Records which tristate keyword is selected. */
export interface AriaTristateOptionValue {
  type: ValueType.OPTION
  value: AriaTristate
}

/** Empty, or a tristate keyword (`true`, `false`, `mixed`). */
export type AriaTristateValue = EmptyValue | AriaTristateOptionValue

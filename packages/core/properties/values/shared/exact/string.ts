import { ValueType } from "../../../constants"
import { EmptyValue } from "../empty/empty"

/** Exact string payload on a node. */
export type StringValue = {
  type: ValueType.EXACT
  value: string
  restrictions?: {
    allowedExtensions?: string[]
    allowedPatterns?: RegExp[]
    maxLength?: number
  }
}

/** Not set, or plain text stored as an exact string. */
export type ContentValue = EmptyValue | StringValue

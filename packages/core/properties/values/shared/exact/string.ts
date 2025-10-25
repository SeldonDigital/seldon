import { ValueType } from "../../../constants"

export type StringValue = {
  type: ValueType.EXACT
  value: string
  restrictions?: {
    allowedExtensions?: string[]
    allowedPatterns?: RegExp[]
    maxLength?: number
  }
}

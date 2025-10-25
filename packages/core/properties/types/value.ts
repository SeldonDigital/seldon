/**
 * Main Value type - union of all property value types (atomic, compound, shorthand)
 */
import { AtomicValue } from "./value-atomic"
import { CompoundValue } from "./value-compound"
import { ShorthandValue } from "./value-shorthand"

export type Value = AtomicValue | CompoundValue | ShorthandValue

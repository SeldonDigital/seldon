import { AtomicValue } from "./value-atomic"
import { CompoundBranchPayload } from "./value-compound"
import { ShorthandValue } from "./value-shorthand"

/** Any payload stored on a property field: one tag, structured facets, or parallel sides. */
export type Value = AtomicValue | CompoundBranchPayload | ShorthandValue

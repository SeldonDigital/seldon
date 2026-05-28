import type { Entity } from "../../../rules/types/rule-config-types"
import type { EntryNodeType } from "../../model/entry-node"

/**
 * Maps serialized [`EntryNode.type`](../../model/entry-node.ts) values to the
 * [`Entity`](../../../rules/types/rule-config-types.ts) keys used in
 * `rules.mutations.*`. This is the **only** vocabulary bridge reducers and editors
 * should use when indexing `rules.mutations[operation][entity]`.
 *
 * | `EntryNode.type` | `Entity` |
 * | ---------------- | -------- |
 * | `default`        | `defaultVariant` |
 * | `variant`        | `userVariant` |
 * | `instance`       | `instance` |
 */
export function mapEntryNodeTypeToRulesEntity(type: EntryNodeType): Entity {
  switch (type) {
    case "default":
      return "defaultVariant"
    case "variant":
      return "userVariant"
    case "instance":
      return "instance"
    default: {
      const _exhaustive: never = type
      return _exhaustive
    }
  }
}

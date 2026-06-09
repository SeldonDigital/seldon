import type { SchemaChild } from "../../../components/types"
import { applyVariantFallbackToSlot } from "./schema-composition-children"

function sortKeysDeep(value: unknown): unknown {
  if (value === null || typeof value !== "object") {
    return value
  }

  if (Array.isArray(value)) {
    return value.map(sortKeysDeep)
  }

  const record = value as Record<string, unknown>
  const sorted: Record<string, unknown> = {}
  for (const key of Object.keys(record).sort()) {
    sorted[key] = sortKeysDeep(record[key])
  }
  return sorted
}

function stableSerialize(value: unknown): string {
  return JSON.stringify(sortKeysDeep(value))
}

/**
 * Deterministic fingerprint for a schema composition slot. Matching fingerprints
 * share the same workspace child instance when a component board is added.
 */
export function getSchemaSlotFingerprint(
  slot: SchemaChild,
  options?: { variantFallbacks?: ReadonlySet<string> },
): string {
  const normalized = applyVariantFallbackToSlot(slot, options?.variantFallbacks)

  const childFingerprints =
    normalized.children?.map((child) =>
      getSchemaSlotFingerprint(child, options),
    ) ?? []

  return stableSerialize({
    component: normalized.component,
    variant: normalized.variant ?? null,
    overrides: normalized.overrides ?? {},
    children: childFingerprints,
  })
}

import { isCompoundValue } from "../../helpers/type-guards/compound/is-compound-value"
import { findInObject } from "../../helpers/utils/find-in-object"
import { invariant } from "../../helpers/utils/invariant"
import { ValueType } from "../constants"
import type { Value } from "../types/value"
import type { AtomicValue } from "../types/value-atomic"
import { BackgroundKind } from "../values/appearance/background/background-kind"
import { Color } from "../values/appearance/color"
import { ComputeContext } from "./types"

const LAYERED_PAINT_ROOTS = ["background", "shadow"] as const

export type ResolvedBasedOnWithAnchor = {
  value: Value | undefined
  /** Properties context that supplied `value`; used for sibling layer facets. */
  facetSource: Omit<ComputeContext, "theme"> | null
}

/**
 * Maps schema-style paths such as `background.color` to runtime paths `background.0.color`.
 */
function normalizeBasedOnLookupPath(path: string): string {
  for (const root of LAYERED_PAINT_ROOTS) {
    const prefix = `${root}.`
    if (!path.startsWith(prefix)) continue

    const rest = path.slice(prefix.length)
    if (/^\d+\./.test(rest)) continue

    return `${root}.0.${rest}`
  }

  return path
}

function isNonContributingBackgroundColor(value: Value | undefined): boolean {
  if (!value || typeof value !== "object" || !("type" in value)) {
    return true
  }

  if (value.type === ValueType.EMPTY || value.type === ValueType.INHERIT) {
    return true
  }

  // A COMPUTED color (Match Color) defers to an ancestor surface, so the layer
  // contributes no concrete color of its own. Skipping it lets the walk reach
  // the matched ancestor, so both the resolved color and the mirrored
  // brightness/opacity come from the same source.
  if (value.type === ValueType.COMPUTED) {
    return true
  }

  return value.type === ValueType.OPTION && value.value === Color.TRANSPARENT
}

/**
 * A background layer whose `kind` is `none` paints nothing, so it cannot act as a contrast
 * surface even when its `color` facet still carries a leftover swatch from the catalog default.
 */
function isNonContributingBackgroundKind(value: Value | undefined): boolean {
  return Boolean(
    value &&
    typeof value === "object" &&
    "type" in value &&
    value.type === ValueType.OPTION &&
    value.value === BackgroundKind.NONE,
  )
}

/**
 * Resolves a `basedOn` path and, for `#parent.*` lookups, walks `parentContext` while the hit is
 * missing, `EMPTY`, `INHERIT`, or explicit `transparent`. Returns the context whose properties
 * supplied the final value as `facetSource`.
 */
export function resolveBasedOnWithAnchor(
  basedOn: string,
  context: Omit<ComputeContext, "theme">,
): ResolvedBasedOnWithAnchor {
  const colorLookupPath = normalizeBasedOnLookupPath(
    basedOn.replace(/^#(parent\.|self\.)?/, ""),
  )

  const kindLookupPath =
    colorLookupPath.startsWith("background.") &&
    colorLookupPath.endsWith(".color")
      ? colorLookupPath.replace(/\.color$/, ".kind")
      : null

  const isNonContributingLayer = (
    properties: Omit<ComputeContext, "theme">["properties"],
    colorValue: Value | undefined,
  ): boolean => {
    if (isNonContributingBackgroundColor(colorValue)) {
      return true
    }

    if (!kindLookupPath) {
      return false
    }

    return isNonContributingBackgroundKind(
      findInObject<Value>(properties, kindLookupPath),
    )
  }

  const walkParents = (
    start: ComputeContext,
    seed: Value | undefined,
  ): ResolvedBasedOnWithAnchor => {
    let cursor = start
    let value = seed

    while (
      isNonContributingLayer(cursor.properties, value) &&
      cursor.parentContext
    ) {
      cursor = cursor.parentContext

      value = findInObject<Value>(cursor.properties, colorLookupPath)
    }

    return { value, facetSource: cursor }
  }

  if (basedOn.startsWith("#parent.") && context.parentContext) {
    const parent = context.parentContext

    return walkParents(
      parent,
      findInObject<Value>(parent.properties, colorLookupPath),
    )
  }

  if (basedOn.startsWith("#self.")) {
    const selfValue = findInObject<Value>(context.properties, colorLookupPath)

    if (!isNonContributingLayer(context.properties, selfValue)) {
      return { value: selfValue, facetSource: context }
    }

    if (!context.parentContext) {
      return { value: selfValue, facetSource: context }
    }

    const parent = context.parentContext

    return walkParents(
      parent,
      findInObject<Value>(parent.properties, colorLookupPath),
    )
  }

  return {
    value: findInObject<Value>(context.properties, colorLookupPath),
    facetSource: context,
  }
}

/**
 * Resolves a `basedOn` path on the current node's `properties`, or on the parent's `properties`
 * when the path starts with `#parent.`. Dot segments follow the same rules as `findInObject`. When
 * the path starts with `#parent.`/`#self.` and the hit is missing, `EMPTY`, `INHERIT`, or explicit
 * `transparent`, walks up `parentContext` and reads the same path again until a contributing value
 * appears or there is no further parent.
 *
 * @param basedOn - The source path, such as `#parent.buttonSize` or `#self.background.color`
 * @param context - Properties and parent chain only; theme is omitted because paths do not read it
 * @returns The atomic property value at the resolved path
 * @throws When the path misses or when the value at the path is not an atomic field value
 */
export function getBasedOnValue(
  basedOn: string,
  context: Omit<ComputeContext, "theme">,
): AtomicValue {
  const { value } = resolveBasedOnWithAnchor(basedOn, context)

  if (!value) {
    throw new Error(`Based on value not found for ${basedOn}.`)
  }

  invariant(
    !isCompoundValue(value),
    `Based on path must resolve to a single field value, not a grouped value: ${JSON.stringify(value)}`,
  )

  return value as AtomicValue
}

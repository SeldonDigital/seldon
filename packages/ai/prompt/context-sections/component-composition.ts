import { findComponentSchema } from "@seldon/core/components/catalog"
import {
  type SchemaChild,
  hasVariants,
  isComplexSchema,
} from "@seldon/core/components/types"

import { section } from "./section"

/** The tail a child line prints after its component id: variant and baked override keys. */
function childTail(child: SchemaChild): string {
  const variant = child.variant ? ` variant "${child.variant}"` : ""
  const overrideKeys = child.overrides ? Object.keys(child.overrides) : []
  const overrides =
    overrideKeys.length > 0 ? ` (overrides: ${overrideKeys.join(", ")})` : ""
  return `${variant}${overrides}`
}

/**
 * The lines for a child tree, indented two spaces per depth. A child prints its
 * component id, its variant when it selects one, and the keys it overrides, but
 * not the override values, so a deep tree stays compact. Nested children recurse
 * one level deeper.
 */
function childLines(children: readonly SchemaChild[], depth: number): string[] {
  const indent = "  ".repeat(depth + 1)
  const lines: string[] = []
  for (const child of children) {
    lines.push(`${indent}- ${child.component}${childTail(child)}`)
    if (child.children && child.children.length > 0) {
      lines.push(...childLines(child.children, depth + 1))
    }
  }
  return lines
}

/**
 * Context section: a component's composition.
 *
 * The vocabulary section lists a component's settable properties, but never what
 * it assembles into. This projects the schema's default composition tree, its
 * named variants, and the overrides each child bakes in, all read from
 * getComponentSchema, so the model can foresee that inserting one component
 * yields its full child tree instead of rebuilding it child by child. Returns []
 * when the id resolves to no schema, so the caller shows its own fallback.
 */
export function componentCompositionSection(catalogId: string): string[] {
  const schema = findComponentSchema(catalogId)
  if (!schema) return []

  const body: string[] = [`${schema.id} [${schema.level}] - ${schema.intent}`]

  if (isComplexSchema(schema)) {
    const children = schema.default.children ?? []
    if (children.length > 0) {
      body.push("composition (default):")
      body.push(...childLines(children, 0))
    } else {
      body.push("composition (default): (empty)")
    }
  } else {
    body.push("leaf, no composition")
  }

  if (hasVariants(schema)) {
    body.push("variants:")
    for (const variant of schema.variants) {
      body.push(`  - ${variant.id} (${variant.label})`)
    }
    body.push(
      "Each variant is an alternate tree; insert one with insert_variant_instance.",
    )
  } else {
    body.push("variants: (none)")
  }

  return section(`Composition for ${schema.id}:`, body)
}

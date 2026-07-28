import type { ExpressionInput, RefConsumer } from "@seldon/factory/bindings/types"
import type { SeldonRefView } from "@seldon/factory/export/shared/generate-refs-registry"

/**
 * Plain-language descriptions of one binding, shared by the properties sidebar
 * rows and the canvas connector cards so both name the same thing the same way.
 */

/**
 * Names the slot a view exposes. A `when-passed` slot is called out, because a ref
 * override alone cannot bring it on screen and that surprises a caller who set one.
 */
export function describeRefSlot(slot: string | null, rendersWhen: string): string {
  const name = slot ?? "root"

  return rendersWhen === "when-passed" ? `${name} (when passed)` : name
}

/** One view as a single line: the component that owns the slot, then the slot. */
export function describeRefView(view: SeldonRefView): string {
  return `${view.component} · ${describeRefSlot(view.slot, view.rendersWhen)}`
}

/** Where a consumer sits, as the file and line an editor can jump to. */
export function describeConsumerLocation(consumer: RefConsumer): string {
  return `${consumer.file}:${consumer.line}`
}

/**
 * What produced a bound value.
 *
 * A hook call is the useful answer, so `via` wins over the declaration itself.
 * This is the question the overlay exists to answer: not just that code drives a
 * node, but which code.
 */
export function describeExpressionInput(input: ExpressionInput): string {
  const site = input.declaredAt

  if (!site) return input.name
  if (site.via) return `${input.name} from ${site.via}()`
  if (site.module) return `${input.name} imported from ${site.module}`

  return `${input.name} (${site.kind}, line ${site.line})`
}

/** The file's own name, for a consumer that reports no enclosing component. */
export function getRefFileName(file: string): string {
  const parts = file.split("/")

  return parts[parts.length - 1] || file
}

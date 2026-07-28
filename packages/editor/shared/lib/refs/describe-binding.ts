import type { RefBinding } from "./join-refs-and-bindings"
import type { ExpressionInput, RefConsumer } from "@seldon/factory/bindings/types"
import type { SeldonRefView } from "@seldon/factory/export/shared/generate-refs-registry"

/**
 * What a description is about. `note` explains why a binding has nothing to show,
 * `heading` labels a group, `view` names a generated component that exposes the ref,
 * `consumer` names app code that drives it, and `detail` supports the one above it.
 */
export type BindingDescriptionKind = "note" | "heading" | "view" | "consumer" | "detail"

/**
 * One thing said about a binding, split so each surface presents it its own way.
 *
 * `label` leads and `detail` supports, which the properties sidebar renders as a name
 * and a value and the canvas card renders as one line. A description with no `detail`
 * carries all its text in `label`.
 */
export interface BindingDescription {
  key: string
  kind: BindingDescriptionKind
  label: string
  detail?: string
  /** Set on a `consumer` description that only drives the ref on some branches. */
  conditional?: boolean
}

const STATE_NOTES: Record<string, string> = {
  unbound: "No code drives this ref yet.",
  stale: "The manifest names this ref, but the workspace no longer has it.",
}

/**
 * Everything there is to say about one binding: the generated components that expose
 * the ref, then every place app code drives it, down to the expression and the hook
 * behind it.
 *
 * Flat rather than nested, so a surface renders it in one pass and each description
 * carries its own kind. Every surface that reports a binding reads from here, so the
 * properties sidebar and the canvas card word the same thing the same way. A surface
 * with room for a summary keeps the `view` and `consumer` descriptions and drops the
 * rest.
 *
 * Keys are unprefixed, such as `view#0` and `consumer#0`, so a caller that needs its
 * own namespace can prefix them.
 */
export function describeBinding(binding: RefBinding | null): BindingDescription[] {
  if (!binding) return []

  const descriptions: BindingDescription[] = []
  const note = STATE_NOTES[binding.state]

  if (note) {
    descriptions.push({ key: "note", kind: "note", label: note })
  }

  if (binding.views.length > 0) {
    descriptions.push({ key: "views", kind: "heading", label: "Exposed by" })

    binding.views.forEach((view, index) => {
      descriptions.push({
        key: `view#${index}`,
        kind: "view",
        label: view.component,
        detail: describeSlot(view),
      })
    })
  }

  if (binding.consumers.length > 0) {
    descriptions.push({ key: "consumers", kind: "heading", label: "Driven by" })
    binding.consumers.forEach((consumer, index) => {
      addConsumer(descriptions, consumer, index)
    })
  }

  return descriptions
}

/** One description as a single line, for a surface with one column to put it in. */
export function formatBindingDescription(description: BindingDescription): string {
  const conditional = description.conditional ? " (conditional)" : ""

  if (!description.detail) return `${description.label}${conditional}`

  return `${description.label} · ${description.detail}${conditional}`
}

/** The file's own name, for a consumer that reports no enclosing component. */
export function getBindingFileName(file: string): string {
  const parts = file.split("/")

  return parts[parts.length - 1] || file
}

function addConsumer(
  descriptions: BindingDescription[],
  consumer: RefConsumer,
  index: number,
): void {
  descriptions.push({
    key: `consumer#${index}`,
    kind: "consumer",
    label: consumer.component || getBindingFileName(consumer.file),
    detail: `${consumer.file}:${consumer.line}`,
    conditional: consumer.conditional,
  })

  if (consumer.expression) {
    descriptions.push({
      key: `consumer#${index}-expression`,
      kind: "detail",
      label: consumer.expression,
    })
  }

  consumer.inputs.forEach((input, inputIndex) => {
    descriptions.push({
      key: `consumer#${index}-input#${inputIndex}`,
      kind: "detail",
      label: describeInput(input),
    })
  })
}

/**
 * Names the slot a view exposes. A `when-passed` slot is called out, because a ref
 * override alone cannot bring it on screen and that surprises a caller who set one.
 */
function describeSlot(view: SeldonRefView): string {
  const name = view.slot ?? "root"

  return view.rendersWhen === "when-passed" ? `${name} (when passed)` : name
}

/**
 * What produced a bound value.
 *
 * A hook call is the useful answer, so `via` wins over the declaration itself. This
 * is the question the overlay exists to answer: not just that code drives a node, but
 * which code.
 */
function describeInput(input: ExpressionInput): string {
  const site = input.declaredAt

  if (!site) return input.name
  if (site.via) return `${input.name} from ${site.via}()`
  if (site.module) return `${input.name} imported from ${site.module}`

  return `${input.name} (${site.kind}, line ${site.line})`
}

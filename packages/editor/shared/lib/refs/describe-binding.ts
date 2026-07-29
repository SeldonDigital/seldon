import type { RefBinding } from "./join-refs-and-bindings"
import type { ExpressionInput, RefConsumer } from "@seldon/factory/bindings/types"
import type { SeldonRefView } from "@seldon/factory/export/shared/generate-refs-registry"

/** One generated component that exposes the ref, and the slot it exposes it as. */
export interface BindingViewDescription {
  component: string
  file: string
  slot: string
  condition: string
}

/**
 * One place app code drives the ref.
 *
 * `pass` is the expression the code hands the slot, and `from` names what produced
 * the values inside it, one line per input.
 */
export interface BindingControllerDescription {
  name: string
  location: string
  from: string[]
  conditional: boolean
  pass: string | null
}

/**
 * Everything there is to say about one binding: the generated components that expose
 * the ref, then every place app code drives it, down to the expression and the hook
 * behind it.
 *
 * `note` carries why there is nothing else to show, and is null when there is.
 */
export interface BindingDescription {
  note: string | null
  views: BindingViewDescription[]
  controllers: BindingControllerDescription[]
}

const STATE_NOTES: Record<string, string> = {
  unbound: "No code drives this ref yet.",
  stale: "The manifest names this ref, but the workspace no longer has it.",
}

const SLOT_CONDITIONS: Record<SeldonRefView["rendersWhen"], string> = {
  "unless-null": "renders unless null",
  "when-passed": "renders when passed",
}

/**
 * Describes one binding in the words every surface reports it with, so the properties
 * sidebar and the canvas card say the same thing the same way.
 *
 * Fields stay separate rather than pre-joined, because each surface has its own number
 * of places to put them. A surface with two columns keeps a name and a location, and
 * drops the expression and the inputs behind it.
 */
export function describeBinding(binding: RefBinding | null): BindingDescription {
  if (!binding) {
    return { note: null, views: [], controllers: [] }
  }

  return {
    note: STATE_NOTES[binding.state] ?? null,
    views: binding.views.map(describeView),
    controllers: binding.consumers.map(describeConsumer),
  }
}

/**
 * Names the slot a view exposes and when it renders.
 *
 * A `when-passed` slot is called out, because a ref override alone cannot bring it on
 * screen and that surprises a caller who set one.
 */
function describeView(view: SeldonRefView): BindingViewDescription {
  return {
    component: view.component,
    file: view.file,
    slot: view.slot ?? "root",
    condition: SLOT_CONDITIONS[view.rendersWhen],
  }
}

/** The file's own name, for a consumer that reports no enclosing component. */
function getBindingFileName(file: string): string {
  const parts = file.split("/")

  return parts[parts.length - 1] || file
}

function describeConsumer(consumer: RefConsumer): BindingControllerDescription {
  return {
    name: consumer.component || getBindingFileName(consumer.file),
    location: `${consumer.file}:${consumer.line}`,
    from: consumer.inputs.map(describeInput),
    conditional: consumer.conditional,
    pass: consumer.expression || null,
  }
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

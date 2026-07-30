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
 * What reading the linked folder produced, which is why a binding can have neither
 * views nor consumers through no fault of the ref itself.
 *
 * `problem` is the one sentence to show the reader. `hasRegistry` says whether the
 * views half arrived, which the views section reports on its own rather than reading
 * the problem meant for the card.
 */
export interface RefBindingsStatus {
  problem: string | null
  hasRegistry: boolean
}

/**
 * Everything there is to say about one binding: the generated components that expose
 * the ref, then every place app code drives it, down to the expression and the hook
 * behind it.
 *
 * Each note carries why its own section has nothing to show, and is null when the
 * section has something. `viewNote` answers for the views and `note` for the
 * controllers, so neither section falls silent and neither repeats the other.
 */
export interface BindingDescription {
  viewNote: string | null
  note: string | null
  views: BindingViewDescription[]
  controllers: BindingControllerDescription[]
}

const STATE_NOTES: Record<string, string> = {
  unbound: "No code drives this reference yet.",
  stale: "The manifest names this reference, but the workspace no longer has it.",
}

const NO_REGISTRY_NOTE = "No export read. Export components to generate."

const MISSING_VIEW_NOTE = "This reference is not in the export yet. Export again to write it."

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
 *
 * `status` is taken rather than assumed, because an empty binding means two different
 * things. A ref nothing drives reads the same as a ref whose files were never read,
 * and only the read knows which.
 */
export function describeBinding(
  binding: RefBinding | null,
  status: RefBindingsStatus,
): BindingDescription {
  if (!binding) {
    return { viewNote: null, note: null, views: [], controllers: [] }
  }

  const views = binding.views.map(describeView)
  const controllers = binding.consumers.map(describeConsumer)

  return {
    viewNote: getViewNote(views.length, status),
    note: getNote(binding, controllers.length, status),
    views,
    controllers,
  }
}

/**
 * Why the views section is empty.
 *
 * The registry is what names a view, so a missing one answers for the section before
 * the ref does. With a registry in hand the ref is genuinely absent from it, which
 * means the export predates the ref.
 */
function getViewNote(viewCount: number, status: RefBindingsStatus): string | null {
  if (viewCount > 0) return null
  if (!status.hasRegistry) return NO_REGISTRY_NOTE

  return MISSING_VIEW_NOTE
}

/**
 * Why the controllers section reads the way it does.
 *
 * A read problem wins over the binding state, and shows even when consumers are
 * listed. Two files that disagree on their target still report consumers, and those
 * consumers may belong to another project, so the warning has to reach a card that
 * looks complete.
 *
 * A read that produced no manifest reports why through `problem`, so the state note
 * speaks for a manifest that was read and simply names no consumer.
 */
function getNote(
  binding: RefBinding,
  controllerCount: number,
  status: RefBindingsStatus,
): string | null {
  if (status.problem) return status.problem
  if (controllerCount > 0) return null

  return STATE_NOTES[binding.state] ?? null
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

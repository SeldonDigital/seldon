import { getComponentSchema } from "../../../components/catalog"
import { ComponentId } from "../../../components/constants"
import { Unit, ValueType } from "../../../properties"
import { isPlaygroundContainer } from "../../model/playground"
import { formatNodeCatalog, parseNodeCatalog } from "../../model/template-ref"
import type { ComponentTreeRef, EntryNode, Workspace } from "../../types"
import { playgroundSandboxNodeId } from "../components/entry-node-ids"

/** Horizontal gap between auto-placed sandboxes, in px. */
const SANDBOX_PLACEMENT_GAP = 40

/**
 * Safety cap for sandbox position offsets and sizes. The canvas is the infinite
 * shared editor surface, so there is no real boundary, but magnitudes beyond this
 * guard against runaway values from agents or hand-edited files.
 */
export const SANDBOX_MAX_MAGNITUDE = 100000

/** Explicit rectangle of a sandbox on the canvas, in px. */
export interface SandboxRect {
  top: number
  left: number
  width: number
  height: number
}

/** Whether a node templates directly from the Sandbox catalog schema. */
export function isSandboxNode(node: Pick<EntryNode, "template">): boolean {
  const parsed = parseNodeCatalog(node.template)
  return (
    parsed?.kind === "catalog" && parsed.componentId === ComponentId.SANDBOX
  )
}

/** Returns the Sandbox root ids listed by a playground container. */
export function getPlaygroundSandboxIds(
  workspace: Workspace,
  playgroundKey: string,
): string[] {
  const playground = workspace.playgrounds?.[playgroundKey]
  if (!playground || !isPlaygroundContainer(playground)) return []
  return playground.variants.map((ref) => ref.id)
}

/** Finds the playground key whose Sandbox root list includes this node id. */
export function findPlaygroundKeyForSandbox(
  workspace: Workspace,
  sandboxId: string,
): string | null {
  for (const [key, playground] of Object.entries(workspace.playgrounds ?? {})) {
    if (playground.variants.some((ref) => ref.id === sandboxId)) return key
  }
  return null
}

/** Reads an absolute px length from an atomic value, or null when not absolute. */
function toAbsolutePx(value: unknown): number | null {
  if (!value || typeof value !== "object") return null
  const atomic = value as { type?: string; value?: unknown }
  if (atomic.type !== ValueType.EXACT) return null
  const inner = atomic.value as { value?: unknown; unit?: unknown } | null
  if (!inner || typeof inner !== "object") return null
  if (typeof inner.value !== "number") return null
  if (inner.unit === Unit.PX) return inner.value
  if (inner.unit === Unit.REM) return inner.value * 16
  return null
}

/** Whether a width/height value is an explicit length (not Fit, Fill, or theme). */
export function isExplicitSizeValue(value: unknown): boolean {
  return (
    !!value &&
    typeof value === "object" &&
    (value as { type?: string }).type === ValueType.EXACT
  )
}

/**
 * Resolves a Sandbox node's rectangle from its explicit overrides layered over
 * the Sandbox schema defaults. Returns null when width or height is not an
 * absolute px/rem length, since overlap cannot be computed in that case.
 */
export function resolveSandboxRect(node: EntryNode): SandboxRect | null {
  const schema = getComponentSchema(ComponentId.SANDBOX)
  const defaults = schema.properties as Record<string, unknown>
  const overrides = node.overrides as Record<string, unknown>

  const width = toAbsolutePx(overrides.width ?? defaults.width)
  const height = toAbsolutePx(overrides.height ?? defaults.height)
  if (width === null || height === null) return null

  const posOverride = overrides.position as Record<string, unknown> | undefined
  const posDefault = defaults.position as Record<string, unknown> | undefined
  const top = toAbsolutePx(posOverride?.top ?? posDefault?.top) ?? 0
  const left = toAbsolutePx(posOverride?.left ?? posDefault?.left) ?? 0

  return { top, left, width, height }
}

/**
 * Computes the top offset for the next Sandbox so it sits below every existing
 * sandbox in the container, with {@link SANDBOX_PLACEMENT_GAP} between them.
 * Returns 0 when the container has no resolvable sandboxes yet.
 */
export function getNextSandboxTop(
  variants: ComponentTreeRef[],
  nodes: Record<string, EntryNode | undefined>,
): number {
  let nextTop = 0
  for (const ref of variants) {
    const node = nodes[ref.id]
    if (!node) continue
    const rect = resolveSandboxRect(node)
    if (!rect) continue
    nextTop = Math.max(nextTop, rect.top + rect.height + SANDBOX_PLACEMENT_GAP)
  }
  return nextTop
}

/** Sets a Sandbox node's `position.top` override to an absolute px value. */
export function setSandboxTop(node: EntryNode, top: number): void {
  const overrides = node.overrides as Record<string, unknown>
  const position =
    (overrides.position as Record<string, unknown> | undefined) ?? {}
  position.top = { type: ValueType.EXACT, value: { value: top, unit: Unit.PX } }
  overrides.position = position
}

/**
 * Builds a Sandbox root node for a playground. The node is a `type: "variant"`
 * templating from `catalog:sandbox`, seeded at `top`/`left`. Width and height
 * come from the Sandbox schema defaults (800x600).
 */
export function buildSandboxNode(
  playgroundKey: string,
  position: { top?: number; left?: number } = {},
): { id: string; node: EntryNode } {
  const { top = 0, left = 0 } = position
  const id = playgroundSandboxNodeId(playgroundKey)
  const node: EntryNode = {
    id,
    type: "variant",
    level: "frame",
    label: "Sandbox",
    theme: null,
    template: formatNodeCatalog(ComponentId.SANDBOX),
    overrides: {
      position: {
        top: { type: ValueType.EXACT, value: { value: top, unit: Unit.PX } },
        left: { type: ValueType.EXACT, value: { value: left, unit: Unit.PX } },
      },
    },
    origin: "user",
    __editor: { initialOverrides: {} },
  }
  return { id, node }
}

/** AABB overlap test. Edges that only touch do not count as overlap. */
export function sandboxesOverlap(
  a: SandboxRect | null,
  b: SandboxRect | null,
): boolean {
  if (!a || !b) return false
  return (
    a.left < b.left + b.width &&
    a.left + a.width > b.left &&
    a.top < b.top + b.height &&
    a.top + a.height > b.top
  )
}

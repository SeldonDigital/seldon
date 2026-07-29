import { REFS_REGISTRY_VERSION } from "@seldon/factory/export/shared/generate-refs-registry"

import type {
  RefViewRendersWhen,
  SeldonRefEntry,
  SeldonRefView,
} from "@seldon/factory/export/shared/generate-refs-registry"

/**
 * Reads a `refs/registry.json` from a linked project folder.
 *
 * The export writes this file, but by the time the editor reads it back it has
 * been sitting in someone else's repository, so it gets the same treatment as the
 * binding manifest: every field checked, text clamped, collections capped, and a
 * bad entry dropped and counted.
 *
 * Entries come back as a map, because a crafted key such as `__proto__` assigned
 * into a plain object would reach a prototype.
 */

const MAX_REFS = 2000
const MAX_VIEWS_PER_REF = 200
const MAX_TEXT_LENGTH = 500

const RENDERS_WHEN = new Set<string>(["unless-null", "when-passed"])

export interface ValidatedRegistry {
  framework: string
  refs: Map<string, SeldonRefEntry>
  /** Entries that failed a check. A count above zero means the file is suspect. */
  droppedEntries: number
}

export type RegistryResult =
  | { ok: true; registry: ValidatedRegistry }
  | { ok: false; reason: string }

export function readRefsRegistry(text: string): RegistryResult {
  let parsed: unknown

  try {
    parsed = JSON.parse(text)
  } catch {
    return { ok: false, reason: "The refs registry is not valid JSON." }
  }

  if (!isRecord(parsed)) {
    return { ok: false, reason: "The refs registry is not an object." }
  }

  if (parsed.version !== REFS_REGISTRY_VERSION) {
    return {
      ok: false,
      reason: `The refs registry was written for format ${String(parsed.version)}, and this editor reads format ${REFS_REGISTRY_VERSION}. Export again.`,
    }
  }

  const framework = readText(parsed.framework)

  if (!framework) {
    return { ok: false, reason: "The refs registry does not name the target that wrote it." }
  }

  const dropped = { count: 0 }

  return {
    ok: true,
    registry: {
      framework,
      refs: readRefs(parsed.refs, dropped),
      droppedEntries: dropped.count,
    },
  }
}

interface DroppedCounter {
  count: number
}

function readRefs(value: unknown, dropped: DroppedCounter): Map<string, SeldonRefEntry> {
  const refs = new Map<string, SeldonRefEntry>()

  if (!isRecord(value)) return refs

  for (const [ref, entry] of Object.entries(value)) {
    if (refs.size >= MAX_REFS) break

    if (!isUsableKey(ref)) {
      dropped.count += 1
      continue
    }

    const read = readEntry(entry, dropped)

    if (read) {
      refs.set(ref, read)
    } else {
      dropped.count += 1
    }
  }

  return refs
}

function readEntry(value: unknown, dropped: DroppedCounter): SeldonRefEntry | null {
  if (!isRecord(value)) return null

  const nodeId = readText(value.nodeId)

  if (!nodeId) return null

  return {
    component: readText(value.component) ?? "",
    nodeId,
    className: readText(value.className) ?? "",
    views: readViews(value.views, dropped),
  }
}

function readViews(value: unknown, dropped: DroppedCounter): SeldonRefView[] {
  if (!Array.isArray(value)) return []

  const views: SeldonRefView[] = []

  for (const entry of value) {
    if (views.length >= MAX_VIEWS_PER_REF) break

    const view = readView(entry)

    if (view) {
      views.push(view)
    } else {
      dropped.count += 1
    }
  }

  return views
}

function readView(value: unknown): SeldonRefView | null {
  if (!isRecord(value)) return null

  const component = readText(value.component)
  const file = readText(value.file)

  if (!component || !file) return null

  return {
    component,
    file,
    // A null slot is meaningful: the node is that component's own root.
    slot: readText(value.slot) ?? null,
    type: readText(value.type) ?? "",
    rendersWhen: readRendersWhen(value.rendersWhen),
  }
}

/**
 * Falls back to `when-passed` for an unreadable value, which is the cautious
 * reading. It tells a user an override alone may not render the slot, rather than
 * promising it will.
 */
function readRendersWhen(value: unknown): RefViewRendersWhen {
  if (typeof value === "string" && RENDERS_WHEN.has(value)) {
    return value as RefViewRendersWhen
  }

  return "when-passed"
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function isUsableKey(key: string): boolean {
  return key.length > 0 && key.length <= MAX_TEXT_LENGTH
}

function readText(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined

  const trimmed = value.trim()

  if (trimmed.length === 0) return undefined

  return trimmed.length > MAX_TEXT_LENGTH ? `${trimmed.slice(0, MAX_TEXT_LENGTH)}\u2026` : trimmed
}

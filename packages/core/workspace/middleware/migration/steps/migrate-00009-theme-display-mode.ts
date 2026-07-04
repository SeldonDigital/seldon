import type { EntryTheme } from "../../../model/entry-theme"
import type { Workspace } from "../../../model/workspace"

/**
 * v9: move `mode`, `chromaChange`, and `lightnessChange` overrides from the
 * `colorHarmony` group into the new `displayMode` group.
 *
 * Stock themes now author these three fields under `displayMode`, so a theme
 * entry with its own overrides for them must relocate those overrides to the
 * matching group. Fields the entry never overrode resolve from the stock
 * template chain and need no change.
 */

const MOVED_KEYS = ["mode", "chromaChange", "lightnessChange"] as const

/** Reads a group's `parameters` record from an entry's overrides, if any. */
function overrideParameters(
  entry: EntryTheme,
  group: string,
): Record<string, unknown> | undefined {
  const groupOverride = entry.overrides[group]
  if (!groupOverride || typeof groupOverride !== "object") return undefined
  const parameters = (groupOverride as Record<string, unknown>).parameters
  if (!parameters || typeof parameters !== "object") return undefined
  return parameters as Record<string, unknown>
}

/** True when an entry has a moved key under its `colorHarmony` overrides. */
function entryNeedsMove(entry: EntryTheme): boolean {
  const parameters = overrideParameters(entry, "colorHarmony")
  if (!parameters) return false
  return MOVED_KEYS.some((key) => parameters[key] !== undefined)
}

function migrationApplies(workspace: Workspace): boolean {
  return Object.values(workspace.themes).some(entryNeedsMove)
}

export function migrateV9ThemeDisplayMode(workspace: Workspace): Workspace {
  if (!migrationApplies(workspace)) return workspace

  const next = structuredClone(workspace)

  for (const entry of Object.values(next.themes)) {
    if (!entryNeedsMove(entry)) continue

    const overrides = entry.overrides
    const colorHarmony = overrides.colorHarmony as Record<string, unknown>
    const harmonyParameters = colorHarmony.parameters as Record<string, unknown>

    const displayMode = (overrides.displayMode ??= {}) as Record<
      string,
      unknown
    >
    const displayModeParameters = (displayMode.parameters ??= {}) as Record<
      string,
      unknown
    >

    for (const key of MOVED_KEYS) {
      if (harmonyParameters[key] === undefined) continue
      displayModeParameters[key] = harmonyParameters[key]
      delete harmonyParameters[key]
    }

    // Drop now-empty containers so a moved override never leaves a bare
    // `colorHarmony.parameters` shell behind.
    if (Object.keys(harmonyParameters).length === 0) {
      delete colorHarmony.parameters
    }
    if (Object.keys(colorHarmony).length === 0) {
      delete overrides.colorHarmony
    }
  }

  return next
}

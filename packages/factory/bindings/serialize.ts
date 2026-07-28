import type { BindingsManifest, RefConsumer, SlotConsumer } from "./types"

/**
 * Serializes a manifest to the `bindings.json` text.
 *
 * Keys are sorted and consumers are ordered by file then line, so re-running the
 * scan on unchanged sources produces a byte-identical file. That is what lets a
 * committed manifest be diffed in review and checked for drift in CI.
 */
export function serializeBindings(manifest: BindingsManifest): string {
  const ordered = {
    version: manifest.version,
    framework: manifest.framework,
    scannedFiles: manifest.scannedFiles,
    refs: orderRefs(manifest.refs),
    slots: orderSlots(manifest.slots),
  }

  return `${JSON.stringify(ordered, null, 2)}\n`
}

function orderRefs(refs: Record<string, RefConsumer[]>): Record<string, RefConsumer[]> {
  const ordered: Record<string, RefConsumer[]> = {}

  for (const ref of Object.keys(refs).sort()) {
    ordered[ref] = refs[ref].slice().sort(byFileThenLine)
  }

  return ordered
}

function orderSlots(
  slots: Record<string, Record<string, SlotConsumer[]>>,
): Record<string, Record<string, SlotConsumer[]>> {
  const ordered: Record<string, Record<string, SlotConsumer[]>> = {}

  for (const component of Object.keys(slots).sort()) {
    const bySlot: Record<string, SlotConsumer[]> = {}

    for (const slot of Object.keys(slots[component]).sort()) {
      bySlot[slot] = slots[component][slot].slice().sort(byFileThenLine)
    }

    ordered[component] = bySlot
  }

  return ordered
}

function byFileThenLine(a: { file: string; line: number }, b: { file: string; line: number }) {
  const byFile = a.file.localeCompare(b.file)

  return byFile !== 0 ? byFile : a.line - b.line
}

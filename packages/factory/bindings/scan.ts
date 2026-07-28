import { isScannablePath } from "./config"
import { scanReactFile } from "./react/scan-react"
import { scanVueFile } from "./vue/scan-vue"

import type {
  BindingsConfig,
  BindingsManifest,
  FileBindings,
  FileSource,
  RefConsumer,
  SlotConsumer,
} from "./types"

/** Bumped when the emitted shape changes, so a reader can reject an old manifest. */
export const BINDINGS_VERSION = 1

/**
 * Scans a project for the refs and slots its code drives on generated components.
 *
 * The scan reads through a {@link FileSource}, so it runs the same way from Node,
 * from a browser directory handle, and from a fixture. Files are routed by
 * extension, and a file that fails to parse is skipped with a warning rather than
 * aborting the run, matching how the export isolates per-file failures.
 */
export async function scanBindings(
  source: FileSource,
  config: BindingsConfig,
): Promise<BindingsManifest> {
  const paths = (await source.list()).filter((path) => isScannablePath(path, config)).sort()

  const refs: Record<string, RefConsumer[]> = {}
  const slots: Record<string, Record<string, SlotConsumer[]>> = {}

  let scannedFiles = 0

  for (const path of paths) {
    const scan = getFrontEnd(path)

    if (!scan) continue

    try {
      const text = await source.read(path)
      const bindings = scan(path, text, config)

      scannedFiles += 1
      collect(bindings, refs, slots)
    } catch (error) {
      console.warn(`Failed to scan "${path}":`, error)
    }
  }

  return {
    version: BINDINGS_VERSION,
    framework: config.framework,
    scannedFiles,
    refs,
    slots,
  }
}

type FrontEnd = (path: string, text: string, config: BindingsConfig) => FileBindings

function getFrontEnd(path: string): FrontEnd | null {
  if (path.endsWith(".vue")) return scanVueFile
  if (path.endsWith(".ts") || path.endsWith(".tsx")) return scanReactFile

  return null
}

function collect(
  bindings: FileBindings,
  refs: Record<string, RefConsumer[]>,
  slots: Record<string, Record<string, SlotConsumer[]>>,
) {
  for (const { ref, consumer } of bindings.refs) {
    const consumers = refs[ref] ?? []

    consumers.push(consumer)
    refs[ref] = consumers
  }

  for (const { component, slot, consumer } of bindings.slots) {
    const bySlot = slots[component] ?? {}
    const consumers = bySlot[slot] ?? []

    consumers.push(consumer)
    bySlot[slot] = consumers
    slots[component] = bySlot
  }
}

/*****
 *
 * This code was generated using Seldon (https://github.com/SeldonDigital/seldon)
 *
 * License: https://github.com/SeldonDigital/seldon/blob/main/LICENSE.md
 * Do not redistribute or sublicense without permission.
 *
 * You may not use this software, or any derivative works of it, in whole or in part,
 * for the purposes of training, fine-tuning, or otherwise improving (directly or indirectly)
 * any machine learning or artificial intelligence system without written permission.
 *
 *****/

import { isScannablePath } from "./config.mjs"
import { BINDINGS_VERSION } from "./version.mjs"

/**
 * Scans a project for the refs and slots its code drives on generated components.
 *
 * The scan reads through a {@link FileSource}, so it runs the same way from Node,
 * from a browser directory handle, and from a fixture. Files are routed by
 * extension, and a file that fails to parse is skipped with a warning rather than
 * aborting the run, matching how the export isolates per-file failures.
 */
export async function scanBindings(source, config) {
  const paths = (await source.list()).filter((path) => isScannablePath(path, config)).sort()
  const refs = {}
  const slots = {}
  const warnings = []
  let scannedFiles = 0
  for (const path of paths) {
    const scan = await getFrontEnd(path)
    if (!scan) continue
    try {
      const text = await source.read(path)
      const bindings = scan(path, text, config)
      scannedFiles += 1
      collect(bindings, refs, slots)
      warnings.push(...bindings.warnings)
    } catch (error) {
      console.warn(`Failed to scan "${path}":`, error)
    }
  }
  return {
    version: BINDINGS_VERSION,
    mode: "full",
    framework: config.framework,
    scannedFiles,
    refs,
    slots,
    warnings,
  }
}
/**
 * Loads a front end the first time a file needs it, so a project only pays for
 * the parser its own files call for. A project with no `.vue` files never loads
 * the Vue compiler, which is what lets the scan run against `typescript` alone.
 *
 * A React export ships no Vue front end, so in that copy the `.vue` branch points
 * at a file that is not there. Nothing reaches it, because a React config treats
 * no `.vue` path as scannable and the extensions are fixed at export.
 */
async function getFrontEnd(path) {
  if (path.endsWith(".vue")) {
    return (await import("./scan-vue.mjs")).scanVueFile
  }
  if (path.endsWith(".ts") || path.endsWith(".tsx")) {
    return (await import("./scan-typescript.mjs")).scanTypeScriptFile
  }
  return null
}
function collect(bindings, refs, slots) {
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

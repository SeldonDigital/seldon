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

/**
 * Serializes a manifest to the `bindings.json` text.
 *
 * Keys are sorted and consumers are ordered by file then line, so re-running the
 * scan on unchanged sources produces a byte-identical file. That is what lets a
 * committed manifest be diffed in review and checked for drift in CI.
 */
export function serializeBindings(manifest) {
  const ordered = {
    version: manifest.version,
    mode: manifest.mode,
    framework: manifest.framework,
    scannedFiles: manifest.scannedFiles,
    refs: orderRefs(manifest.refs),
    slots: orderSlots(manifest.slots),
  }
  return `${JSON.stringify(ordered, null, 2)}\n`
}
function orderRefs(refs) {
  const ordered = {}
  for (const ref of Object.keys(refs).sort()) {
    ordered[ref] = refs[ref].slice().sort(byFileThenLine)
  }
  return ordered
}
function orderSlots(slots) {
  const ordered = {}
  for (const component of Object.keys(slots).sort()) {
    const bySlot = {}
    for (const slot of Object.keys(slots[component]).sort()) {
      bySlot[slot] = slots[component][slot].slice().sort(byFileThenLine)
    }
    ordered[component] = bySlot
  }
  return ordered
}
function byFileThenLine(a, b) {
  const byFile = a.file.localeCompare(b.file)
  return byFile !== 0 ? byFile : a.line - b.line
}

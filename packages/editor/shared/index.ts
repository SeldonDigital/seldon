/**
 * Public entry for the embeddable editor library. It re-exports the
 * framework-neutral export and storage helpers a host embeds. The React and Vue
 * apps import the deeper `lib/*` modules directly through their own aliases; this
 * barrel is the stable surface the `@seldon/foundation` bundle re-exports.
 */
export { writeExportToDirectory, pickExportDirectory } from "./lib/export/write-export-to-directory"
export { DEFAULT_COMPONENTS_FOLDER } from "./lib/export/constants"
export { getExportTarget, saveExportTarget } from "./lib/storage/export-target-store"

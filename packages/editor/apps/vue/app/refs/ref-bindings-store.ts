import { readBindingsManifest } from "@seldon/editor/lib/refs/read-bindings-manifest"
import { readRefsRegistry } from "@seldon/editor/lib/refs/read-refs-registry"
import {
  getLinkPermission,
  getProjectLink,
  readLinkedTextFile,
  requestLinkPermission,
} from "@seldon/editor/lib/storage/project-link-store"
import { defineStore } from "pinia"
import { ref } from "vue"

import type { ValidatedBindings } from "@seldon/editor/lib/refs/read-bindings-manifest"
import type { ValidatedRegistry } from "@seldon/editor/lib/refs/read-refs-registry"
import type { ProjectLink } from "@seldon/editor/lib/storage/project-link-store"

/** Both files sit under the linked components folder. */
const REGISTRY_PATH = "refs/registry.json"
const MANIFEST_PATH = "refs/bindings.json"

/**
 * What was read from the linked project, held once for the whole editor.
 *
 * A store rather than component state, because the sidebar and the canvas overlay
 * show the same bindings. Reading costs a directory permission that a browser only
 * grants during a gesture, so one load has to serve every surface.
 *
 * Mirrors the React `use-ref-bindings` store.
 */
export const useRefBindingsStore = defineStore("ref-bindings", () => {
  const workspaceId = ref<string | null>(null)
  const registry = ref<ValidatedRegistry | null>(null)
  const bindings = ref<ValidatedBindings | null>(null)
  const problem = ref<string | null>(null)
  const loading = ref(false)

  /**
   * Reads the refs registry and the binding manifest from the linked folder.
   *
   * Call this from a user gesture. A browser only re-grants a directory permission
   * during one, and the permission is requested here when it has lapsed.
   *
   * Returns whether both arrived. A partial read still keeps what it got: the
   * registry alone describes every view, which is worth showing even when no
   * manifest has been written yet.
   */
  async function load(id: string): Promise<boolean> {
    const link = await getProjectLink(id)

    workspaceId.value = id

    if (!link) {
      problem.value = "No exported folder is linked to this workspace yet."

      return false
    }

    loading.value = true

    try {
      if (!(await hasReadPermission(link))) {
        problem.value = "Reading the linked folder needs permission."

        return false
      }

      const registryText = await readLinkedTextFile(link, REGISTRY_PATH)

      if (registryText === null) {
        problem.value = "No refs registry found in the linked folder. Export again to write one."

        return false
      }

      const registryResult = readRefsRegistry(registryText)

      if (!registryResult.ok) {
        registry.value = null
        bindings.value = null
        problem.value = registryResult.reason

        return false
      }

      registry.value = registryResult.registry

      const manifestText = await readLinkedTextFile(link, MANIFEST_PATH)

      if (manifestText === null) {
        bindings.value = null
        problem.value =
          "No binding manifest found. Run the bindings script in your project to write one."

        return false
      }

      const manifestResult = readBindingsManifest(manifestText)

      if (!manifestResult.ok) {
        bindings.value = null
        problem.value = manifestResult.reason

        return false
      }

      bindings.value = manifestResult.bindings
      problem.value = getFrameworkMismatch(registryResult.registry, manifestResult.bindings)

      return true
    } finally {
      loading.value = false
    }
  }

  /** Drops what was read, so nothing from one project shows against another. */
  function clear(): void {
    registry.value = null
    bindings.value = null
    problem.value = null
  }

  return { workspaceId, registry, bindings, problem, loading, load, clear }
})

/**
 * Loads the bindings for a workspace outside a component, which is where the menu
 * item and the shortcut both turn the overlay on from.
 */
export function loadRefBindings(workspaceId: string): Promise<boolean> {
  return useRefBindingsStore().load(workspaceId)
}

/** Asks for the folder permission only when the standing grant has lapsed. */
async function hasReadPermission(link: ProjectLink): Promise<boolean> {
  if ((await getLinkPermission(link)) === "granted") return true

  return (await requestLinkPermission(link)) === "granted"
}

/**
 * The two files should describe one project. When they disagree on the target,
 * the manifest was scanned somewhere other than where the export was written, so
 * the consumers on screen may belong to another app.
 */
function getFrameworkMismatch(
  registry: ValidatedRegistry,
  bindings: ValidatedBindings,
): string | null {
  if (registry.framework === bindings.framework) return null

  return `The export targeted ${registry.framework} but the manifest scanned ${bindings.framework}. They may describe different projects.`
}

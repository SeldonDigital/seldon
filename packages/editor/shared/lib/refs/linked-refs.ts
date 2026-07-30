/**
 * The files a linked components folder reports through, and what to say when one
 * of them is missing.
 *
 * Both editor apps read the same two files and end on the same failures, so the
 * wording lives here rather than once per app, where two copies drift apart.
 *
 * Each problem names the action that fixes it. Linking fixes the first two, so
 * they point at the menu command. The export writes the registry and the
 * bindings script writes the manifest, so those point at the step that writes
 * them rather than at linking again.
 */

/** Both files sit under the linked components folder. */
export const REGISTRY_PATH = "refs/registry.json"

export const MANIFEST_PATH = "refs/bindings.json"

export const NOT_LINKED_PROBLEM = "Not linked. Use File > Link Workspace."

export const NEEDS_PERMISSION_PROBLEM = "Linked folder needs permission. Use File > Link Workspace."

export const NO_REGISTRY_PROBLEM =
  "No refs registry found in the linked folder. Export again to write one."

export const NO_MANIFEST_PROBLEM = "Missing bindings manifest. Run `npm run bindings` to generate."

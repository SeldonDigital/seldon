/**
 * Bumped when the emitted manifest shape changes, so a reader can reject an old
 * manifest.
 *
 * This sits alone in a module with no imports on purpose. Both scan modules and
 * the export need it, and reaching it through `scan.ts` would pull the parser
 * front ends into every graph that reads the version.
 */
export const BINDINGS_VERSION = 1

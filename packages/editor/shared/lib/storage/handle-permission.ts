/**
 * Permission on a stored directory handle.
 *
 * A handle survives a reload through structured clone but its grant does not, so
 * a stored handle comes back reporting `prompt` and stays dormant until a gesture
 * re-grants it. Reading and writing are separate grants, so the mode is always
 * explicit at the call site.
 */

export type HandlePermissionMode = "read" | "readwrite"

/**
 * `queryPermission` and `requestPermission` are not in the DOM lib types, so the
 * handle is widened where they are called, the same way the directory picker is.
 */
type HandleWithPermission = FileSystemDirectoryHandle & {
  queryPermission?: (descriptor: { mode: HandlePermissionMode }) => Promise<PermissionState>
  requestPermission?: (descriptor: { mode: HandlePermissionMode }) => Promise<PermissionState>
}

/**
 * Current grant, without prompting. A browser that hands out directory handles
 * without the permission methods has nothing to gate, so it counts as granted.
 */
export async function queryHandlePermission(
  directory: FileSystemDirectoryHandle,
  mode: HandlePermissionMode,
): Promise<PermissionState> {
  const handle = directory as HandleWithPermission

  if (!handle.queryPermission) return "granted"

  try {
    return await handle.queryPermission({ mode })
  } catch {
    return "denied"
  }
}

/**
 * Asks for access. Browsers only allow this during a user gesture, so call it
 * from an interaction rather than on load.
 */
export async function requestHandlePermission(
  directory: FileSystemDirectoryHandle,
  mode: HandlePermissionMode,
): Promise<PermissionState> {
  const handle = directory as HandleWithPermission

  if (!handle.requestPermission) return "granted"

  try {
    return await handle.requestPermission({ mode })
  } catch {
    return "denied"
  }
}

/** Grant for `mode`, asking only when the standing grant has lapsed. */
export async function ensureHandlePermission(
  directory: FileSystemDirectoryHandle,
  mode: HandlePermissionMode,
): Promise<boolean> {
  if ((await queryHandlePermission(directory, mode)) === "granted") return true

  return (await requestHandlePermission(directory, mode)) === "granted"
}

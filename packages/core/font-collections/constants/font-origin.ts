/**
 * Where a font family loads from.
 *
 * - `local` renders from fonts already on the device and never makes a network request.
 * - `remote` may load from a font host such as Google Fonts.
 */
export type FontOrigin = "local" | "remote"

/** Named `FontOrigin` values for use in authored collections and checks. */
export const FontOriginValue = {
  LOCAL: "local",
  REMOTE: "remote",
} as const satisfies Record<string, FontOrigin>

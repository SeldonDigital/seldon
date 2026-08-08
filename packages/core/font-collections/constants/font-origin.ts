/**
 * Where a font family loads from.
 *
 * - `local` renders from fonts already on the device and never makes a network request.
 * - `remote` may load from Google Fonts.
 * - `fontshare` may load from Fontshare (Indian Type Foundry).
 *
 * `remote` and `fontshare` are both self-hosted for the canvas: their woff2 files are
 * materialized into the editor's local font cache, and export emits the matching font
 * host link.
 */
export type FontOrigin = "local" | "remote" | "fontshare"

/** Named `FontOrigin` values for use in authored collections and checks. */
export const FontOriginValue = {
  LOCAL: "local",
  REMOTE: "remote",
  FONTSHARE: "fontshare",
} as const satisfies Record<string, FontOrigin>

/** True when a family self-hosts and emits a font host link, as opposed to a local face. */
export function isSelfHostedRemoteOrigin(origin: FontOrigin): boolean {
  return origin === "remote" || origin === "fontshare"
}

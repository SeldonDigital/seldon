/*
 * This code was generated using Seldon (https://seldon.app)
 *
 * Licensed under the Terms of Use: https://seldon.digital/terms-of-service
 * Do not redistribute or sublicense without permission.
 *
 * You may not use this software, or any derivative works of it,
 * in whole or in part, for the purposes of training, fine-tuning,
 * or otherwise improving (directly or indirectly) any machine learning
 * or artificial intelligence system.
 */
import { shouldLoadRemoteFonts } from "@lib/privacy/remote-fonts"
import { getGoogleFontURL } from "@seldon/core"

const EDITOR_FONT_FAMILIES = ["IBM Plex Sans"]

export function Fonts() {
  if (!shouldLoadRemoteFonts()) {
    return null
  }

  return (
    <>
      {EDITOR_FONT_FAMILIES.map((font) => (
        <link key={font} href={getGoogleFontURL(font)} rel="stylesheet" />
      ))}
    </>
  )
}

/*****
 *
 * This code was generated using Seldon (https://seldon.app)
 *
 * Licensed under the Terms of Use: https://seldon.digital/terms-of-service
 * Do not redistribute or sublicense without permission.
 *
 * You may not use this software, or any derivative works of it,
 * in whole or in part, for the purposes of training, fine-tuning,
 * or otherwise improving (directly or indirectly) any machine learning
 * or artificial intelligence system.
 *
 *****/
import { shouldLoadRemoteFont } from "@lib/privacy/remote-fonts"
import { getGoogleFontURL } from "@seldon/core"

const FONT_FAMILIES = [
  "Inter",
  "IBM Plex Sans",
  "IBM Plex Serif",
  "Raleway",
  "Lora",
  "Barlow Condensed",
  "Roboto",
  "Playfair Display",
  "Josefin Sans",
  "Noto Sans",
  "Oswald",
  "Open Sans",
  "Outfit",
  "DM Sans",
  "@fontFamily.primary",
]

export function Fonts() {
  const remoteFonts = FONT_FAMILIES.filter(shouldLoadRemoteFont)

  if (remoteFonts.length === 0) {
    return null
  }

  return (
    <>
      {remoteFonts.map((font) => (
        <link key={font} href={getGoogleFontURL(font)} rel="stylesheet" />
      ))}
    </>
  )
}

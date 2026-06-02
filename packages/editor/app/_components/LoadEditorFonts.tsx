"use client"

import { getRemoteFontUrl } from "@seldon/core"
import { useEditorFonts } from "@lib/hooks/use-editor-fonts"

/** Opt-in flag for loading remote font hosts. System and local fonts never make a request. */
const REMOTE_FONTS_ENABLED =
  process.env.NEXT_PUBLIC_SELDON_ENABLE_REMOTE_FONTS === "true"

export function LoadEditorFonts() {
  const { fonts } = useEditorFonts()

  if (!REMOTE_FONTS_ENABLED) {
    return null
  }

  return (
    <>
      {fonts.map((font) => {
        const url = getRemoteFontUrl(font)
        if (!url) {
          return null
        }
        return <link key={font} href={url} rel="stylesheet" />
      })}
    </>
  )
}

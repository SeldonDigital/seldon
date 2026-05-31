"use client"

import { shouldLoadRemoteFont } from "@lib/privacy/remote-fonts"
import { getGoogleFontURL } from "@seldon/core"
import { useEditorFonts } from "@lib/hooks/use-editor-fonts"

export function LoadEditorFonts() {
  const { fonts } = useEditorFonts()
  const remoteFonts = fonts.filter(shouldLoadRemoteFont)

  if (remoteFonts.length === 0) {
    return null
  }

  return (
    <>
      {remoteFonts.map((font) => {
        return (
          <link key={font} href={getGoogleFontURL(font)} rel="stylesheet" />
        )
      })}
    </>
  )
}

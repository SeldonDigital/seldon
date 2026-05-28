"use client"

import { getGoogleFontURL } from "@seldon/core"
import { useEditorFonts } from "@lib/hooks/use-editor-fonts"

export function LoadEditorFonts() {
  const { fonts } = useEditorFonts()

  return (
    <>
      {fonts.map((font) => {
        return (
          <link key={font} href={getGoogleFontURL(font)} rel="stylesheet" />
        )
      })}
    </>
  )
}

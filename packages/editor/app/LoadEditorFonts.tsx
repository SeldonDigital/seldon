"use client"

import { useMemo } from "react"
import { workspaceFontCollectionService } from "@seldon/core/workspace/services"
import { buildFontFaceCss } from "@lib/font-collections/build-font-face-css"
import { useWorkspace } from "@lib/workspace/hooks/use-workspace"

/**
 * Self-hosts every enabled font-collection family for the canvas. The enabled
 * families' woff2 files are served from `public/font-files`, so this injects a
 * single `@font-face` stylesheet and makes no network request to a font host.
 */
export function LoadEditorFonts() {
  const { workspace } = useWorkspace({ usePreview: false })

  const fontFaceCss = useMemo(() => {
    const families =
      workspaceFontCollectionService.getEnabledRemoteFamilies(workspace)
    return buildFontFaceCss(families)
  }, [workspace])

  if (!fontFaceCss) {
    return null
  }

  return <style>{fontFaceCss}</style>
}

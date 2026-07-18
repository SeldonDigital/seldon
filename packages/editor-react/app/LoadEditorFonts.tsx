"use client"

import { buildFontFaceCss } from "@lib/font-collections/build-font-face-css"
import { useMemo } from "react"
import { workspaceFontCollectionService } from "@seldon/core/workspace/services"
import { useWorkspace } from "@lib/workspace/hooks/use-workspace"
import { Frame } from "@seldon/components/frames/Frame"

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

  return <Frame wrapperElement="style">{fontFaceCss}</Frame>
}

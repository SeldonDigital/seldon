"use client"

import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import { Frame } from "@seldon/components/frames/Frame"
import { buildFontFaceCss } from "@seldon/editor/lib/font-collections/build-font-face-css"
import { useMemo } from "react"

import { workspaceFontCollectionService } from "@seldon/core/workspace/services"

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

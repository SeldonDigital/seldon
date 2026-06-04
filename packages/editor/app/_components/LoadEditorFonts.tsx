"use client"

import { useMemo } from "react"
import { getRemoteFontUrl } from "@seldon/core"
import { workspaceFontCollectionService } from "@seldon/core/workspace/services"
import { useEditorFonts } from "@lib/hooks/use-editor-fonts"
import { useWorkspace } from "@lib/workspace/use-workspace"

/** Opt-in flag for loading remote font hosts. System and local fonts never make a request. */
const REMOTE_FONTS_ENABLED =
  import.meta.env.VITE_SELDON_ENABLE_REMOTE_FONTS === "true"

export function LoadEditorFonts() {
  const { fonts } = useEditorFonts()
  const { workspace } = useWorkspace({ usePreview: false })

  const enabledByFamily = useMemo(
    () => workspaceFontCollectionService.getEnabledVariantsByFamily(workspace),
    [workspace],
  )

  if (!REMOTE_FONTS_ENABLED) {
    return null
  }

  return (
    <>
      {fonts.map((font) => {
        const url = getRemoteFontUrl(font, enabledByFamily[font])
        if (!url) {
          return null
        }
        return <link key={font} href={url} rel="stylesheet" />
      })}
    </>
  )
}

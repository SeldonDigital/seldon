"use client"

import { HTMLImg } from "@seldon/components/native-react/HTML.Img"

import { COMPONENT_PREVIEW_FILES } from "../../../../../../core/components/previews"

import type { ComponentId } from "@seldon/core/components/constants"
import type { CSSProperties } from "react"

const previewModules = import.meta.glob("../../../../../../core/components/previews/*.jpg", {
  eager: true,
  import: "default",
  query: "?url",
}) as Record<string, string>
const previewFiles: Partial<Record<ComponentId, string>> = COMPONENT_PREVIEW_FILES

const imageStyle: CSSProperties = {
  height: "100%",
  objectFit: "contain",
  pointerEvents: "none",
  width: "100%",
}

interface ComponentCatalogPreviewProps {
  componentId: ComponentId
}

export function ComponentCatalogPreview({ componentId }: ComponentCatalogPreviewProps) {
  const filename = previewFiles[componentId]
  const path = filename ? `../../../../../../core/components/previews/${filename}` : undefined
  const src = path ? previewModules[path] : undefined

  if (!src) return null

  return <HTMLImg alt="" draggable={false} src={src} style={imageStyle} />
}

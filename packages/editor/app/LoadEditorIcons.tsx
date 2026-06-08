import { SVGAttributes } from "react"
import { IconId } from "@seldon/core/icon-sets"
import * as CarbonIcons from "@seldon/core/icon-sets/catalog/carbon"
import * as LucideIcons from "@seldon/core/icon-sets/catalog/lucide"
import * as MaterialIcons from "@seldon/core/icon-sets/catalog/material"
import * as SeldonIcons from "@seldon/core/icon-sets/catalog/seldon"
import {
  IconDefault,
  IconSeldonMissing as IconMissing,
} from "@seldon/components/icons"

export type LoadEditorIconsProps = SVGAttributes<SVGSVGElement> & {
  iconId?: IconId
  /**
   * When true the icon's set is in the workspace but the icon is turned off, so
   * it renders as a red Missing icon regardless of whether the id resolves.
   */
  unavailable?: boolean
}

/** Red used for an icon that is turned off in its workspace icon set. */
const UNAVAILABLE_ICON_COLOR = "#E5484D"

/**
 * Dynamically loads icon components from icon sets based on iconId.
 *
 * Supports all icon sets: material, carbon, lucide, seldon
 * Icons are loaded from the index.ts files in core/icon-sets/catalog/{setName}/
 * which contain the top 100 icons for each set.
 *
 * Icon ID format: "{setName}-{iconName}"
 * Example: "material-folderOpen" -> IconMaterialFolderOpen
 *          "carbon-document" -> IconCarbonDocument
 *          "lucide-file" -> IconLucideFile
 *          "seldon-alignTop" -> IconSeldonAlignTop
 */
export function LoadEditorIcons({
  iconId,
  unavailable,
  ...props
}: LoadEditorIconsProps) {
  if (unavailable) {
    return (
      <IconMissing
        {...props}
        style={{ color: UNAVAILABLE_ICON_COLOR, ...props.style }}
      />
    )
  }

  if (!iconId) {
    console.warn(`[LoadEditorIcons] No iconId provided`)
    return <IconMissing {...props} />
  }

  // Handle __default__ icon
  // Note: __default__ is a special icon that lives outside icon sets
  if (iconId === "__default__") {
    return <IconDefault {...props} />
  }

  // Extract icon set prefix (e.g., "material-add" -> "material", "carbon-document" -> "carbon")
  const iconSetMatch = iconId.match(/^(material|carbon|lucide|seldon)-/)
  let Icon: React.ComponentType<SVGAttributes<SVGSVGElement>> | undefined

  // Dynamically import from icon sets index.ts (top 100 icons)
  if (iconSetMatch) {
    const iconSetPrefix = iconSetMatch[1]

    try {
      // Dynamically import the appropriate icon set module
      // Note: Icon set modules export both icon components and arrays (e.g., seldonIconIds)
      // We cast through 'unknown' first to handle the mixed export structure
      let iconModule:
        | Record<
            string,
            React.ComponentType<SVGAttributes<SVGSVGElement>> | undefined
          >
        | undefined
      switch (iconSetPrefix) {
        case "material":
          iconModule = MaterialIcons as unknown as Record<
            string,
            React.ComponentType<SVGAttributes<SVGSVGElement>> | undefined
          >
          break
        case "carbon":
          iconModule = CarbonIcons as unknown as Record<
            string,
            React.ComponentType<SVGAttributes<SVGSVGElement>> | undefined
          >
          break
        case "lucide":
          iconModule = LucideIcons as unknown as Record<
            string,
            React.ComponentType<SVGAttributes<SVGSVGElement>> | undefined
          >
          break
        case "seldon":
          iconModule = SeldonIcons as unknown as Record<
            string,
            React.ComponentType<SVGAttributes<SVGSVGElement>> | undefined
          >
          break
      }

      if (iconModule) {
        // Convert iconId to component name
        // Example: "material-folderOpen" -> "IconMaterialFolderOpen"
        // Example: "carbon-document" -> "IconCarbonDocument"
        // Example: "lucide-file" -> "IconLucideFile"
        // Example: "seldon-alignTop" -> "IconSeldonAlignTop"
        // Example: "seldon-iconSocialFacebook" -> "IconSocialFacebook" (IconSocial* has no Seldon prefix)
        const parts = iconId.split("-")
        const setPrefix = parts[0] // "material", "carbon", "lucide", or "seldon"
        const iconNameParts = parts.slice(1) // ["folderOpen"], ["document"], etc.

        // Capitalize set prefix: "material" -> "Material", "carbon" -> "Carbon", etc.
        const capitalizedSetPrefix =
          setPrefix.charAt(0).toUpperCase() + setPrefix.slice(1)

        // Capitalize each part of icon name: "folderOpen" -> "FolderOpen", "alignTop" -> "AlignTop"
        const capitalizedIconName = iconNameParts
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join("")

        let componentName = `Icon${capitalizedSetPrefix}${capitalizedIconName}`

        // Seldon IconSocial* components are exported as IconSocialX, not IconSeldonIconSocialX
        // capitalizedIconName is already "IconSocialFacebook" (capitalized form of "iconSocialFacebook")
        if (
          setPrefix === "seldon" &&
          iconNameParts[0]?.toLowerCase().startsWith("iconsocial")
        ) {
          componentName = capitalizedIconName // e.g. IconSocialFacebook
        }

        // Try to get the icon component from the module
        Icon = iconModule[componentName]
      }
    } catch (error) {
      console.warn(
        `[LoadEditorIcons] Failed to dynamically import icon ${iconId}:`,
        error,
      )
    }
  }

  if (!Icon) {
    console.warn(`[LoadEditorIcons] Icon not found: ${iconId}`)
    return <IconMissing {...props} />
  }

  return <Icon {...props} />
}

import {
  IconDefault,
  IconSeldonMissing as IconMissing,
} from "@seldon/components/icons"
import { SVGAttributes } from "react"

import { IconId } from "@seldon/core/icon-sets"
import * as CarbonIcons from "@seldon/core/icon-sets/catalog/carbon"
import * as CarbonIconsAll from "@seldon/core/icon-sets/catalog/carbon/index-all"
import * as LucideIcons from "@seldon/core/icon-sets/catalog/lucide"
import * as LucideIconsAll from "@seldon/core/icon-sets/catalog/lucide/index-all"
import * as MaterialIcons from "@seldon/core/icon-sets/catalog/material"
import * as MaterialIconsAll from "@seldon/core/icon-sets/catalog/material/index-all"
import * as SeldonIcons from "@seldon/core/icon-sets/catalog/seldon"
import * as SeldonIconsAll from "@seldon/core/icon-sets/catalog/seldon/index-all"

/**
 * A workspace icon id chosen by the user (a `symbol` property value).
 *
 * `LoadEditorIcons` resolves ids against every set's full catalog, so it must
 * only ever receive a user-selected symbol, never a hardcoded editor-chrome id.
 * The brand makes feeding a plain `IconId` a compile error: callers mint a
 * `SymbolIconId` through `asSymbolIconId`, which marks the value as a symbol on
 * purpose. Render chrome icons with `<Icon>` instead.
 */
export type SymbolIconId = IconId & { readonly __symbol: unique symbol }

/** Marks a symbol property value as a `SymbolIconId` for `LoadEditorIcons`. */
export function asSymbolIconId(
  value: string | null | undefined,
): SymbolIconId | undefined {
  return (value ?? undefined) as SymbolIconId | undefined
}

export type LoadEditorIconsProps = SVGAttributes<SVGSVGElement> & {
  iconId?: SymbolIconId
  /**
   * When true the icon's set is in the workspace but the icon is turned off, so
   * it renders as a red Missing icon regardless of whether the id resolves.
   */
  unavailable?: boolean
}

/** Red used for an icon that is turned off in its workspace icon set. */
const UNAVAILABLE_ICON_COLOR = "#E5484D"

type IconModule = Record<
  string,
  React.ComponentType<SVGAttributes<SVGSVGElement>> | undefined
>

/** Merges a set's full catalog with its curated index. The curated index wins
 * so its alias exports keep working. */
function mergeIconModules(all: object, curated: object): IconModule {
  return { ...all, ...curated } as unknown as IconModule
}

/**
 * Icon components per set keyed by icon-id prefix and export name. Each set
 * resolves against its full catalog (index-all.ts), so every shipped icon
 * renders regardless of what its stock set enables. Built once at module scope
 * because the icon set board renders thousands of icons. A future set needs
 * one entry here with its index-all and index modules.
 */
const ICON_MODULES_BY_PREFIX: Record<string, IconModule> = {
  material: mergeIconModules(MaterialIconsAll, MaterialIcons),
  carbon: mergeIconModules(CarbonIconsAll, CarbonIcons),
  lucide: mergeIconModules(LucideIconsAll, LucideIcons),
  seldon: mergeIconModules(SeldonIconsAll, SeldonIcons),
}

/**
 * Dynamically loads icon components from icon sets based on iconId.
 *
 * Supports all icon sets: material, carbon, lucide, seldon
 * Every set resolves against its full catalog via `ICON_MODULES_BY_PREFIX`,
 * so any icon a set can enable renders on the canvas.
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

  const id: string = iconId

  // Handle __default__ icon
  // Note: __default__ is a special icon that lives outside icon sets
  if (id === "__default__") {
    return <IconDefault {...props} />
  }

  // Extract icon set prefix (e.g., "material-add" -> "material", "carbon-document" -> "carbon")
  const iconSetPrefix = id.split("-")[0]
  const iconModule = ICON_MODULES_BY_PREFIX[iconSetPrefix]
  let Icon: React.ComponentType<SVGAttributes<SVGSVGElement>> | undefined

  if (iconModule) {
    // Convert iconId to component name
    // Example: "material-folderOpen" -> "IconMaterialFolderOpen"
    // Example: "carbon-document" -> "IconCarbonDocument"
    // Example: "lucide-file" -> "IconLucideFile"
    // Example: "seldon-alignTop" -> "IconSeldonAlignTop"
    // Example: "seldon-iconSocialFacebook" -> "IconSocialFacebook" (IconSocial* has no Seldon prefix)
    const iconNameParts = id.split("-").slice(1) // ["folderOpen"], ["document"], etc.

    // Capitalize set prefix: "material" -> "Material", "carbon" -> "Carbon", etc.
    const capitalizedSetPrefix =
      iconSetPrefix.charAt(0).toUpperCase() + iconSetPrefix.slice(1)

    // Capitalize each part of icon name: "folderOpen" -> "FolderOpen", "alignTop" -> "AlignTop"
    const capitalizedIconName = iconNameParts
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("")

    let componentName = `Icon${capitalizedSetPrefix}${capitalizedIconName}`

    // Seldon IconSocial* components are exported as IconSocialX, not IconSeldonIconSocialX
    // capitalizedIconName is already "IconSocialFacebook" (capitalized form of "iconSocialFacebook")
    if (
      iconSetPrefix === "seldon" &&
      iconNameParts[0]?.toLowerCase().startsWith("iconsocial")
    ) {
      componentName = capitalizedIconName // e.g. IconSocialFacebook
    }

    Icon = iconModule[componentName]
  }

  if (!Icon) {
    console.warn(`[LoadEditorIcons] Icon not found: ${id}`)
    return <IconMissing {...props} />
  }

  return <Icon {...props} />
}

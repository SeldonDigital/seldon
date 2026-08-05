import { IconDefault, IconSeldonMissing as IconMissing } from "@seldon/components/icons"

import { getIconData } from "@seldon/core/icon-sets/data"
import * as SeldonIcons from "@seldon/core/icon-sets/catalog/seldon"
import * as SeldonIconsAll from "@seldon/core/icon-sets/catalog/seldon/index-all"

import type { IconId } from "@seldon/core/icon-sets"
import type { SVGAttributes } from "react"

/**
 * A workspace icon id chosen by the user (a `symbol` property value).
 *
 * `LoadEditorIcons` resolves ids against every set, so it must only ever
 * receive a user-selected symbol, never a hardcoded editor-chrome id. The brand
 * makes feeding a plain `IconId` a compile error: callers mint a `SymbolIconId`
 * through `asSymbolIconId`, which marks the value as a symbol on purpose. Render
 * chrome icons with `<Icon>` instead.
 */
export type SymbolIconId = IconId & { readonly __symbol: unique symbol }

/** Marks a symbol property value as a `SymbolIconId` for `LoadEditorIcons`. */
export function asSymbolIconId(value: string | null | undefined): SymbolIconId | undefined {
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

type IconModule = Record<string, React.ComponentType<SVGAttributes<SVGSVGElement>> | undefined>

/** Merges a set's full catalog with its curated index. The curated index wins
 * so its alias exports keep working. */
function mergeIconModules(all: object, curated: object): IconModule {
  return { ...all, ...curated } as unknown as IconModule
}

/**
 * Icon components for sets that still ship source files, keyed by icon-id
 * prefix. Sets with generated glyph data (`material`, `carbon`, `lucide`)
 * render from {@link getIconData} instead and are absent here. `seldon` resolves
 * against its full catalog (index-all.ts), so every shipped icon renders.
 */
const ICON_MODULES_BY_PREFIX: Record<string, IconModule> = {
  seldon: mergeIconModules(SeldonIconsAll, SeldonIcons),
}

/**
 * Resolves the component name for an icon id in a source-file set.
 *
 * "carbon-document" -> "IconCarbonDocument"
 * "seldon-alignTop" -> "IconSeldonAlignTop"
 * "seldon-iconSocialFacebook" -> "IconSocialFacebook" (IconSocial* has no Seldon infix)
 */
function componentNameForId(id: string, prefix: string): string {
  const nameParts = id.split("-").slice(1)
  const capitalizedPrefix = prefix.charAt(0).toUpperCase() + prefix.slice(1)
  const capitalizedName = nameParts
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("")

  if (prefix === "seldon" && nameParts[0]?.toLowerCase().startsWith("iconsocial")) {
    return capitalizedName
  }

  return `Icon${capitalizedPrefix}${capitalizedName}`
}

/**
 * Renders a user-selected workspace icon by id. Sets with generated data draw
 * their glyph inline; the remaining sets resolve a source-file component.
 */
export function LoadEditorIcons({ iconId, unavailable, ...props }: LoadEditorIconsProps) {
  if (unavailable) {
    const unavailableStyle = { color: UNAVAILABLE_ICON_COLOR, ...props.style }

    return <IconMissing {...props} style={unavailableStyle} />
  }

  if (!iconId) {
    console.warn(`[LoadEditorIcons] No iconId provided`)

    return <IconMissing {...props} />
  }

  const id: string = iconId

  // __default__ is a special icon that lives outside icon sets.
  if (id === "__default__") {
    return <IconDefault {...props} />
  }

  const data = getIconData(iconId)

  if (data) {
    const viewBox = data.viewBox
    const inner = { __html: data.body }

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={viewBox}
        fill="currentColor"
        height="1em"
        width="1em"
        {...props}
        dangerouslySetInnerHTML={inner}
      />
    )
  }

  const iconSetPrefix = id.split("-")[0]
  const iconModule = ICON_MODULES_BY_PREFIX[iconSetPrefix]
  const Icon = iconModule?.[componentNameForId(id, iconSetPrefix)]

  if (!Icon) {
    console.warn(`[LoadEditorIcons] Icon not found: ${id}`)

    return <IconMissing {...props} />
  }

  return <Icon {...props} />
}

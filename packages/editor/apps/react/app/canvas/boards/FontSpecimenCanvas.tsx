"use client"

import { useNodeTheme } from "@app/themes/hooks/use-node-theme"
import { formatResourceItemKey } from "@app/workspace/hooks/use-selection"
import { useStore as useSelectionStore } from "@app/workspace/hooks/use-selection"
import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import { Frame } from "@seldon/components/frames/Frame"
import { Specimen } from "@seldon/components/modules/Specimen"
import { resolveSpecimenThemeLooks } from "@seldon/editor/lib/font-collections/resolve-specimen-theme-looks"
import { getComponentKey } from "@seldon/editor/lib/workspace/workspace-accessors"
import { getCssFromProperties } from "@seldon/factory/styles/css-properties/get-css-from-properties"
import { useMemo } from "react"

import { getNodeProperties } from "@seldon/core/workspace/helpers/nodes/get-node-properties"

import { CssPortal } from "../CssPortal"
import { StyleTag } from "../StyleTag.bespoke"
import { useFontCollectionBoardSpecimens } from "../hooks/use-font-collection-board-specimens"

import type { SpecimenProps } from "@seldon/components/modules/Specimen"
import type { SeldonRefs } from "@seldon/components/utils/merge-slot"
import type { Board } from "@seldon/core"
import type { CSSProperties } from "react"

// Every Specimen text slot is opt-in (`mergeOptionalSlot`), so each must be
// enabled with an empty object to render its default sample content.
const SPECIMEN_TEXT_SLOTS: Partial<SpecimenProps> = {
  textLabel: {},
  textLabel2: {},
  textDescription: {},
  textDescription2: {},
  textDescription3: {},
  textDescription4: {},
  textLabel3: {},
  textLabel4: {},
  textDescription5: {},
  textLabel5: {},
  textLabel6: {},
  textLabel7: {},
  textLabel8: {},
  textLabel9: {},
  textTagline: {},
  textLabel10: {},
  textLabel11: {},
  textCallout: {},
  textLabel12: {},
  textLabel13: {},
  textSubtitle: {},
  textLabel14: {},
  textLabel15: {},
  textTitle: {},
  textLabel16: {},
  textLabel17: {},
  textSubheading: {},
  textLabel18: {},
  textLabel19: {},
  textHeading: {},
  textLabel20: {},
  textLabel21: {},
  textDisplay: {},
}

// Canvas layout only. Background, border, and corners come from the board's own
// component properties through `boardCss`, matching the theme board chrome.
const boardLayoutStyle: CSSProperties = {
  position: "static",
  display: "flex",
  flexDirection: "column",
  flexWrap: "nowrap",
  alignItems: "stretch",
  minHeight: "100%",
  padding: "2rem",
}

/**
 * Font collection canvas: a single Type Specimen driven by the selected family
 * row (falling back to the collection's first family).
 *
 * The board is a selection target with its own component properties and theme,
 * mirroring the theme board chrome. The theme owns the look: every level renders
 * with the style, size, weight, and line height its `@font.*` token resolves to,
 * and the `*Spec` labels state those resolved values. The selected family is
 * applied only to the sample content (all `*Preview` refs and the glyph block)
 * by scoping `font-family`, so a family renders through the theme's looks.
 */
export function FontSpecimenCanvas({ board }: { board: Board }) {
  const { workspace } = useWorkspace()
  const boardKey = getComponentKey(board)
  const className = `board-${boardKey}`
  const properties = getNodeProperties(board, workspace)
  const boardTheme = useNodeTheme(board)
  const specimens = useFontCollectionBoardSpecimens(board)
  const selectedResourceItemKey = useSelectionStore((state) => state.selectedResourceItemKey)

  const keyed = useMemo(
    () =>
      specimens.map((specimen) => ({
        specimen,
        key: formatResourceItemKey({
          resource: "font-collection",
          boardKey,
          entryId: specimen.entryId,
          slot: specimen.slot,
        }),
      })),
    [specimens, boardKey],
  )

  const matched = keyed.find((entry) => entry.key === selectedResourceItemKey)
  const active = matched ?? keyed[0]

  if (!active) return null

  const boardCss = getCssFromProperties(
    properties,
    {
      theme: boardTheme ?? undefined,
      properties,
      parentContext: null,
    },
    className,
  )

  const scopeClass = `font-specimen-${boardKey}`.replace(/[^a-zA-Z0-9_-]/g, "-")
  const themeLooks = resolveSpecimenThemeLooks(boardTheme, scopeClass)

  const { family, weightsLabel } = active.specimen
  const fontValue = family.stack ?? family.name

  const familyCss = `.${scopeClass} [data-seldon-ref$="Preview"],
.${scopeClass} [data-seldon-ref="typeSpecimenName"],
.${scopeClass} [data-seldon-ref="typeSpecimenUppercase"],
.${scopeClass} [data-seldon-ref="typeSpecimenLowercase"],
.${scopeClass} [data-seldon-ref="typeSpecimenNumbers"] {
  font-family: ${fontValue} !important;
}`
  const css = `${familyCss}\n${themeLooks.previewCss}`

  const seldonRefs: SeldonRefs = { typeSpecimenName: { children: family.name } }

  if (weightsLabel) {
    seldonRefs.typeSpecimenFamilySizes = { children: weightsLabel }
  }

  for (const [ref, value] of Object.entries(themeLooks.specs)) {
    seldonRefs[ref] = { children: value }
  }

  return (
    <>
      <CssPortal>
        <StyleTag css={boardCss} />
      </CssPortal>
      <Frame data-board-id={boardKey} className={className} style={boardLayoutStyle}>
        <StyleTag css={css} />
        <div className={scopeClass}>
          <Specimen {...SPECIMEN_TEXT_SLOTS} seldonRefs={seldonRefs} />
        </div>
      </Frame>
    </>
  )
}

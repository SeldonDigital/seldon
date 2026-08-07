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

// Platform font for an excluded (not installed) family, matching the app body
// fallback in globals.css so the preview reads in whatever the OS provides.
const SYSTEM_FONT_STACK = "system-ui, sans-serif"

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

// Marks a specimen rendered in the stacked board view, where only the preview
// block and its hr show. Scoped CSS keys off this class.
const COMPACT_SPECIMEN_CLASS = "font-specimen-compact"

// Stacked specimens (board selected) sit in a column with breathing room; a
// single specimen (family selected) is unaffected.
const stackStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "4rem",
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
  const includedEntries = keyed.filter((entry) => entry.specimen.included)

  // A selected family shows only its own specimen. With the board selected (no
  // family), stack every included family. Fall back to all entries when none is
  // included, so the board never renders empty.
  const activeList = matched
    ? [matched]
    : includedEntries.length > 0
      ? includedEntries
      : keyed

  if (activeList.length === 0) return null

  // No family selection means the board itself is in view: stack a compact
  // preview per family. A family selection shows that one specimen in full.
  const isStacked = !matched

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

  const slotClassFor = (slot: string) => `${scopeClass}-${slot}`.replace(/[^a-zA-Z0-9_-]/g, "-")

  // Each specimen scopes its own font-family (or the platform font when
  // excluded) through a per-slot class on its Specimen root. The board theme
  // still drives every level's size, weight, and line height for all of them.
  const familyCss = activeList
    .map(({ specimen }) => {
      const { family, included } = specimen
      const fontValue = included ? (family.stack ?? family.name) : SYSTEM_FONT_STACK
      const slotClass = slotClassFor(specimen.slot)

      return `.${slotClass} [data-seldon-ref$="Preview"],
.${slotClass} [data-seldon-ref="typeSpecimenName"],
.${slotClass} [data-seldon-ref="typeSpecimenUppercase"],
.${slotClass} [data-seldon-ref="typeSpecimenLowercase"],
.${slotClass} [data-seldon-ref="typeSpecimenNumbers"] {
  font-family: ${fontValue} !important;
}`
    })
    .join("\n")

  // The specimen labels are `TextLabel` primitives, which dim to 0.8 on hover
  // and active. On this static specimen that reads as an interactive affordance,
  // so hold them at full opacity within the specimen scope.
  const suppressHoverCss = `.${scopeClass} .sdn-text-label:hover,
.${scopeClass} .sdn-text-label:active {
  opacity: 1;
}`

  // With the board selected we stack a compact preview per family: only the
  // `typeSpecimenPreview` block (name + glyphs) and the `hr` below it. Every
  // per-level row is a direct child with its own ref, so hiding refed direct
  // children leaves the preview frame and the ref-less hr in place. A single
  // selected family keeps the full specimen.
  const compactCss = isStacked
    ? `.${scopeClass} .${COMPACT_SPECIMEN_CLASS} > [data-seldon-ref]:not([data-seldon-ref="typeSpecimenPreview"]) {
  display: none;
}`
    : ""
  const css = `${familyCss}\n${compactCss}\n${suppressHoverCss}\n${themeLooks.previewCss}`

  const buildSpecimenRefs = (specimen: (typeof activeList)[number]["specimen"]): SeldonRefs => {
    const refs: SeldonRefs = { typeSpecimenName: { children: specimen.family.name } }

    if (!specimen.included) {
      // The weights line states the family is not installed, in the negative color.
      refs.typeSpecimenFamilySizes = {
        children: "Not Included",
        style: { color: "var(--sdn-swatch-negative)" },
      }
    } else if (specimen.weightsLabel) {
      refs.typeSpecimenFamilySizes = { children: specimen.weightsLabel }
    }

    for (const [ref, value] of Object.entries(themeLooks.specs)) {
      refs[ref] = { children: value }
    }

    return refs
  }

  const specimenNodes = activeList.map(({ specimen, key }) => {
    const specimenClass = isStacked
      ? `${slotClassFor(specimen.slot)} ${COMPACT_SPECIMEN_CLASS}`
      : slotClassFor(specimen.slot)

    return (
      <Specimen
        key={key}
        className={specimenClass}
        {...SPECIMEN_TEXT_SLOTS}
        seldonRefs={buildSpecimenRefs(specimen)}
      />
    )
  })

  return (
    <>
      <CssPortal>
        <StyleTag css={boardCss} />
      </CssPortal>
      <Frame data-board-id={boardKey} className={className} style={boardLayoutStyle}>
        <StyleTag css={css} />
        <div className={scopeClass} style={stackStyle}>
          {specimenNodes}
        </div>
      </Frame>
    </>
  )
}

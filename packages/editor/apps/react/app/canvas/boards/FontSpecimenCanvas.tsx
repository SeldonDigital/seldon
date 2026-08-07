"use client"

import { formatResourceItemKey, useSelectionActions } from "@app/workspace/hooks/use-selection"
import { useStore as useSelectionStore } from "@app/workspace/hooks/use-selection"
import { Frame } from "@seldon/components/frames/Frame"
import { Specimen } from "@seldon/components/modules/Specimen"
import { getComponentKey } from "@seldon/editor/lib/workspace/workspace-accessors"
import { useEffect, useMemo } from "react"

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

const containerStyle: CSSProperties = {
  position: "static",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  minHeight: "100%",
  padding: "2rem",
}

// The board is a fixed-width framing device only. It carries no selection id, so
// it never draws a selection overlay and is not a canvas selection target.
const boardStyle: CSSProperties = {
  position: "static",
  width: "800px",
  background: "var(--sdn-swatch-white)",
  border: "var(--sdn-border-width-small) solid color-mix(in srgb, var(--sdn-swatch-black) 12%, transparent)",
  padding: "2rem",
}

/**
 * Font collection canvas: a single Type Specimen driven by the selected family
 * row (falling back to the collection's first family). The selected family is
 * applied only to the sample content (all `*Preview` refs and the glyph block)
 * by scoping `font-family`, so the rest of the specimen keeps the editor theme.
 */
export function FontSpecimenCanvas({ board }: { board: Board }) {
  const boardKey = getComponentKey(board)
  const specimens = useFontCollectionBoardSpecimens(board)
  const selectedResourceItemKey = useSelectionStore((state) => state.selectedResourceItemKey)
  const { selectResourceItem } = useSelectionActions()

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

  // Auto-select the collection's first family when nothing under this board is
  // selected yet, so the tree highlight and the canvas specimen stay in sync.
  useEffect(() => {
    if (!matched && keyed[0]) {
      selectResourceItem(keyed[0].key)
    }
  }, [matched, keyed, selectResourceItem])

  if (!active) return null

  const { family, weightsLabel } = active.specimen
  const fontValue = family.stack ?? family.name

  const scopeClass = `font-specimen-${boardKey}`.replace(/[^a-zA-Z0-9_-]/g, "-")
  const css = `.${scopeClass} [data-seldon-ref$="Preview"],
.${scopeClass} [data-seldon-ref="typeSpecimenName"],
.${scopeClass} [data-seldon-ref="typeSpecimenUppercase"],
.${scopeClass} [data-seldon-ref="typeSpecimenLowercase"],
.${scopeClass} [data-seldon-ref="typeSpecimenNumbers"] {
  font-family: ${fontValue} !important;
}`

  const seldonRefs: SeldonRefs = { typeSpecimenName: { children: family.name } }

  if (weightsLabel) {
    seldonRefs.typeSpecimenFamilySizes = { children: weightsLabel }
  }

  return (
    <Frame data-board-id={boardKey} style={containerStyle}>
      <StyleTag css={css} />
      <Frame style={boardStyle}>
        <div className={scopeClass}>
          <Specimen {...SPECIMEN_TEXT_SLOTS} seldonRefs={seldonRefs} />
        </div>
      </Frame>
    </Frame>
  )
}

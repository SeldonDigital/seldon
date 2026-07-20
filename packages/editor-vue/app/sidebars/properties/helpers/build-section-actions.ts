import type { MenuEntry } from "@app/menus/types"
import {
  getAllowedBorderSides,
  getPropertiesSubjectId,
} from "@seldon/editor/lib/properties/inspector/properties-data"
import { getComponentKey } from "@seldon/editor/lib/workspace/workspace-accessors"

import {
  type Board,
  type BorderSideKey,
  type Instance,
  type LayeredPaintKey,
  type Variant,
  type Workspace,
  getBorderSideOptions,
} from "@seldon/core"
import { getLayerAddOptions } from "@seldon/core/properties/helpers/layer-add-options"
import { isBoard } from "@seldon/core/workspace/helpers/components/is-board"

import type { PropertySection } from "../types"

interface SectionActionsDeps {
  section: PropertySection
  node: Variant | Instance | Board
  workspace: Workspace
  cssStrings: string[]
  cssSelector: string | null
  inEditingContext: boolean
  shownBorderSides: Set<BorderSideKey>
  toggleBorderSide: (subjectId: string, side: BorderSideKey) => void
  dispatch: (action: unknown) => void
  addToast: (message: string) => void
}

async function copyText(
  text: string,
  addToast: (m: string) => void,
  label: string,
) {
  try {
    await navigator.clipboard.writeText(text)
    addToast(`${label} copied to clipboard`)
  } catch (error) {
    console.error("Failed to copy to clipboard:", error)
  }
}

/**
 * Builds a category header's actions menu: Copy CSS/Selector on the CSS section,
 * board commands on a board's attributes, and Add layer on the section that owns
 * each layered paint property. Vue port of the React `TreeSection` action logic
 * (border-side visibility is not yet wired).
 */
export function buildSectionActions({
  section,
  node,
  workspace,
  cssStrings,
  cssSelector,
  inEditingContext,
  shownBorderSides,
  toggleBorderSide,
  dispatch,
  addToast,
}: SectionActionsDeps): MenuEntry[] | undefined {
  // Board attributes: apply this board to all, and reset the board.
  if (isBoard(node) && section.properties.some((p) => p.key === "board")) {
    const boardKey = getComponentKey(node)
    return [
      {
        id: "apply-to-all-boards",
        label: "Apply to All Boards",
        onSelect: () => {
          const confirmed = window.confirm(
            "Apply this board's properties and theme to all other component boards? This overwrites their board setup.",
          )
          if (!confirmed) return
          dispatch({
            type: "apply_component_properties_to_all_boards",
            payload: { sourceBoardKey: boardKey },
          })
        },
        testId: "board-apply-to-all",
      },
      "separator",
      {
        id: "reset-board",
        label: "Reset Board",
        onSelect: () => {
          const confirmed = window.confirm(
            "Reset this board's properties and theme to their defaults?",
          )
          if (!confirmed) return
          dispatch({ type: "reset_component_board", payload: { boardKey } })
        },
        testId: "board-reset",
      },
    ]
  }

  // CSS section: copy declarations or the full rule.
  if (section.category === "css" && cssStrings.length > 0) {
    const actions: MenuEntry[] = [
      {
        id: "copy-css",
        label: "Copy CSS",
        onSelect: () => void copyText(cssStrings.join("\n"), addToast, "CSS"),
        testId: "copy-css",
      },
    ]
    if (cssSelector) {
      actions.push({
        id: "copy-selector",
        label: "Copy Selector",
        onSelect: () => {
          const rule = `${cssSelector} {\n${cssStrings
            .map((declaration) => `  ${declaration}`)
            .join("\n")}\n}`
          void copyText(rule, addToast, "Selector")
        },
        testId: "copy-selector",
      })
    }
    return actions
  }

  // Appearance section: Add layer for each exposed layered paint property, then
  // Show/Hide for each border side when the section owns the `border` row.
  if (!inEditingContext && !isBoard(node)) {
    const layeredKeys: LayeredPaintKey[] = ["background", "shadow"]
    const exposed = layeredKeys.filter((key) =>
      section.properties.some(
        (property) => property.key === key && property.status !== "not used",
      ),
    )
    const layerEntries: MenuEntry[] = []
    for (const key of exposed) {
      for (const option of getLayerAddOptions(key)) {
        if (option.separatorBefore && layerEntries.length > 0) {
          layerEntries.push("separator")
        }
        layerEntries.push({
          id: option.id,
          label: option.label,
          onSelect: () =>
            dispatch({
              type: "add_node_layer",
              payload: {
                nodeId: (node as Variant | Instance).id,
                property: key,
                seed: option.seed,
              },
            }),
          testId: option.id,
        })
      }
    }

    const borderEntries: MenuEntry[] = []
    if (section.properties.some((property) => property.key === "border")) {
      const subjectId = getPropertiesSubjectId(node)
      const allowed = new Set(getAllowedBorderSides(node, workspace))
      for (const option of getBorderSideOptions()) {
        const isAllowed = allowed.has(option.side)
        const isShown = shownBorderSides.has(option.side)
        borderEntries.push({
          id: option.id,
          label: `${isShown ? "Hide" : "Show"} ${option.label}`,
          disabled: !isAllowed,
          onSelect: isAllowed
            ? () => toggleBorderSide(subjectId, option.side)
            : undefined,
          testId: option.id,
        })
      }
    }

    const entries: MenuEntry[] =
      layerEntries.length > 0 && borderEntries.length > 0
        ? [...layerEntries, "separator", ...borderEntries]
        : [...layerEntries, ...borderEntries]
    return entries.length > 0 ? entries : undefined
  }

  return undefined
}

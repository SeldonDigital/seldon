import { MouseEvent, useMemo } from "react"
import { ComponentLevel } from "@seldon/core/components/constants"
import { useDialog } from "@lib/hooks/use-dialog"
import { useTool } from "@lib/hooks/use-tool"
import { ButtonIconicProps } from "../../../seldon/elements/ButtonIconic"
import { IconProps } from "../../../seldon/primitives/Icon"
import { BoardSection } from "../../helpers/get-board-sections"
import { useSectionExpansion } from "../../hooks/use-section-expansion"
import { getComponentVariantRootIds } from "@seldon/core/workspace/helpers/components/get-component-variant-root-ids"
import { getComponentKey } from "@lib/workspace/workspace-accessors"
import { useExpansion } from "./use-expansion"
import { useRowToggle } from "./use-row-toggle"

/**
 * Hook that provides state and handlers for rendering a section header in the objects sidebar.
 * Handles section expansion/collapse with support for expanding all descendants (Alt+click).
 *
 * @param section - The board section to render (e.g., "Primitives", "Elements")
 * @returns Object containing label, icon, button props, and toggle handler
 */
export function useRowSection(section: BoardSection) {
  // Expansion state: section-level and node-level expansion
  const { isSectionExpanded, toggleSection } = useSectionExpansion()
  const { expandObjects, collapseObjects, getAllDescendantNodeIds } =
    useExpansion()
  const { openDialog } = useDialog()
  const { setActiveTool } = useTool()

  // Section expansion state
  const isExpanded = isSectionExpanded(
    section.level,
    section.boards.length > 0,
  )

  // Event handlers: toggle section with Alt+click support for all descendants
  const onToggle = useRowToggle({
    expandedId: section.level,
    isExpanded,
    toggle: (level, expanded) => {
      toggleSection(level as ComponentLevel, expanded)
    },
    expandObjects,
    collapseObjects,
    getAllIdsForAltClick: () => {
      const allIds: string[] = []
      section.boards.forEach((board) => {
        allIds.push(getComponentKey(board))
        const variantRootIds = getComponentVariantRootIds(board)
        variantRootIds.forEach((variantId) => {
          allIds.push(variantId)
          const descendantIds = getAllDescendantNodeIds(variantId)
          allIds.push(...descendantIds)
        })
      })
      return allIds
    },
    hasChildren: true,
  })

  /**
   * Wraps toggle handler to also toggle section state on Alt+click.
   */
  function onToggleWithSection(event?: MouseEvent<HTMLButtonElement>) {
    if (event?.altKey) {
      const shouldExpand = !isExpanded
      onToggle(event)
      toggleSection(section.level, shouldExpand)
    } else {
      onToggle(event)
    }
  }

  function onToggleSection() {
    toggleSection(section.level, !isExpanded)
  }

  // Icon: changes based on expansion state
  const iconId: IconProps["icon"] = isExpanded
    ? "material-unfoldLess"
    : "material-unfoldMore"

  // Button: toggle button with accessibility attributes
  const buttonIconic2 = {
    onClick: onToggleWithSection,
    "aria-expanded": isExpanded,
    "aria-label": isExpanded ? "Collapse" : "Expand",
  }

  // Add button: opens the add dialog scoped to this section. The Icon Sets and
  // Media resource sections have no add flow, so they get no button.
  const buttonIconic1 = useMemo<ButtonIconicProps | undefined>(() => {
    const level = section.level
    if (level === "ICON_SET" || level === "MEDIA") return undefined

    return {
      onClick: (event) => {
        event.stopPropagation()
        if (level === "THEME") {
          openDialog("add-theme")
        } else if (level === "FONT_COLLECTION") {
          openDialog("add-font-collection")
        } else {
          openDialog("add-board", { level })
        }
        setActiveTool("select")
      },
      "aria-label": "Add",
    }
  }, [section.level, openDialog, setActiveTool])

  return {
    label: section.label,
    icon: iconId,
    buttonIconic1,
    buttonIconic2,
    onToggle: onToggleSection,
  }
}

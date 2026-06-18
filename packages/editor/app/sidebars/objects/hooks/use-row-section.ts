import { MouseEvent, useMemo } from "react"
import { ComponentLevel } from "@seldon/core/components/constants"
import { getBoardVariantRootIds } from "@seldon/core/workspace/helpers/components/get-board-variant-root-ids"
import { useAddRemoveCommands } from "@lib/hooks/commands/use-add-remove-commands"
import { useDialog } from "@lib/hooks/use-dialog"
import { useTool } from "@lib/hooks/use-tool"
import {
  useIsSectionExpanded,
  useSectionExpansion,
} from "../../hooks/use-section-expansion"
import { getComponentKey } from "@lib/workspace/workspace-accessors"
import { IconProps } from "@seldon/components/custom-components"
import { ButtonIconicProps } from "@seldon/components/elements/ButtonIconic"
import { BoardSection } from "../../helpers/get-board-sections"
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
  const { toggleSection } = useSectionExpansion()
  const { expandObjects, collapseObjects, getAllDescendantNodeIds } =
    useExpansion()
  const { openDialog } = useDialog()
  const { setActiveTool } = useTool()
  const { addPlayground } = useAddRemoveCommands()

  // Section expansion state
  const isExpanded = useIsSectionExpanded(section.level)

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
        const variantRootIds = getBoardVariantRootIds(board)
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

  // Disclosure button: leading toggle with accessibility attributes
  const buttonIconic = {
    onClick: onToggleWithSection,
    "aria-expanded": isExpanded,
    "aria-label": isExpanded ? "Collapse" : "Expand",
  }

  // Add button: opens the add dialog scoped to this section. The Media resource
  // section has no add flow, so it gets no button.
  const buttonIconic2 = useMemo<ButtonIconicProps | undefined>(() => {
    const level = section.level
    if (level === "MEDIA") return undefined
    // Frames are not user-creatable boards: the only frame schema is Sandbox,
    // which belongs to playgrounds. Hide the add control on the Frames section.
    if (level === ComponentLevel.FRAME) return undefined

    return {
      onClick: (event) => {
        event.stopPropagation()
        if (level === "THEME") {
          openDialog("add-theme")
        } else if (level === "FONT_COLLECTION") {
          openDialog("add-font-collection")
        } else if (level === "ICON_SET") {
          openDialog("add-icon-set")
        } else if (level === "PLAYGROUND") {
          addPlayground()
        } else {
          openDialog("add-board", { level })
        }
        setActiveTool("select")
      },
      "aria-label": "Add",
    }
  }, [section.level, openDialog, setActiveTool, addPlayground])

  return {
    label: section.label,
    icon: iconId,
    buttonIconic,
    buttonIconic2,
    onToggle: onToggleSection,
  }
}

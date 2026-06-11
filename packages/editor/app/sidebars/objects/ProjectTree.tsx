import { LayoutGroup } from "framer-motion";
import { CSSProperties, Fragment, PointerEvent, RefObject, useCallback } from "react";
import { useSetHoveredId } from "@lib/workspace/hooks/use-object-hover";
import { useSectionExpansion } from "../hooks/use-section-expansion";
import { getSelectionTarget } from "@lib/workspace/selection-target";
import { getComponentKey } from "@lib/workspace/workspace-accessors";
import { Frame } from "@seldon/components/frames/Frame";
import { BoardSection } from "../helpers/get-board-sections";
import { FramerExpandable } from "../shared/FramerExpandable";
import { RowBoard } from "./RowBoard";
import { RowSection } from "./RowSection";
import { RowSectionEmpty } from "./RowSectionEmpty";


interface ProjectTreeProps {
  sections: BoardSection[]
  scrollerRef: RefObject<HTMLDivElement | null>
}

/**
 * ProjectTree renders the workspace structure as a tree of sections, boards, variants, and instances.
 * Receives pre-structured section data and orchestrates rendering using RowSection and RowBoard components.
 */
export function ProjectTree({ sections, scrollerRef }: ProjectTreeProps) {
  const { isSectionExpanded } = useSectionExpansion()
  const setHoveredId = useSetHoveredId()

  const sectionsWithExpansion = sections.map((section) => ({
    section,
    isExpanded: isSectionExpanded(section.level, section.boards.length > 0),
  }))

  // One hover controller for the whole tree: resolve the row under the pointer
  // and publish it to the shared bridge, so the matching canvas object lights up
  // and every row reflects hover without per-row listeners.
  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const target = getSelectionTarget(event.target as Element)
      setHoveredId(target?.id ?? null, target?.kind, target?.rootId)
    },
    [setHoveredId],
  )

  const handlePointerLeave = useCallback(
    () => setHoveredId(null),
    [setHoveredId],
  )

  return (
    <div
      ref={scrollerRef}
      style={styles.scroller}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <Frame style={styles.tree}>
        <LayoutGroup>
          {sectionsWithExpansion.map(({ section, isExpanded }) => (
            <Fragment key={section.label}>
              <RowSection section={section} />
              <FramerExpandable isExpanded={isExpanded}>
                {section.boards.length === 0 ? (
                  <RowSectionEmpty
                    label={`No ${section.label.toLowerCase()}`}
                  />
                ) : (
                  section.boards.map((board) => (
                    <RowBoard
                      key={getComponentKey(board)}
                      board={board}
                      disableReordering
                    />
                  ))
                )}
              </FramerExpandable>
            </Fragment>
          ))}
        </LayoutGroup>
      </Frame>
    </div>
  )
}

const styles: Record<string, CSSProperties> = {
  scroller: {
    flex: 1,
    width: "100%",
    minWidth: 0,
    overflowY: "auto",
    overflowX: "hidden",
    minHeight: 0,
  },
  tree: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    minWidth: 0,
    padding: "0.25rem 0.25rem 0.75rem 0.25rem",
    gap: "var(--sdn-gaps-tight)",
  },
}
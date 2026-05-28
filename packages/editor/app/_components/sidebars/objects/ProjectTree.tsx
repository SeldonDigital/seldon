import { LayoutGroup } from "framer-motion"
import { CSSProperties, Fragment, RefObject } from "react"
import { Frame } from "../../../seldon/frames/Frame"
import { BoardSection } from "../helpers/get-board-sections"
import { useSectionExpansion } from "../helpers/use-section-expansion"
import { FramerExpandable } from "../shared/FramerExpandable"
import { getComponentKey } from "@lib/workspace/workspace-accessors"
import { RowBoard } from "./RowBoard"
import { RowSection } from "./RowSection"

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

  const sectionsWithExpansion = sections.map((section) => ({
    section,
    isExpanded: isSectionExpanded(section.level),
  }))

  return (
    <div ref={scrollerRef} style={styles.scroller}>
      <Frame style={styles.tree}>
        <LayoutGroup>
          {sectionsWithExpansion.map(({ section, isExpanded }) => (
            <Fragment key={section.label}>
              <RowSection section={section} />
              <FramerExpandable isExpanded={isExpanded}>
                {section.boards.map((board) => (
                  <RowBoard key={getComponentKey(board)} board={board} />
                ))}
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
    gap: "0.25rem",
  },
}

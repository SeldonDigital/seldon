import { Board as BoardType } from "@seldon/core/index"
import { Frame } from "@components/seldon/frames/Frame"
import { SectionHeader } from "../ui/SectionHeader"
import { Board } from "./Board"

type SectionProps = {
  label: string
  boards: BoardType[]
  isExpanded: boolean
  onToggle: () => void
}

export const Section = ({
  label,
  boards,
  isExpanded,
  onToggle,
}: SectionProps) => {
  return (
    <Frame style={{ flexDirection: "column" }}>
      <SectionHeader isExpanded={isExpanded} onClick={onToggle}>
        {label}
      </SectionHeader>

      {isExpanded &&
        boards.map((board) => <Board key={board.id} componentId={board.id} />)}
    </Frame>
  )
}

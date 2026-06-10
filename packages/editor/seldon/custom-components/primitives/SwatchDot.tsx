interface SwatchDotProps {
  color: string
  index: number
  isSelected?: boolean
}

/** Overlap each dot except the last; selected rows overlap a little less. */
function getSwatchMarginRight(
  index: number,
  isSelected: boolean,
): string | undefined {
  if (index >= 4) return undefined
  return isSelected ? "-7px" : "-10px"
}

export function SwatchDot({
  color,
  index,
  isSelected = false,
}: SwatchDotProps) {
  return (
    <span
      className="shadow-dieter-rams-button"
      style={{
        zIndex: 5 - index,
        display: "block",
        height: "0.75rem",
        width: "0.75rem",
        borderRadius: "9999px",
        backgroundColor: color,
        marginRight: getSwatchMarginRight(index, isSelected),
      }}
    />
  )
}

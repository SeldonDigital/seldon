interface Position {
  top?: number
  left: number
  right: number
  height: number
  bottom?: number
}

export function calculateIndicatorPosition(
  placement: "before" | "after",
  indentation: number,
): Position {
  // 0.5 rem for the padding-left +
  // 1 rem per level +
  // 0.25 rem for the width of the indicator handle on the left
  const left = (0.5 + 1 * indentation + 0.25) * 16

  const position: Position = {
    left,
    right: 0,
    height: 1,
  }

  if (placement === "before") {
    position.top = -0.5
  } else if (placement === "after") {
    position.bottom = -0.5
  }

  return position
}

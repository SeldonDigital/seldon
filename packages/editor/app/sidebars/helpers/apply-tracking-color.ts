export function applyTrackingColor<T extends { style?: React.CSSProperties }>(
  item: T | undefined,
  property: "color" | "borderColor",
  iconColor: string | undefined,
): T | undefined {
  return iconColor && item
    ? {
        ...item,
        style: { ...item.style, [property]: iconColor },
      }
    : item
}

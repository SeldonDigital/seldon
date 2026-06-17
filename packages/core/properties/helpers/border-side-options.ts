/** The four border sides that can be shown individually in the inspector. */
export type BorderSideKey =
  | "borderTop"
  | "borderRight"
  | "borderBottom"
  | "borderLeft"

/** Ordered list of the per-side border keys. */
export const BORDER_SIDE_KEYS: readonly BorderSideKey[] = [
  "borderTop",
  "borderRight",
  "borderBottom",
  "borderLeft",
]

const BORDER_SIDE_LABELS: Record<BorderSideKey, string> = {
  borderTop: "Top Border",
  borderRight: "Right Border",
  borderBottom: "Bottom Border",
  borderLeft: "Left Border",
}

/** One "Show/Hide border side" menu choice. */
export interface BorderSideOption {
  id: string
  side: BorderSideKey
  /** Bare side label, e.g. "Top Border". The editor prefixes "Show"/"Hide". */
  label: string
}

/**
 * The per-side border options used to build the appearance section menu. The
 * editor renders these without knowing any border specifics.
 */
export function getBorderSideOptions(): BorderSideOption[] {
  return BORDER_SIDE_KEYS.map((side) => ({
    id: `border-side-${side}`,
    side,
    label: BORDER_SIDE_LABELS[side],
  }))
}

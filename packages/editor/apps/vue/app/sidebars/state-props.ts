import type { CSSProperties } from "vue"

/**
 * State-prop builders for objects-sidebar rows, ported from the React
 * `app/views/state-props`. Each returns a plain slot-prop fragment that a row
 * merges into the matching generated slot (icon, input, combobox-field). The
 * generated Vue chrome merges `className` and lets other keys fall through to
 * the DOM leaf, so the same leaf-owned state contract holds in both editors.
 */

/** Editing-field outline for inline rename inputs. */
export const EDITING_OUTLINE = "var(--hairline) solid var(--sdn-swatch-active)"

/**
 * Activated is tint-only in the sidebars: clear the generated input's activated
 * border color so activating a row never shifts layout, leaving edit mode as the
 * only state that outlines a row.
 */
const ACTIVATED_TINT_ONLY: CSSProperties = { borderColor: "transparent" }

/** Field-owned selected state, forwarded through aria on the combobox-field. */
export function buildFieldStateProps({
  selected,
}: {
  selected?: boolean
}): Record<string, boolean | undefined> {
  return { "aria-selected": selected || undefined }
}

/** Dashed base border for a repeat echo row's combobox-field. */
export function buildRepeatFieldStyleProps(isRepeatEcho?: boolean): {
  style?: CSSProperties
} {
  return isRepeatEcho ? { style: { borderStyle: "dashed" } } : {}
}

/** Inert read-only display props for a row's name/value `input` slot. */
export function buildDisplayInputProps(value: string): Record<string, unknown> {
  return { value, readonly: true, style: { pointerEvents: "none" } }
}

/** Leaf-owned editing state: the active-swatch outline on the live input. */
export function buildEditingRefProps(editing?: boolean): {
  style?: CSSProperties
} {
  return editing ? { style: { outline: EDITING_OUTLINE } } : {}
}

/**
 * Merges several state fragments into one slot-prop object. Concatenates every
 * `className`, spreads `style` objects together, and lets later fragments win
 * other keys, so states compose instead of clobbering each other.
 */
export function mergeStateProps(
  ...parts: Array<Record<string, unknown> | undefined>
): Record<string, unknown> {
  const merged: Record<string, unknown> = {}
  const classes: string[] = []
  let style: CSSProperties | undefined
  for (const part of parts) {
    if (!part) continue
    for (const [key, value] of Object.entries(part)) {
      if (key === "className") {
        if (typeof value === "string" && value) classes.push(value)
      } else if (key === "style") {
        if (value) style = { ...style, ...(value as CSSProperties) }
      } else {
        merged[key] = value
      }
    }
  }
  if (classes.length > 0) merged.className = classes.join(" ")
  if (style) merged.style = style
  return merged
}

/** Leaf-owned disabled state, forwarded onto each row leaf ref. */
export function buildDisabledRefProps(disabled?: boolean): {
  "aria-disabled"?: true
} {
  return disabled ? { "aria-disabled": true } : {}
}

/** Leaf-owned activated state (tint-only), forwarded onto each row leaf ref. */
export function buildActivatedRefProps(activated?: boolean): {
  className?: string
  style?: CSSProperties
} {
  return activated
    ? { className: "sdn-state-activated", style: ACTIVATED_TINT_ONLY }
    : {}
}

/** Leaf-owned invalid state, forwarded onto each row leaf ref. */
export function buildInvalidRefProps(invalid?: boolean): {
  "aria-invalid"?: true
} {
  return invalid ? { "aria-invalid": true } : {}
}

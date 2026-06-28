import { CSSProperties, Ref } from "react"
import { InputProps } from "@seldon/components/primitives/Input"

/**
 * Field-owned states for a sidebar row's combobox-field child. The field
 * authors selected, hover, focused, and active, so the row forwards these
 * through aria on the field and the field's own state cascade tints its
 * children. Hover, focus, and active come from real pointer and focus, so they
 * are never set here.
 *
 * Disabled is not field-owned. The combobox-field authors no disabled state, so
 * it never cascades to the row's children. Forward disabled onto the leaf refs
 * with {@link buildDisabledRefProps} instead.
 */
interface RowFieldState {
  selected?: boolean
}

export function buildFieldStateProps({
  selected,
}: RowFieldState): Record<string, boolean | undefined> {
  return {
    "aria-selected": selected || undefined,
  }
}

/**
 * Repeat echo rows carry a dashed field border as a base style. The combobox
 * field draws its border through the `border` shorthand, so every state rule
 * (`:hover`, `[aria-selected]`, `[aria-invalid]`) re-asserts `solid`. An inline
 * `border-style` outranks those author rules while leaving the state color
 * intact, so hover, selected, and invalid all render the dashed border in their
 * own color. Spread the result into the row's `comboboxField` props.
 */
export function buildRepeatFieldStyleProps(isRepeatEcho?: boolean): {
  style?: CSSProperties
} {
  return isRepeatEcho ? { style: { borderStyle: "dashed" } } : {}
}

/**
 * Inert read-only display props for a sidebar value or name `input` slot. The
 * slot shows the resting value and stays inert (`pointerEvents: none`) so row
 * selection, hover, and drag pass through it to the combobox field. Every row
 * family shares this contract, so a new editable row cannot drift from it.
 */
export function buildDisplayInputProps(
  ref: Ref<HTMLInputElement>,
  value: string,
): InputProps & { ref: Ref<HTMLInputElement> } {
  return { ref, value, readOnly: true, style: { pointerEvents: "none" } }
}

/**
 * Leaf-owned editing state. The live `input` slot carries its own
 * `.sdn-state-editing` style (active-swatch outline), so an editing field
 * forwards the class onto its ref. Mirrors {@link buildActivatedRefProps}.
 */
export function buildEditingRefProps(editing?: boolean): {
  className?: string
} {
  return editing ? { className: "sdn-state-editing" } : {}
}

/**
 * Merge several state ref-prop fragments into one slot props object. Object
 * spread overwrites `className`, which silently drops one leaf state when two
 * apply at once (for example a row that is both editing and an override). This
 * concatenates every `className` and lets later fragments win other keys, so
 * the state classes compose instead of clobbering each other.
 */
export function mergeStateProps(
  ...parts: Array<object | undefined>
): Record<string, unknown> {
  const merged: Record<string, unknown> = {}
  const classes: string[] = []
  for (const part of parts) {
    if (!part) continue
    for (const [key, value] of Object.entries(part)) {
      if (key === "className") {
        if (typeof value === "string" && value) classes.push(value)
      } else {
        merged[key] = value
      }
    }
  }
  if (classes.length > 0) merged.className = classes.join(" ")
  return merged
}

/**
 * Leaf-owned disabled state. The combobox-field does not author disabled, so
 * the dimmed look cannot come from the field cascade. Each leaf primitive
 * (icon, input, text-label) carries its own `[aria-disabled]` style, so a
 * dimmed row forwards `aria-disabled` onto every leaf ref it drives. Spread the
 * result into each leaf entry of `seldonRefs`.
 */
export function buildDisabledRefProps(disabled?: boolean): {
  "aria-disabled"?: true
} {
  return disabled ? { "aria-disabled": true } : {}
}

/**
 * Leaf-owned activated state. The combobox-field does not author activated, so
 * it cannot cascade from the field. Each leaf primitive (icon, input,
 * text-label) carries its own `.sdn-state-activated` style, so an activated row
 * forwards the class onto every leaf ref it drives. Spread the result into each
 * leaf entry of `seldonRefs`.
 */
export function buildActivatedRefProps(activated?: boolean): {
  className?: string
} {
  return activated ? { className: "sdn-state-activated" } : {}
}

/**
 * Leaf-owned invalid state. The name label sits outside the combobox-field, so
 * the field's `[aria-invalid]` cascade cannot reach it. Each leaf primitive
 * (icon, input, text-label) carries its own `[aria-invalid]` style, so an
 * invalid row forwards `aria-invalid` onto every leaf ref it drives. Spread the
 * result into each leaf entry of `seldonRefs`.
 */
export function buildInvalidRefProps(invalid?: boolean): {
  "aria-invalid"?: true
} {
  return invalid ? { "aria-invalid": true } : {}
}

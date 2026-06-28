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
  invalid?: boolean
}

export function buildFieldStateProps({
  selected,
  invalid,
}: RowFieldState): Record<string, boolean | undefined> {
  return {
    "aria-selected": selected || undefined,
    "aria-invalid": invalid || undefined,
  }
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

"use client"

import { CSSProperties, MouseEvent, RefObject, useCallback, useRef, useState } from "react"
import {
  ComboboxOptionItem,
  ComboboxPosition,
  OptionIconRender,
  useComboboxPosition,
} from "@lib/menus"
import { ButtonIconicProps } from "@seldon/components/elements/ButtonIconic"

// Fixed panel width for the floating display picker. The trigger is a small
// icon button near the right edge of the row, so the panel is right-aligned to
// it at a comfortable reading width.
const PANEL_WIDTH = 200

interface DisplayPickerInput {
  optionGroups: ComboboxOptionItem[][]
  value: string
  onSelect: (value: string) => void
  resolveIcon: (option?: { value: string; name: string }) => OptionIconRender
}

interface DisplayPickerResult {
  /** Slot props for the row's `nodeDisplay` iconic-button trigger. */
  buttonProps: ButtonIconicProps & { ref: RefObject<HTMLButtonElement | null> }
  /** Props for the floating `ComboboxListbox` value list. */
  listbox: {
    open: boolean
    position: ComboboxPosition
    handleClose: () => void
    onPointerLeave: () => void
    filteredOptions: ComboboxOptionItem[][]
    hasSections: boolean
    value: string
    highlightedValue?: string
    resolveIcon: (option?: { value: string; name: string }) => OptionIconRender
    onSelect: (value: string) => void
    onHighlight: (value: string | undefined) => void
  }
}

const TRIGGER_STYLE: CSSProperties = { position: "relative", zIndex: 10 }

/**
 * Drives the objects-sidebar row Display picker with the same floating
 * `ComboboxListbox` widget the properties Display control uses. Owns the open
 * state, keyboard highlight, and the panel position anchored to the row's
 * Display button.
 */
export function useRowDisplayPicker({
  optionGroups,
  value,
  onSelect,
  resolveIcon,
}: DisplayPickerInput): DisplayPickerResult {
  const [open, setOpen] = useState(false)
  const [highlightedValue, setHighlightedValue] = useState<string | undefined>(
    undefined,
  )
  const buttonRef = useRef<HTMLButtonElement | null>(null)

  // Reuse the shared anchor positioning, then right-align a fixed-width panel to
  // the small icon-button trigger (its own width is too narrow for the list).
  const anchor = useComboboxPosition({ open, frameRef: buttonRef })
  const position: ComboboxPosition = {
    x: anchor.x + anchor.w - PANEL_WIDTH,
    y: anchor.y,
    w: PANEL_WIDTH,
    positionAbove: anchor.positionAbove,
  }

  const handleOpen = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation()
      setHighlightedValue(value)
      setOpen((current) => !current)
    },
    [value],
  )

  const handleClose = useCallback(() => setOpen(false), [])

  const handleSelect = useCallback(
    (next: string) => {
      onSelect(next)
      setOpen(false)
    },
    [onSelect],
  )

  const handlePointerLeave = useCallback(
    () => setHighlightedValue(value),
    [value],
  )

  return {
    buttonProps: {
      ref: buttonRef,
      type: "button",
      "aria-haspopup": "listbox",
      "aria-expanded": open,
      onClick: handleOpen,
      style: TRIGGER_STYLE,
    },
    listbox: {
      open,
      position,
      handleClose,
      onPointerLeave: handlePointerLeave,
      filteredOptions: optionGroups,
      hasSections: true,
      value,
      highlightedValue,
      resolveIcon,
      onSelect: handleSelect,
      onHighlight: setHighlightedValue,
    },
  }
}

/**
 * View-model for the floating option list of a combobox. Renders the generated
 * `Listbox` (its Frame is the positioned surface) with one generated
 * `ListboxOption` per option. Option rows bind through the
 * `optionIcon`/`optionLabel` slot refs when the icon is a plain id, and fall
 * back to children when the icon is a dynamic node the string-based `Icon`
 * slot cannot host.
 *
 * Only functional placement (fixed position, scroll) is applied inline; all
 * appearance comes from the authored component CSS.
 */
import { useInterfaceModeAttribute } from "@lib/chrome/use-interface-mode-attribute"
import { CSSProperties, Fragment, MouseEvent, ReactNode, useRef } from "react"
import { createPortal } from "react-dom"
import { useEditorConfig } from "@lib/hooks/use-editor-config"
import { Backdrop } from "@seldon/components/custom-components"
import { ListboxOption } from "@seldon/components/elements/ListboxOption"
import { Listbox } from "@seldon/components/parts/Listbox"
import { Hr } from "@seldon/components/primitives/Hr"
import { IconProps } from "@seldon/components/primitives/Icon"
import { TextLabel } from "@seldon/components/primitives/TextLabel"
import { ComboboxOptionItem, OptionIconRender } from "./types"

interface Position {
  x: number
  y: number
  w: number
  positionAbove?: boolean
}

interface VMComboboxListboxProps {
  open: boolean
  position: Position
  handleClose: () => void
  onPointerLeave: () => void
  filteredOptions: ComboboxOptionItem[] | ComboboxOptionItem[][]
  hasSections: boolean
  value: string
  highlightedValue?: string
  resolveIcon: (option?: { value: string; name: string }) => OptionIconRender
  onSelect: (value: string) => void
  onHighlight: (value: string | undefined) => void
}

// Keyboard-highlighted option. The class hooks the workspace `Activated` state
// once authored; until then it styles nothing, which is acceptable.
const HIGHLIGHT_CLASS = "sdn-state-activated"

// The option label reuses the generated slot's delta class so the authored
// option state CSS (`:hover`, `[aria-selected]`, `[aria-disabled]`) scopes to it
// on the children path exactly as it does on the slot path.
const OPTION_LABEL_CLASS = "sdn-text-label sdn-text-label--xohb"

const backdropStyle: CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 9,
}

// The portal root only scopes the chrome theme and mode swap; it lays out nothing.
const themeScopeStyle: CSSProperties = { display: "contents" }

export function VMComboboxListbox({
  open,
  position,
  handleClose,
  onPointerLeave,
  filteredOptions,
  hasSections,
  value,
  highlightedValue,
  resolveIcon,
  onSelect,
  onHighlight,
}: VMComboboxListboxProps) {
  const { chromeTheme } = useEditorConfig()
  const listboxRef = useRef<HTMLDivElement>(null)
  useInterfaceModeAttribute(listboxRef)
  if (!open) {
    return null
  }

  const panelStyle: CSSProperties = {
    position: "fixed",
    zIndex: 10,
    top: position.y,
    left: position.x,
    width: position.w,
    maxHeight: "24rem",
    overflowY: "auto",
    ...(position.positionAbove ? { transform: "translateY(-100%)" } : {}),
  }

  function renderOption(option: ComboboxOptionItem): ReactNode {
    if (option.hidden) {
      return null
    }

    const isSelected = option.value.toLowerCase() === value.toLowerCase()
    const isHighlighted = option.value === highlightedValue
    const icon = resolveIcon(option)

    const handleMouseDown = (event: MouseEvent) => {
      if (option.disabled) return
      event.preventDefault()
      onSelect(option.value)
    }
    const handleMouseEnter = () => {
      if (!option.disabled) onHighlight(option.value)
    }

    const common = {
      role: "option",
      "aria-selected": isSelected || undefined,
      "aria-disabled": option.disabled || undefined,
      className: isHighlighted ? HIGHLIGHT_CLASS : undefined,
      onMouseDown: handleMouseDown,
      onMouseEnter: handleMouseEnter,
    }

    if (icon.kind === "iconId") {
      // The generated `ListboxOption` gates its label behind the positional
      // `textLabel` slot (defaulted off), so enabling it with content is what
      // renders the label; `optionLabel`/`optionIcon` refs alone would not.
      const iconSlot = { icon: icon.icon as IconProps["icon"] }
      const textLabelSlot = { children: option.name }
      return (
        <ListboxOption
          key={option.value}
          {...common}
          icon={iconSlot}
          textLabel={textLabelSlot}
        />
      )
    }

    return (
      <ListboxOption key={option.value} {...common}>
        {icon.node}
        <TextLabel className={OPTION_LABEL_CLASS}>{option.name}</TextLabel>
      </ListboxOption>
    )
  }

  const content = hasSections
    ? (filteredOptions as ComboboxOptionItem[][]).map((group, index) => {
        const divider = index > 0 ? <Hr /> : null
        const options = group.map(renderOption)
        return (
          <Fragment key={index}>
            {divider}
            {options}
          </Fragment>
        )
      })
    : (filteredOptions as ComboboxOptionItem[]).map(renderOption)

  return createPortal(
    <div ref={listboxRef} data-theme={chromeTheme} style={themeScopeStyle}>
      <Backdrop onClick={handleClose} style={backdropStyle} />
      <Listbox style={panelStyle} onMouseLeave={onPointerLeave}>
        {content}
      </Listbox>
    </div>,
    document.body,
  )
}

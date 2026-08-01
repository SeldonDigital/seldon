/**
 * View-model for the floating option list of a combobox. Renders the generated
 * `MenuOptions` (its Frame is the positioned surface) with one generated
 * `MenuItemOption` per option. Option rows bind through the `optionIcon`,
 * `optionLabel`, and `optionAnnotation` slot refs when the icon is a plain id,
 * and fall back to children when the icon is a dynamic node the string-based
 * `Icon` slot cannot host.
 *
 * Only functional placement (fixed position, scroll) is applied inline; all
 * appearance comes from the authored component CSS.
 */
import { useEditorConfig } from "@app/editor/hooks/use-editor-config"
import { useResolvedInterfaceMode } from "@app/editor/hooks/use-system-color-scheme"
import { MenuItemOption } from "@seldon/components/elements/MenuItemOption"
import { Frame } from "@seldon/components/frames/Frame"
import { MenuOptions } from "@seldon/components/parts/MenuOptions"
import { Hr } from "@seldon/components/primitives/Hr"
import { TextLabel } from "@seldon/components/primitives/TextLabel"
import { Fragment } from "react"
import { createPortal } from "react-dom"

import type { ComboboxOptionItem, OptionIconRender } from "./types"
import type { IconProps } from "@seldon/components/primitives/Icon"
import type { CSSProperties, MouseEvent, ReactNode } from "react"

interface Position {
  x: number
  y: number
  w: number
  positionAbove?: boolean
}

interface ComboboxOptionsProps {
  open: boolean
  position: Position
  handleClose: () => void
  onPointerLeave: () => void
  filteredOptions: ComboboxOptionItem[] | ComboboxOptionItem[][]
  hasSections: boolean
  value: string
  resolveIcon: (option?: { value: string; name: string }) => OptionIconRender
  onSelect: (value: string) => void
  onHighlight: (value: string | undefined) => void
  highlightedValue?: string
}

// Keyboard-highlighted option. The class hooks the workspace `Activated` state
// once authored; until then it styles nothing, which is acceptable.
const HIGHLIGHT_CLASS = "sdn-state-activated"

// The option label reuses the generated slot's delta class so the authored
// option state CSS (`:hover`, `[aria-selected]`, `[aria-disabled]`) scopes to it
// on the children path exactly as it does on the slot path.
const OPTION_LABEL_CLASS = "sdn-text-label sdn-text-label--xohb"
const OPTION_ANNOTATION_CLASS = "sdn-text-label sdn-text-label--lqmh"

const backdropStyle: CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 9,
}

// The portal root only scopes the chrome theme and mode swap; it lays out nothing.
const themeScopeStyle: CSSProperties = { display: "contents" }

export function ComboboxOptions({
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
}: ComboboxOptionsProps) {
  const { chromeTheme } = useEditorConfig()
  const resolvedMode = useResolvedInterfaceMode()

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

    // Every slot on a menu row is opt-in, so each keeps a positional enabler;
    // without one the slot would not render. The annotation stays off when the
    // option has none.
    const annotationSlot = option.annotation ? {} : undefined

    if (icon.kind === "iconId") {
      // The content reaches every slot by ref name.
      const optionRefs = {
        optionIcon: { icon: icon.icon as IconProps["icon"] },
        optionLabel: { children: option.name },
        optionAnnotation: { children: option.annotation },
      }

      return (
        <MenuItemOption
          key={option.value}
          {...common}
          icon={{}}
          textLabel={{}}
          textLabel2={annotationSlot}
          seldonRefs={optionRefs}
        />
      )
    }

    const annotationNode = option.annotation ? (
      <TextLabel className={OPTION_ANNOTATION_CLASS}>{option.annotation}</TextLabel>
    ) : null

    return (
      <MenuItemOption key={option.value} {...common}>
        {icon.node}
        <TextLabel className={OPTION_LABEL_CLASS}>{option.name}</TextLabel>
        {annotationNode}
      </MenuItemOption>
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
    <Frame data-theme={chromeTheme} data-mode={resolvedMode} style={themeScopeStyle}>
      <Frame onClick={handleClose} style={backdropStyle} />
      <MenuOptions style={panelStyle} onMouseLeave={onPointerLeave}>
        {content}
      </MenuOptions>
    </Frame>,
    document.body,
  )
}

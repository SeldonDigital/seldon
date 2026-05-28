import React, { useState } from "react"
import { HSL } from "@seldon/core"
import { Frame } from "../../../../../seldon/frames/Frame"
import {
  comboboxOptionIconStyle,
  comboboxOptionLabelStyle,
  getOptionFrameStyle,
} from "./combobox-styles"

interface ComboboxOptionProps<ItemT> {
  handleSelect: (value: string) => void
  option: ItemT
  value?: string
  renderIcon?: ((option: ItemT) => React.ReactNode) | React.ReactNode
  hidden?: boolean
  disabled?: boolean
  highlighted?: boolean
  onHighlight?: (value: string) => void
}

const optionHoverBackground = "hsl(0 0% 100% / 0.1)"

export function ComboboxOption<
  ItemT extends { name: string; value: string; color?: HSL; hidden?: boolean },
>({
  handleSelect,
  option,
  value,
  renderIcon,
  hidden,
  disabled,
  highlighted = false,
  onHighlight,
}: ComboboxOptionProps<ItemT>) {
  const [isHovered, setIsHovered] = useState(false)

  const isSelected = option.value.toLowerCase() === value?.toLowerCase()
  const showHighlight = isSelected || highlighted || (isHovered && !disabled)

  const frameStyle: React.CSSProperties = {
    ...getOptionFrameStyle({
      isSelected,
      highlighted,
      disabled,
      hidden,
    }),
    ...(showHighlight && !hidden ? { backgroundColor: optionHoverBackground } : {}),
  }

  return (
    <Frame
      role="option"
      aria-selected={isSelected}
      aria-disabled={disabled}
      onMouseDown={(event) => {
        if (disabled) return
        event.preventDefault()
        handleSelect(option.value)
      }}
      onMouseEnter={() => {
        if (!disabled && !hidden) {
          setIsHovered(true)
          onHighlight?.(option.value)
        }
      }}
      onMouseLeave={() => setIsHovered(false)}
      data-active={isSelected}
      data-disabled={disabled}
      style={frameStyle}
    >
      <span style={comboboxOptionIconStyle}>
        {renderIcon &&
          (typeof renderIcon === "function" ? renderIcon(option) : renderIcon)}
      </span>
      <span style={comboboxOptionLabelStyle}>{option.name}</span>
    </Frame>
  )
}

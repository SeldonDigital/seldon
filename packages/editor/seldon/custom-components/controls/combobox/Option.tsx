import React, { useState } from "react"
import { HSL } from "@seldon/core"
import { Text } from "@seldon/components/custom-components"
import { Frame } from "@seldon/components/frames/Frame"
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
    ...(showHighlight && !hidden
      ? { backgroundColor: optionHoverBackground }
      : {}),
  }

  const handleMouseDown = (event: React.MouseEvent) => {
    if (disabled) return
    event.preventDefault()
    handleSelect(option.value)
  }

  const handleMouseEnter = () => {
    if (!disabled && !hidden) {
      setIsHovered(true)
      onHighlight?.(option.value)
    }
  }

  const handleMouseLeave = () => setIsHovered(false)

  return (
    <Frame
      role="option"
      aria-selected={isSelected}
      aria-disabled={disabled}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-active={isSelected}
      data-disabled={disabled}
      style={frameStyle}
    >
      <Text as="span" style={comboboxOptionIconStyle}>
        {renderIcon &&
          (typeof renderIcon === "function" ? renderIcon(option) : renderIcon)}
      </Text>
      <Text as="span" style={comboboxOptionLabelStyle}>
        {option.name}
      </Text>
    </Frame>
  )
}

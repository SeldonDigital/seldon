import React from "react"
import { ComboboxOption } from "./Option"
import { ComboboxOptionGroup } from "./OptionGroup"

interface ComboOption {
  name: string
  value: string
  hidden?: boolean
  disabled?: boolean
}

interface ComboboxOptionListProps {
  filteredOptions: ComboOption[] | ComboOption[][]
  hasSections: boolean
  value?: string
  highlightedValue?: string
  renderIcon: (option?: { value: string; name: string }) => React.ReactNode
  onSelect: (value: string) => void
  onHighlight: (value: string) => void
}

/**
 * Renders combobox options as either grouped sections or a flat list, keeping
 * the section vs flat branching and option typing out of the control's JSX.
 */
export function ComboboxOptionList({
  filteredOptions,
  hasSections,
  value,
  highlightedValue,
  renderIcon,
  onSelect,
  onHighlight,
}: ComboboxOptionListProps) {
  if (hasSections) {
    const groups = filteredOptions as ComboOption[][]
    return (
      <>
        {groups.map((group, index) => (
          <ComboboxOptionGroup key={index} isLast={index === groups.length - 1}>
            {group.map((option, optionIndex) => (
              <ComboboxOption
                key={`${option.name}-${optionIndex}`}
                option={option}
                value={value}
                renderIcon={renderIcon}
                handleSelect={onSelect}
                hidden={option.hidden}
                disabled={option.disabled}
                highlighted={option.value === highlightedValue}
                onHighlight={onHighlight}
              />
            ))}
          </ComboboxOptionGroup>
        ))}
      </>
    )
  }

  const options = filteredOptions as ComboOption[]
  return (
    <>
      {options.map((option, index) => (
        <ComboboxOption
          key={`${option.name}-${index}`}
          option={option}
          hidden={option.hidden}
          value={value}
          renderIcon={renderIcon}
          handleSelect={onSelect}
          disabled={option.disabled}
          highlighted={option.value === highlightedValue}
          onHighlight={onHighlight}
        />
      ))}
    </>
  )
}

import { cn } from "@lib/utils/cn"
import { Command } from "cmdk"
import React, { useEffect, useRef, useState } from "react"
import { HSL } from "@seldon/core"
import { useComboboxState } from "./hooks/use-combobox-state"
import { InputProps } from "../Input"
import { ComboboxInput } from "./Input"
import { ComboboxOption } from "./Option"
import { ComboboxOptionGroup } from "./OptionGroup"
import { ComboboxOptions } from "./Options"

export interface ComboboxProps<ItemT>
  extends Omit<InputProps, "iconLeft" | "validate"> {
  renderIcon?: ((option?: ItemT) => React.ReactNode) | React.ReactNode
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  triggerClassName?: string
  options: ItemT[] | Array<ItemT[]>
  adornment?: string
  /**
   * Must be supplied if you want to accept custom values
   * If not supplied, the user will not be able to enter custom values
   * But only select the values from the predefined options
   */
  validateCustomValue?: (value: string) => boolean
}

export function Combobox<
  ItemT extends {
    name: string
    value: string
    color?: HSL
    hidden?: boolean
    disabled?: boolean
  },
>({
  value,
  onValueChange,
  options,
  renderIcon,
  validateCustomValue,
  placeholder,
  adornment,
  disabled,
  ...inputProps
}: ComboboxProps<ItemT>) {
  const inputRef = useRef<HTMLInputElement>(null)
  const parentRef = useRef<HTMLDivElement>(null)
  const comboboxRef = useRef<HTMLDivElement>(null)
  const [optionsPosition, setOptionsPosition] = useState({ x: 0, y: 0, w: 0 })
  const {
    open,
    setOpen,
    inputValue,
    setInputValue,
    filteredOptions,
    handleSelect,
    handleInputChange,
    handleSubmitInput,
    flatOptions,
    isValid,
    currentValueOption,
  } = useComboboxState({
    value,
    options,
    onValueChange,
    inputRef,
    validateCustomValue,
  })
  const hasSections = Array.isArray(filteredOptions[0])

  useEffect(() => {
    const option = flatOptions.find((o) => o.value === value)
    setInputValue(option ? option.name : value || "")
  }, [value, flatOptions, setInputValue])

  useEffect(() => {
    if (comboboxRef?.current) {
      const rect = comboboxRef.current.getBoundingClientRect()
      setOptionsPosition({
        x: rect.left,
        y: rect.top + rect.height,
        w: rect.width,
      })
    }
  }, [open])

  return (
    <div ref={comboboxRef}>
      <Command
        className={cn("group relative text-inherit")}
        shouldFilter={false}
        ref={parentRef}
      >
        <div className="relative">
          <ComboboxInput
            inputRef={inputRef}
            inputValue={inputValue}
            handleInputChange={handleInputChange}
            open={open}
            setOpen={setOpen}
            handleSubmit={handleSubmitInput}
            isValid={isValid}
            adornment={adornment}
            placeholder={placeholder}
            disabled={disabled}
            iconLeft={
              renderIcon
                ? typeof renderIcon === "function"
                  ? renderIcon({
                      name: "",
                      value: value ?? "",
                      color: currentValueOption?.color,
                    } as ItemT)
                  : renderIcon
                : undefined
            }
            {...inputProps}
          />
          <ComboboxOptions
            open={open}
            position={optionsPosition}
            handleClose={() => setOpen(false)}
          >
            {hasSections
              ? (filteredOptions as Array<ItemT[]>).map((group, index) => (
                  <ComboboxOptionGroup
                    key={index}
                    isLast={index === filteredOptions.length - 1}
                  >
                    {group.map((option, index) => (
                      <ComboboxOption
                        key={`${option.name}-${index}`}
                        option={option}
                        value={value}
                        renderIcon={renderIcon}
                        handleSelect={handleSelect}
                        hidden={option.hidden}
                        disabled={option.disabled}
                      />
                    ))}
                  </ComboboxOptionGroup>
                ))
              : filteredOptions.map((option, index) => (
                  <ComboboxOption
                    key={`${(option as ItemT).name}-${index}`}
                    option={option as ItemT}
                    hidden={(option as ItemT).hidden}
                    value={value}
                    renderIcon={renderIcon}
                    handleSelect={handleSelect}
                    disabled={(option as ItemT).disabled}
                  />
                ))}
          </ComboboxOptions>
        </div>
      </Command>
    </div>
  )
}

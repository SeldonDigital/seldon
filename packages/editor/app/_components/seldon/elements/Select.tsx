/*
 * This code was generated using Seldon (https://seldon.app)
 *
 * Licensed under the Terms of Use: https://seldon.digital/terms-of-service
 * Do not redistribute or sublicense without permission.
 *
 * You may not use this software, or any derivative works of it,
 * in whole or in part, for the purposes of training, fine-tuning,
 * or otherwise improving (directly or indirectly) any machine learning
 * or artificial intelligence system.
 */
import { SelectHTMLAttributes } from "react"
import { HTMLSelect } from "../native-react/HTML.Select"
import { Option, OptionProps } from "../primitives/Option"

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  className?: string

  optionProps?: OptionProps
  option1Props?: OptionProps
  option2Props?: OptionProps
}

export function Select({
  className = "",
  optionProps,
  option1Props,
  option2Props,
  ...props
}: SelectProps) {
  return (
    <HTMLSelect className={"variant-select-default " + className} {...props}>
      <Option
        {...{ ...seldon.optionProps, ...optionProps }}
        className={
          "seldon-instance child-option-ZTlaPr " +
          (optionProps?.className ?? "")
        }
      />
      <Option
        {...{ ...seldon.option1Props, ...option1Props }}
        className={
          "seldon-instance child-option-_sEIxg " +
          (option1Props?.className ?? "")
        }
      />
      <Option
        {...{ ...seldon.option2Props, ...option2Props }}
        className={
          "seldon-instance child-option-OeOO-1 " +
          (option2Props?.className ?? "")
        }
      />
    </HTMLSelect>
  )
}

const seldon: SelectProps = {
  optionProps: {
    children: "Option 01",
  },
  option1Props: {
    children: "Option 02",
  },
  option2Props: {
    children: "Option 03",
  },
}

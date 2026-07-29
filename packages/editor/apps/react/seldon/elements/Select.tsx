/*****
 *
 * This code was generated using Seldon (https://github.com/SeldonDigital/seldon)
 *
 * License: https://github.com/SeldonDigital/seldon/blob/main/LICENSE.md
 * Do not redistribute or sublicense without permission.
 *
 * You may not use this software, or any derivative works of it, in whole or in part,
 * for the purposes of training, fine-tuning, or otherwise improving (directly or indirectly)
 * any machine learning or artificial intelligence system without written permission.
 *
 *****/

import { SelectHTMLAttributes } from "react"

import { HTMLSelect } from "../native-react/HTML.Select"
import { TextOption, TextOptionProps } from "../primitives/TextOption"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot } from "../utils/merge-slot"

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  textOption?: TextOptionProps | null

  textOption2?: TextOptionProps | null

  textOption3?: TextOptionProps | null
}

//
// Default property values
//
const sdn: SelectProps = {
  "aria-hidden": "false",
  textOption: {
    children: "Option 01",
    className: "sdn-text-option sdn-text-label--yqnd",
  },

  textOption2: {
    children: "Option 02",
    className: "sdn-text-option sdn-text-label--yqnd",
  },

  textOption3: {
    children: "Option 03",
    className: "sdn-text-option sdn-text-label--yqnd",
  },
}

/**
 * Select: Select
 * Level: Element
 * Intent: Dropdown element for choosing a single value from a list of options.
 * Tags: select, dropdown, input, form, element, menu, choice
 * Type: Default
 *
 * Structure:
 *   TextOption  textOption
 *   TextOption  textOption2
 *   TextOption  textOption3
 *
 * @example
 * ```tsx
 * <Select
 *   aria-hidden="false"
 *   textOption="{}"
 *   textOption2="{}"
 *   textOption3="{}"
 * />
 * ```
 */
export function Select({
  className = "",
  textOption,

  textOption2,

  textOption3,

  children,
  seldonRefs,
  ...props
}: SelectProps) {
  const selectClassName = combineClassNames("sdn-select", className)

  const textOptionProps = mergeOptionalSlot(sdn.textOption, textOption, seldonRefs)

  const textOption2Props = mergeOptionalSlot(sdn.textOption2, textOption2, seldonRefs)

  const textOption3Props = mergeOptionalSlot(sdn.textOption3, textOption3, seldonRefs)

  return (
    <HTMLSelect className={selectClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
      {children !== undefined ? (
        children
      ) : (
        <>
          {textOptionProps !== null && <TextOption {...textOptionProps} />}
          {textOption2Props !== null && <TextOption {...textOption2Props} />}
          {textOption3Props !== null && <TextOption {...textOption3Props} />}
        </>
      )}
    </HTMLSelect>
  )
}

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

import { HTMLAttributes } from "react"

import { Select, SelectProps } from "../elements/Select"
import { Frame } from "../frames/Frame"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { TextOption, TextOptionProps } from "../primitives/TextOption"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface FormControlDropdownControlProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  textLabel?: TextLabelProps | null

  select?: SelectProps | null
  textOption?: TextOptionProps | null
  textOption2?: TextOptionProps | null
  textOption3?: TextOptionProps | null
}

//
// Default property values
//
const sdn: FormControlDropdownControlProps = {
  "aria-hidden": "false",
  textLabel: {
    className: "sdn-text-label sdn-text-label--fwkw",
  },

  select: {
    "aria-hidden": "false",
    className: "sdn-select sdn-select--7bom",
  },
  textOption: {
    className: "sdn-text-option sdn-text-label--yqnd",
  },
  textOption2: {
    className: "sdn-text-option sdn-text-label--yqnd",
  },
  textOption3: {
    className: "sdn-text-option sdn-text-label--yqnd",
  },
}

/**
 * Form Control: FormControlDropdownControl
 * Level: Element
 * Intent: Captures plain text input from the user for forms or interactions.
 * Tags: UI, UI control, binary, boolean, checkbox, choice, control, decorated, dropdown, editable, exclusive, field, form, icon, input, menu, options, query, radio, search, select, single choice, text, toggle, user entry
 * Type: Custom
 *
 * Structure:
 *   TextLabel     textLabel
 *   Select        select
 *     TextOption  textOption
 *     TextOption  textOption2
 *     TextOption  textOption3
 *
 * @example
 * ```tsx
 * <FormControlDropdownControl
 *   aria-hidden="false"
 *   textLabel="{}"
 *   select="{}"
 *   textOption="{}"
 *   textOption2="{}"
 *   textOption3="{}"
 * />
 * ```
 */
export function FormControlDropdownControl({
  className = "",
  textLabel,

  select,
  textOption,
  textOption2,
  textOption3,

  children,
  seldonRefs,
  ...props
}: FormControlDropdownControlProps) {
  const formControlDropdownControlClassName = combineClassNames("sdn-form-control", className)

  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)

  const selectProps = mergeSlot(sdn.select, select, seldonRefs)
  const textOptionProps = mergeOptionalSlot(sdn.textOption, textOption, seldonRefs)
  const textOption2Props = mergeOptionalSlot(sdn.textOption2, textOption2, seldonRefs)
  const textOption3Props = mergeOptionalSlot(sdn.textOption3, textOption3, seldonRefs)

  return (
    <Frame
      className={formControlDropdownControlClassName}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    >
      {children !== undefined ? (
        children
      ) : (
        <>
          {textLabelProps !== null && <TextLabel {...textLabelProps} />}
          {selectProps !== null && (
            <Select {...selectProps}>
              {textOptionProps !== null && <TextOption {...textOptionProps} />}
              {textOption2Props !== null && <TextOption {...textOption2Props} />}
              {textOption3Props !== null && <TextOption {...textOption3Props} />}
            </Select>
          )}
        </>
      )}
    </Frame>
  )
}

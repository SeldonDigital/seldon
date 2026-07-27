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

import { Frame } from "../frames/Frame"
import { Input, InputProps } from "../primitives/Input"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface FormControlProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  textLabel?: TextLabelProps | null

  input?: InputProps | null
}

//
// Default property values
//
const sdn: FormControlProps = {
  "aria-hidden": "false",
  textLabel: {
    className: "sdn-text-label sdn-text-label--fwkw",
  },

  input: {
    placeholder: "Placeholder text",
    type: "text",
    className: "sdn-input sdn-input--8ux3",
  },
}

/**
 * Form Control: FormControl
 * Level: Element
 * Intent: Captures plain text input from the user for forms or interactions.
 * Tags: UI, UI control, binary, boolean, checkbox, choice, control, decorated, dropdown, editable, exclusive, field, form, icon, input, menu, options, query, radio, search, select, single choice, text, toggle, user entry
 * Type: Default
 *
 * Structure:
 *   TextLabel  textLabel
 *   Input      input
 *
 * @example
 * ```tsx
 * <FormControl
 *   aria-hidden="false"
 *   textLabel="{}"
 *   input="{}"
 * />
 * ```
 */
export function FormControl({
  className = "",
  textLabel,

  input,

  children,
  seldonRefs,
  ...props
}: FormControlProps) {
  const formControlClassName = combineClassNames("sdn-form-control", className)

  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)

  const inputProps = mergeSlot(sdn.input, input, seldonRefs)

  return (
    <Frame className={formControlClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
      {children !== undefined ? (
        children
      ) : (
        <>
          {textLabelProps !== null && <TextLabel {...textLabelProps} />}
          {inputProps !== null && <Input {...inputProps} />}
        </>
      )}
    </Frame>
  )
}

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
import { InputRadioButton, InputRadioButtonProps } from "../primitives/InputRadioButton"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot } from "../utils/merge-slot"

export interface FormControlRadioButtonControlProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  inputRadioButton?: InputRadioButtonProps | null

  textLabel?: TextLabelProps | null
}

//
// Default property values
//
const sdn: FormControlRadioButtonControlProps = {
  "aria-hidden": "false",
  inputRadioButton: {
    placeholder: "Placeholder text",
    className: "sdn-input-checkbox sdn-input-checkbox--vajr",
  },

  textLabel: {
    children: "Label",
    className: "sdn-text-label sdn-text-label--o9nd",
  },
}

/**
 * Form Control: FormControlRadioButtonControl
 * Level: Element
 * Intent: Captures plain text input from the user for forms or interactions.
 * Tags: UI, UI control, binary, boolean, checkbox, choice, control, decorated, dropdown, editable, exclusive, field, form, icon, input, menu, options, query, radio, search, select, single choice, text, toggle, user entry
 * Type: Custom
 *
 * Structure:
 *   InputRadioButton  inputRadioButton
 *   TextLabel         textLabel
 *
 * @example
 * ```tsx
 * <FormControlRadioButtonControl
 *   aria-hidden="false"
 *   inputRadioButton="{}"
 *   textLabel="{}"
 * />
 * ```
 */
export function FormControlRadioButtonControl({
  className = "",
  inputRadioButton,

  textLabel,

  children,
  seldonRefs,
  ...props
}: FormControlRadioButtonControlProps) {
  const formControlRadioButtonControlClassName = combineClassNames("sdn-form-control", className)

  const inputRadioButtonProps = mergeOptionalSlot(
    sdn.inputRadioButton,
    inputRadioButton,
    seldonRefs,
  )

  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)

  return (
    <Frame
      className={formControlRadioButtonControlClassName}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    >
      {children !== undefined ? (
        children
      ) : (
        <>
          {inputRadioButtonProps !== null && <InputRadioButton {...inputRadioButtonProps} />}
          {textLabelProps !== null && <TextLabel {...textLabelProps} />}
        </>
      )}
    </Frame>
  )
}

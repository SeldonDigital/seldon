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

import {
  FormControlRadioButtonControl,
  FormControlRadioButtonControlProps,
} from "../elements/FormControlRadioButtonControl"
import { Frame, FrameProps } from "../frames/Frame"
import { InputRadioButton, InputRadioButtonProps } from "../primitives/InputRadioButton"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface FormControlRadioProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  textLabel?: TextLabelProps | null

  frame?: FrameProps | null
  formControlRadioButtonControl?: FormControlRadioButtonControlProps | null
  inputRadioButton?: InputRadioButtonProps | null
  textLabel2?: TextLabelProps | null
  formControlRadioButtonControl2?: FormControlRadioButtonControlProps | null
  inputRadioButton2?: InputRadioButtonProps | null
  textLabel3?: TextLabelProps | null
}

//
// Default property values
//
const sdn: FormControlRadioProps = {
  "aria-hidden": "false",
  textLabel: {
    children: "Label",
    className: "sdn-text-label sdn-text-label--fwkw",
  },

  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--pgac",
  },
  formControlRadioButtonControl: {
    className: "sdn-form-control sdn-form-control-radio-button-control--0acl",
  },
  inputRadioButton: {
    placeholder: "Placeholder text",
    className: "sdn-input-checkbox sdn-input-checkbox--vajr",
  },
  textLabel2: {
    children: "Yes",
    className: "sdn-text-label sdn-text-label--uqg6",
  },
  formControlRadioButtonControl2: {
    className: "sdn-form-control sdn-form-control-radio-button-control--0acl",
  },
  inputRadioButton2: {
    placeholder: "Placeholder text",
    className: "sdn-input-checkbox sdn-input-checkbox--vajr",
  },
  textLabel3: {
    children: "No",
    className: "sdn-text-label sdn-text-label--uqg6",
  },
}

/**
 * Form Control: FormControlRadio
 * Level: Element
 * Intent: Captures plain text input from the user for forms or interactions.
 * Tags: UI, UI control, binary, boolean, checkbox, choice, control, decorated, dropdown, editable, exclusive, field, form, icon, input, menu, options, query, radio, search, select, single choice, text, toggle, user entry
 * Type: Inline
 *
 * Structure:
 *   TextLabel                        textLabel
 *   Frame                            frame
 *     FormControlRadioButtonControl  formControlRadioButtonControl
 *       InputRadioButton             inputRadioButton
 *       TextLabel                    textLabel2
 *     FormControlRadioButtonControl  formControlRadioButtonControl2
 *       InputRadioButton             inputRadioButton2
 *       TextLabel                    textLabel3
 *
 * @example
 * ```tsx
 * <FormControlRadio
 *   aria-hidden="false"
 *   textLabel="{}"
 *   frame="{}"
 *   formControlRadioButtonControl="{}"
 *   inputRadioButton="{}"
 *   formControlRadioButtonControl2="{}"
 * />
 * ```
 */
export function FormControlRadio({
  className = "",
  textLabel,

  frame,
  formControlRadioButtonControl,
  inputRadioButton,
  textLabel2,
  formControlRadioButtonControl2,
  inputRadioButton2,
  textLabel3,

  children,
  seldonRefs,
  ...props
}: FormControlRadioProps) {
  const formControlRadioClassName = combineClassNames("sdn-form-control", className)

  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)

  const frameProps = mergeSlot(sdn.frame, frame, seldonRefs)
  const formControlRadioButtonControlProps = mergeOptionalSlot(
    sdn.formControlRadioButtonControl,
    formControlRadioButtonControl,
    seldonRefs,
  )
  const inputRadioButtonProps = mergeOptionalSlot(
    sdn.inputRadioButton,
    inputRadioButton,
    seldonRefs,
  )
  const textLabel2Props = mergeOptionalSlot(sdn.textLabel2, textLabel2, seldonRefs)
  const formControlRadioButtonControl2Props = mergeOptionalSlot(
    sdn.formControlRadioButtonControl2,
    formControlRadioButtonControl2,
    seldonRefs,
  )
  const inputRadioButton2Props = mergeOptionalSlot(
    sdn.inputRadioButton2,
    inputRadioButton2,
    seldonRefs,
  )
  const textLabel3Props = mergeOptionalSlot(sdn.textLabel3, textLabel3, seldonRefs)

  return (
    <Frame className={formControlRadioClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
      {children !== undefined ? (
        children
      ) : (
        <>
          {textLabelProps !== null && <TextLabel {...textLabelProps} />}
          <Frame {...frameProps}>
            {formControlRadioButtonControlProps !== null && (
              <FormControlRadioButtonControl {...formControlRadioButtonControlProps}>
                {inputRadioButtonProps !== null && <InputRadioButton {...inputRadioButtonProps} />}
                {textLabel2Props !== null && <TextLabel {...textLabel2Props} />}
              </FormControlRadioButtonControl>
            )}
            {formControlRadioButtonControl2Props !== null && (
              <FormControlRadioButtonControl {...formControlRadioButtonControl2Props}>
                {inputRadioButton2Props !== null && (
                  <InputRadioButton {...inputRadioButton2Props} />
                )}
                {textLabel3Props !== null && <TextLabel {...textLabel3Props} />}
              </FormControlRadioButtonControl>
            )}
          </Frame>
        </>
      )}
    </Frame>
  )
}

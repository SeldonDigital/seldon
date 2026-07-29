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

import { FieldsetHTMLAttributes } from "react"

import {
  FormControlRadioButtonControl,
  FormControlRadioButtonControlProps,
} from "../elements/FormControlRadioButtonControl"
import { HTMLFieldset } from "../native-react/HTML.Fieldset"
import { InputRadioButton, InputRadioButtonProps } from "../primitives/InputRadioButton"
import { Legend, LegendProps } from "../primitives/Legend"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface FieldsetRadioButtonFieldsetProps extends FieldsetHTMLAttributes<HTMLFieldSetElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  legend?: LegendProps | null

  formControlRadioButtonControl?: FormControlRadioButtonControlProps | null
  inputRadioButton?: InputRadioButtonProps | null
  textLabel?: TextLabelProps | null

  formControlRadioButtonControl2?: FormControlRadioButtonControlProps | null
  inputRadioButton2?: InputRadioButtonProps | null
  textLabel2?: TextLabelProps | null

  formControlRadioButtonControl3?: FormControlRadioButtonControlProps | null
  inputRadioButton3?: InputRadioButtonProps | null
  textLabel3?: TextLabelProps | null
}

//
// Default property values
//
const sdn: FieldsetRadioButtonFieldsetProps = {
  "aria-hidden": "false",
  legend: {
    children: "Legend",
    "aria-hidden": "false",
    className: "sdn-legend sdn-legend--o30d",
  },

  formControlRadioButtonControl: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control--vmxp",
  },
  inputRadioButton: {
    placeholder: "Placeholder text",
    className: "sdn-input-checkbox sdn-input-checkbox--vajr",
  },
  textLabel: {
    children: "Label",
    className: "sdn-text-label sdn-text-label--a3jd",
  },

  formControlRadioButtonControl2: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control--vmxp",
  },
  inputRadioButton2: {
    placeholder: "Placeholder text",
    className: "sdn-input-checkbox sdn-input-checkbox--vajr",
  },
  textLabel2: {
    children: "Label",
    className: "sdn-text-label sdn-text-label--a3jd",
  },

  formControlRadioButtonControl3: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control--vmxp",
  },
  inputRadioButton3: {
    placeholder: "Placeholder text",
    className: "sdn-input-checkbox sdn-input-checkbox--vajr",
  },
  textLabel3: {
    children: "Label",
    className: "sdn-text-label sdn-text-label--a3jd",
  },
}

/**
 * Fieldset: FieldsetRadioButtonFieldset
 * Level: Part
 * Intent: Generic form field grouping component schema used to logically separate sections within forms.
 * Tags: form, fieldset, ui, group, input, layout, section, fields
 * Type: Custom
 *
 * Structure:
 *   Legend                         legend
 *   FormControlRadioButtonControl  formControlRadioButtonControl
 *     InputRadioButton             inputRadioButton
 *     TextLabel                    textLabel
 *   FormControlRadioButtonControl  formControlRadioButtonControl2
 *     InputRadioButton             inputRadioButton2
 *     TextLabel                    textLabel2
 *   FormControlRadioButtonControl  formControlRadioButtonControl3
 *     InputRadioButton             inputRadioButton3
 *     TextLabel                    textLabel3
 *
 * @example
 * ```tsx
 * <FieldsetRadioButtonFieldset
 *   aria-hidden="false"
 *   legend="{}"
 *   formControlRadioButtonControl="{}"
 *   inputRadioButton="{}"
 *   textLabel="{}"
 *   formControlRadioButtonControl2="{}"
 *   formControlRadioButtonControl3="{}"
 * />
 * ```
 */
export function FieldsetRadioButtonFieldset({
  className = "",
  legend,

  formControlRadioButtonControl,
  inputRadioButton,
  textLabel,

  formControlRadioButtonControl2,
  inputRadioButton2,
  textLabel2,

  formControlRadioButtonControl3,
  inputRadioButton3,
  textLabel3,

  children,
  seldonRefs,
  ...props
}: FieldsetRadioButtonFieldsetProps) {
  const fieldsetRadioButtonFieldsetClassName = combineClassNames("sdn-fieldset", className)

  const legendProps = mergeSlot(sdn.legend, legend, seldonRefs)

  const formControlRadioButtonControlProps = mergeSlot(
    sdn.formControlRadioButtonControl,
    formControlRadioButtonControl,
    seldonRefs,
  )
  const inputRadioButtonProps = mergeOptionalSlot(
    sdn.inputRadioButton,
    inputRadioButton,
    seldonRefs,
  )
  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)

  const formControlRadioButtonControl2Props = mergeSlot(
    sdn.formControlRadioButtonControl2,
    formControlRadioButtonControl2,
    seldonRefs,
  )
  const inputRadioButton2Props = mergeOptionalSlot(
    sdn.inputRadioButton2,
    inputRadioButton2,
    seldonRefs,
  )
  const textLabel2Props = mergeOptionalSlot(sdn.textLabel2, textLabel2, seldonRefs)

  const formControlRadioButtonControl3Props = mergeSlot(
    sdn.formControlRadioButtonControl3,
    formControlRadioButtonControl3,
    seldonRefs,
  )
  const inputRadioButton3Props = mergeOptionalSlot(
    sdn.inputRadioButton3,
    inputRadioButton3,
    seldonRefs,
  )
  const textLabel3Props = mergeOptionalSlot(sdn.textLabel3, textLabel3, seldonRefs)

  return (
    <HTMLFieldset
      className={fieldsetRadioButtonFieldsetClassName}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    >
      {children !== undefined ? (
        children
      ) : (
        <>
          {legendProps !== null && <Legend {...legendProps} />}
          {formControlRadioButtonControlProps !== null && (
            <FormControlRadioButtonControl {...formControlRadioButtonControlProps}>
              {inputRadioButtonProps !== null && <InputRadioButton {...inputRadioButtonProps} />}
              {textLabelProps !== null && <TextLabel {...textLabelProps} />}
            </FormControlRadioButtonControl>
          )}
          {formControlRadioButtonControl2Props !== null && (
            <FormControlRadioButtonControl {...formControlRadioButtonControl2Props}>
              {inputRadioButton2Props !== null && <InputRadioButton {...inputRadioButton2Props} />}
              {textLabel2Props !== null && <TextLabel {...textLabel2Props} />}
            </FormControlRadioButtonControl>
          )}
          {formControlRadioButtonControl3Props !== null && (
            <FormControlRadioButtonControl {...formControlRadioButtonControl3Props}>
              {inputRadioButton3Props !== null && <InputRadioButton {...inputRadioButton3Props} />}
              {textLabel3Props !== null && <TextLabel {...textLabel3Props} />}
            </FormControlRadioButtonControl>
          )}
        </>
      )}
    </HTMLFieldset>
  )
}

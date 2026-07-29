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
  FormControlCheckboxControl,
  FormControlCheckboxControlProps,
} from "../elements/FormControlCheckboxControl"
import { HTMLFieldset } from "../native-react/HTML.Fieldset"
import { InputCheckbox, InputCheckboxProps } from "../primitives/InputCheckbox"
import { Legend, LegendProps } from "../primitives/Legend"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface FieldsetCheckboxFieldsetProps extends FieldsetHTMLAttributes<HTMLFieldSetElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  legend?: LegendProps | null

  formControlCheckboxControl?: FormControlCheckboxControlProps | null
  inputCheckbox?: InputCheckboxProps | null
  textLabel?: TextLabelProps | null

  formControlCheckboxControl2?: FormControlCheckboxControlProps | null
  inputCheckbox2?: InputCheckboxProps | null
  textLabel2?: TextLabelProps | null

  formControlCheckboxControl3?: FormControlCheckboxControlProps | null
  inputCheckbox3?: InputCheckboxProps | null
  textLabel3?: TextLabelProps | null
}

//
// Default property values
//
const sdn: FieldsetCheckboxFieldsetProps = {
  "aria-hidden": "false",
  legend: {
    children: "Legend",
    "aria-hidden": "false",
    className: "sdn-legend sdn-legend--o30d",
  },

  formControlCheckboxControl: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control--vmxp",
  },
  inputCheckbox: {
    className: "sdn-input-checkbox sdn-input-checkbox--vajr",
  },
  textLabel: {
    className: "sdn-text-label sdn-text-label--a3jd",
  },

  formControlCheckboxControl2: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control--vmxp",
  },
  inputCheckbox2: {
    className: "sdn-input-checkbox sdn-input-checkbox--vajr",
  },
  textLabel2: {
    className: "sdn-text-label sdn-text-label--a3jd",
  },

  formControlCheckboxControl3: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control--vmxp",
  },
  inputCheckbox3: {
    className: "sdn-input-checkbox sdn-input-checkbox--vajr",
  },
  textLabel3: {
    className: "sdn-text-label sdn-text-label--a3jd",
  },
}

/**
 * Fieldset: FieldsetCheckboxFieldset
 * Level: Part
 * Intent: Generic form field grouping component schema used to logically separate sections within forms.
 * Tags: form, fieldset, ui, group, input, layout, section, fields
 * Type: Custom
 *
 * Structure:
 *   Legend                      legend
 *   FormControlCheckboxControl  formControlCheckboxControl
 *     InputCheckbox             inputCheckbox
 *     TextLabel                 textLabel
 *   FormControlCheckboxControl  formControlCheckboxControl2
 *     InputCheckbox             inputCheckbox2
 *     TextLabel                 textLabel2
 *   FormControlCheckboxControl  formControlCheckboxControl3
 *     InputCheckbox             inputCheckbox3
 *     TextLabel                 textLabel3
 *
 * @example
 * ```tsx
 * <FieldsetCheckboxFieldset
 *   aria-hidden="false"
 *   legend="{}"
 *   formControlCheckboxControl="{}"
 *   inputCheckbox="{}"
 *   textLabel="{}"
 *   formControlCheckboxControl2="{}"
 *   formControlCheckboxControl3="{}"
 * />
 * ```
 */
export function FieldsetCheckboxFieldset({
  className = "",
  legend,

  formControlCheckboxControl,
  inputCheckbox,
  textLabel,

  formControlCheckboxControl2,
  inputCheckbox2,
  textLabel2,

  formControlCheckboxControl3,
  inputCheckbox3,
  textLabel3,

  children,
  seldonRefs,
  ...props
}: FieldsetCheckboxFieldsetProps) {
  const fieldsetCheckboxFieldsetClassName = combineClassNames("sdn-fieldset", className)

  const legendProps = mergeSlot(sdn.legend, legend, seldonRefs)

  const formControlCheckboxControlProps = mergeSlot(
    sdn.formControlCheckboxControl,
    formControlCheckboxControl,
    seldonRefs,
  )
  const inputCheckboxProps = mergeOptionalSlot(sdn.inputCheckbox, inputCheckbox, seldonRefs)
  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)

  const formControlCheckboxControl2Props = mergeSlot(
    sdn.formControlCheckboxControl2,
    formControlCheckboxControl2,
    seldonRefs,
  )
  const inputCheckbox2Props = mergeOptionalSlot(sdn.inputCheckbox2, inputCheckbox2, seldonRefs)
  const textLabel2Props = mergeOptionalSlot(sdn.textLabel2, textLabel2, seldonRefs)

  const formControlCheckboxControl3Props = mergeSlot(
    sdn.formControlCheckboxControl3,
    formControlCheckboxControl3,
    seldonRefs,
  )
  const inputCheckbox3Props = mergeOptionalSlot(sdn.inputCheckbox3, inputCheckbox3, seldonRefs)
  const textLabel3Props = mergeOptionalSlot(sdn.textLabel3, textLabel3, seldonRefs)

  return (
    <HTMLFieldset
      className={fieldsetCheckboxFieldsetClassName}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    >
      {children !== undefined ? (
        children
      ) : (
        <>
          {legendProps !== null && <Legend {...legendProps} />}
          {formControlCheckboxControlProps !== null && (
            <FormControlCheckboxControl {...formControlCheckboxControlProps}>
              {inputCheckboxProps !== null && <InputCheckbox {...inputCheckboxProps} />}
              {textLabelProps !== null && <TextLabel {...textLabelProps} />}
            </FormControlCheckboxControl>
          )}
          {formControlCheckboxControl2Props !== null && (
            <FormControlCheckboxControl {...formControlCheckboxControl2Props}>
              {inputCheckbox2Props !== null && <InputCheckbox {...inputCheckbox2Props} />}
              {textLabel2Props !== null && <TextLabel {...textLabel2Props} />}
            </FormControlCheckboxControl>
          )}
          {formControlCheckboxControl3Props !== null && (
            <FormControlCheckboxControl {...formControlCheckboxControl3Props}>
              {inputCheckbox3Props !== null && <InputCheckbox {...inputCheckbox3Props} />}
              {textLabel3Props !== null && <TextLabel {...textLabel3Props} />}
            </FormControlCheckboxControl>
          )}
        </>
      )}
    </HTMLFieldset>
  )
}

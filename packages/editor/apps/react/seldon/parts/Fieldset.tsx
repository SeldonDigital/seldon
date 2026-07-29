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

import { FormControl, FormControlProps } from "../elements/FormControl"
import {
  FormControlDropdownControl,
  FormControlDropdownControlProps,
} from "../elements/FormControlDropdownControl"
import { Select, SelectProps } from "../elements/Select"
import { HTMLFieldset } from "../native-react/HTML.Fieldset"
import { Input, InputProps } from "../primitives/Input"
import { Legend, LegendProps } from "../primitives/Legend"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { TextOption, TextOptionProps } from "../primitives/TextOption"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface FieldsetProps extends FieldsetHTMLAttributes<HTMLFieldSetElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  legend?: LegendProps | null

  formControl?: FormControlProps | null
  textLabel?: TextLabelProps | null
  input?: InputProps | null

  formControl2?: FormControlProps | null
  textLabel2?: TextLabelProps | null
  input2?: InputProps | null

  formControlDropdownControl?: FormControlDropdownControlProps | null
  textLabel3?: TextLabelProps | null
  select?: SelectProps | null
  textOption?: TextOptionProps | null
  textOption2?: TextOptionProps | null
  textOption3?: TextOptionProps | null
}

//
// Default property values
//
const sdn: FieldsetProps = {
  "aria-hidden": "false",
  legend: {
    children: "Legend",
    "aria-hidden": "false",
    className: "sdn-legend sdn-legend--o30d",
  },

  formControl: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control--vmxp",
  },
  textLabel: {
    children: "Label",
    className: "sdn-text-label sdn-text-label--u1gw",
  },
  input: {
    placeholder: "Placeholder text",
    type: "text",
    className: "sdn-input sdn-input--ahdh",
  },

  formControl2: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control--vmxp",
  },
  textLabel2: {
    children: "Label",
    className: "sdn-text-label sdn-text-label--u1gw",
  },
  input2: {
    placeholder: "Placeholder text",
    type: "text",
    className: "sdn-input sdn-input--ahdh",
  },

  formControlDropdownControl: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control--vmxp",
  },
  textLabel3: {
    children: "Label",
    className: "sdn-text-label sdn-text-label--u1gw",
  },
  select: {
    "aria-hidden": "false",
    className: "sdn-select sdn-select--7bom",
  },
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
 * Fieldset: Fieldset
 * Level: Part
 * Intent: Generic form field grouping component schema used to logically separate sections within forms.
 * Tags: form, fieldset, ui, group, input, layout, section, fields
 * Type: Default
 *
 * Structure:
 *   Legend                      legend
 *   FormControl                 formControl
 *     TextLabel                 textLabel
 *     Input                     input
 *   FormControl                 formControl2
 *     TextLabel                 textLabel2
 *     Input                     input2
 *   FormControlDropdownControl  formControlDropdownControl
 *     TextLabel                 textLabel3
 *     Select                    select
 *       TextOption              textOption
 *       TextOption              textOption2
 *       TextOption              textOption3
 *
 * @example
 * ```tsx
 * <Fieldset
 *   aria-hidden="false"
 *   legend="{}"
 *   formControl="{}"
 *   textLabel="{}"
 *   input="{}"
 *   formControl2="{}"
 *   formControlDropdownControl3="{}"
 *   select="{}"
 *   textOption="{}"
 *   textOption2="{}"
 *   textOption3="{}"
 * />
 * ```
 */
export function Fieldset({
  className = "",
  legend,

  formControl,
  textLabel,
  input,

  formControl2,
  textLabel2,
  input2,

  formControlDropdownControl,
  textLabel3,
  select,
  textOption,
  textOption2,
  textOption3,

  children,
  seldonRefs,
  ...props
}: FieldsetProps) {
  const fieldsetClassName = combineClassNames("sdn-fieldset", className)

  const legendProps = mergeSlot(sdn.legend, legend, seldonRefs)

  const formControlProps = mergeSlot(sdn.formControl, formControl, seldonRefs)
  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)
  const inputProps = mergeSlot(sdn.input, input, seldonRefs)

  const formControl2Props = mergeSlot(sdn.formControl2, formControl2, seldonRefs)
  const textLabel2Props = mergeOptionalSlot(sdn.textLabel2, textLabel2, seldonRefs)
  const input2Props = mergeSlot(sdn.input2, input2, seldonRefs)

  const formControlDropdownControlProps = mergeSlot(
    sdn.formControlDropdownControl,
    formControlDropdownControl,
    seldonRefs,
  )
  const textLabel3Props = mergeOptionalSlot(sdn.textLabel3, textLabel3, seldonRefs)
  const selectProps = mergeSlot(sdn.select, select, seldonRefs)
  const textOptionProps = mergeOptionalSlot(sdn.textOption, textOption, seldonRefs)
  const textOption2Props = mergeOptionalSlot(sdn.textOption2, textOption2, seldonRefs)
  const textOption3Props = mergeOptionalSlot(sdn.textOption3, textOption3, seldonRefs)

  return (
    <HTMLFieldset className={fieldsetClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
      {children !== undefined ? (
        children
      ) : (
        <>
          {legendProps !== null && <Legend {...legendProps} />}
          {formControlProps !== null && (
            <FormControl {...formControlProps}>
              {textLabelProps !== null && <TextLabel {...textLabelProps} />}
              {inputProps !== null && <Input {...inputProps} />}
            </FormControl>
          )}
          {formControl2Props !== null && (
            <FormControl {...formControl2Props}>
              {textLabel2Props !== null && <TextLabel {...textLabel2Props} />}
              {input2Props !== null && <Input {...input2Props} />}
            </FormControl>
          )}
          {formControlDropdownControlProps !== null && (
            <FormControlDropdownControl {...formControlDropdownControlProps}>
              {textLabel3Props !== null && <TextLabel {...textLabel3Props} />}
              {selectProps !== null && (
                <Select {...selectProps}>
                  {textOptionProps !== null && <TextOption {...textOptionProps} />}
                  {textOption2Props !== null && <TextOption {...textOption2Props} />}
                  {textOption3Props !== null && <TextOption {...textOption3Props} />}
                </Select>
              )}
            </FormControlDropdownControl>
          )}
        </>
      )}
    </HTMLFieldset>
  )
}

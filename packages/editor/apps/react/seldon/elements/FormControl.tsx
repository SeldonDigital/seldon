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
import { applyRef } from "../utils/apply-ref"
import { combineClassNames } from "../utils/class-name"

export interface FormControlProps extends HTMLAttributes<HTMLElement> {
  className?: string
  "data-seldon-ref"?: string
  seldonRefs?: Record<string, Record<string, unknown>>
  textLabel?: TextLabelProps | null
  input?: InputProps | null
}

/*****
 * Form Control: FormControl
 * Level: Element
 * Intent: Captures plain text input from the user for forms or interactions.
 * Tags: UI, UI control, binary, boolean, checkbox, choice, control, decorated, dropdown, editable, exclusive, field, form, icon, input, menu, options, query, radio, search, select, single choice, text, toggle, user entry
 * Type: Default
 *
 * @example
 * ```tsx
 * <FormControl
 *   aria-hidden="false"
 *   textLabel="{}"
 *   input="{}"
 * />
 * ```
 *****/
export function FormControl({
  className = "",
  textLabel,
  input = sdn.input,
  children,
  seldonRefs,
  ...props
}: FormControlProps) {
  const formControlClassName = combineClassNames("sdn-form-control", className)
  const textLabelProps = applyRef(
    seldonRefs,
    textLabel === null
      ? null
      : {
          ...sdn.textLabel,
          ...textLabel,
          className: combineClassNames(
            sdn.textLabel?.className,
            textLabel?.className,
          ),
        },
  )
  const inputProps = applyRef(
    seldonRefs,
    input === null
      ? null
      : {
          ...sdn.input,
          ...input,
          className: combineClassNames(sdn.input?.className, input?.className),
        },
  )

  return (
    <Frame
      className={formControlClassName}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    >
      {children !== undefined ? (
        children
      ) : (
        <>
          {textLabel && textLabelProps && <TextLabel {...textLabelProps} />}
          {inputProps !== null && <Input {...inputProps} />}
        </>
      )}
    </Frame>
  )
}

//
// Default property values
//
const sdn: FormControlProps = {
  "aria-hidden": "false",
  className: "sdn-form-control",
  textLabel: {
    className: "sdn-text-label sdn-text-label--fwkw",
  },
  input: {
    placeholder: "Placeholder text",
    type: "text",
    className: "sdn-input sdn-input--8ux3",
  },
}

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
import { combineClassNames } from "../utils/class-name"

export interface FormControlProps extends HTMLAttributes<HTMLElement> {
  className?: string
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

 * />
 * ```
 *****/
export function FormControl({ className = "", ...props }: FormControlProps) {
  const formControlClassName = combineClassNames("sdn-form-control", className)

  //
  // React JSX component with merged default and custom properties
  //
  return <Frame className={formControlClassName} {...props} />
}

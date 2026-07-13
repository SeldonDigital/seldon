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
import { TextareaHTMLAttributes } from "react"
import { HTMLTextarea } from "../native-react/HTML.Textarea"
import { combineClassNames } from "../utils/class-name"

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string
  "data-seldon-ref"?: string
}

/*****
 * Textarea: Textarea
 * Level: Primitive
 * Intent: Multi-line text input control for collecting longer user input.
 * Tags: textarea, form, text, primitive, field, user entry, control, multiline
 * Type: Default
 *
 * @example
 * ```tsx
 * <Textarea

 * />
 * ```
 *****/
export function Textarea({ className = "", ...props }: TextareaProps) {
  const textareaClassName = combineClassNames("sdn-textarea", className)

  //
  // React JSX component with merged default and custom properties
  //
  return <HTMLTextarea className={textareaClassName} {...props} />
}

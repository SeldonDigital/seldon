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
 
import { ButtonHTMLAttributes } from "react"
import { HTMLButton } from "../native-react/HTML.Button"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { applyRef } from "../utils/apply-ref"
import { combineClassNames } from "../utils/class-name"

export interface ButtonSimpleProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
  "data-seldon-ref"?: string
  seldonRefs?: Record<string, Record<string, unknown>>
  textLabel?: TextLabelProps | null
}

/*****
 * Button: Simple
 * Level: Element
 * Intent: Standard button for triggering actions like submit, confirm, or cancel.
 * Tags: button, action, UI, primary, click, control, submit, call to action
 * Type: Custom
 *
 * @example
 * ```tsx
 * <ButtonSimple
 *   textLabel="{}"
 * />
 * ```
 *****/
export function ButtonSimple({
  className = "",
  textLabel,
  children,
  seldonRefs,
  ...props
}: ButtonSimpleProps) {
  const buttonSimpleClassName = combineClassNames(
    "sdn-button-simple",
    className,
  )
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

  return (
    <HTMLButton className={buttonSimpleClassName} {...props}>
      {children !== undefined ? (
        children
      ) : (
        <>{textLabel && textLabelProps && <TextLabel {...textLabelProps} />}</>
      )}
    </HTMLButton>
  )
}

//
// Default property values
//
const sdn: ButtonSimpleProps = {
  textLabel: {
    className: "sdn-text-label sdn-text-label--ylte",
  },
}

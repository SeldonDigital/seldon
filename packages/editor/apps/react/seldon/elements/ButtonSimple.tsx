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
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot } from "../utils/merge-slot"

export interface ButtonSimpleProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  textLabel?: TextLabelProps | null
}

//
// Default property values
//
const sdn: ButtonSimpleProps = {
  textLabel: {
    children: "Button",
    className: "sdn-text-label sdn-text-label--ylte",
  },
}

/**
 * Button: Simple
 * Level: Element
 * Intent: Standard button for triggering actions like submit, confirm, or cancel.
 * Tags: button, action, UI, primary, click, control, submit, call to action
 * Type: Custom
 *
 * Structure:
 *   TextLabel  textLabel
 *
 * @example
 * ```tsx
 * <ButtonSimple
 *   textLabel="{}"
 * />
 * ```
 */
export function ButtonSimple({
  className = "",
  textLabel,

  children,
  seldonRefs,
  ...props
}: ButtonSimpleProps) {
  const buttonSimpleClassName = combineClassNames("sdn-button-simple", className)

  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)

  return (
    <HTMLButton className={buttonSimpleClassName} {...props}>
      {children !== undefined ? (
        children
      ) : (
        <>{textLabelProps !== null && <TextLabel {...textLabelProps} />}</>
      )}
    </HTMLButton>
  )
}

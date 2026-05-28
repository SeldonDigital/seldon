/*
 * This code was generated using Seldon (https://seldon.app)
 *
 * Licensed under the Terms of Use: https://seldon.digital/terms-of-service
 * Do not redistribute or sublicense without permission.
 *
 * You may not use this software, or any derivative works of it,
 * in whole or in part, for the purposes of training, fine-tuning,
 * or otherwise improving (directly or indirectly) any machine learning
 * or artificial intelligence system.
 */
import { OptionHTMLAttributes } from "react"
import { HTMLOption } from "../native-react/HTML.Option"

export interface OptionProps extends OptionHTMLAttributes<HTMLOptionElement> {
  className?: string
  children?: string
}

export function Option({ className = "", ...props }: OptionProps) {
  return (
    <HTMLOption className={"variant-option-default " + className} {...props} />
  )
}

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
import { HTMLAttributes } from "react"
import { HTMLSpan } from "../native-react/HTML.Span"

export interface LabelProps extends HTMLAttributes<HTMLSpanElement> {
  className?: string
  children?: string
  htmlElement?: "span" | "label"
}

export function Label({ className = "", htmlElement, ...props }: LabelProps) {
  return (
    <HTMLSpan className={"variant-label-default " + className} {...props} />
  )
}

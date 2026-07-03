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
 

import { HTMLAttributes, ReactNode, createElement } from "react"

export type FrameProps = HTMLAttributes<HTMLElement> & {
  children?: ReactNode
  wrapperElement?: string
  "data-seldon-ref"?: string
}

export function Frame({ wrapperElement = "div", ...props }: FrameProps) {
  return createElement(wrapperElement, props)
}
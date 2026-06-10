/*****
 *
 * This code was generated using Seldon (https://seldon.app)
 *
 * Licensed under the Terms of Use: https://seldon.digital/terms-of-service
 * Do not redistribute or sublicense without permission.
 *
 * You may not use this software, or any derivative works of it,
 * in whole or in part, for the purposes of training, fine-tuning,
 * or otherwise improving (directly or indirectly) any machine learning
 * or artificial intelligence system.
 *
 *****/
import { HTMLAttributes } from "react"
import { Frame } from "../frames/Frame"
import { Text, TextProps } from "../primitives/Text"
import { combineClassNames } from "../utils/class-name"

export interface BarStatusProps extends HTMLAttributes<HTMLElement> {
  className?: string
  text?: TextProps
  text2?: TextProps
  text3?: TextProps
}

/*****
 * Status Bar: BarStatus
 * Level: Part
 * Intent: Provides a status bar for displaying application or system information.
 * Tags: status, bar, UI, footer, section, information
 * Type: Default
 *
 * @example
 * ```tsx
 * <BarStatus
 *   text="{}"
 *   text2="{}"
 *   text3="{}"
 * />
 * ```
 *****/
export function BarStatus({
  className = "",
  text = sdn.text,
  text2 = sdn.text2,
  text3 = sdn.text3,
  ...props
}: BarStatusProps) {
  const barStatusClassName = combineClassNames("sdn-bar-status", className)
  const textProps = {
    ...sdn.text,
    ...text,
    className: combineClassNames(sdn.text?.className, text?.className),
  }
  const text2Props = {
    ...sdn.text2,
    ...text2,
    className: combineClassNames(sdn.text2?.className, text2?.className),
  }
  const text3Props = {
    ...sdn.text3,
    ...text3,
    className: combineClassNames(sdn.text3?.className, text3?.className),
  }

  return (
    <Frame className={barStatusClassName} {...props}>
      <Text {...textProps} />
      <Text {...text2Props} />
      <Text {...text3Props} />
    </Frame>
  )
}

//
// Default property values
//
const sdn: BarStatusProps = {
  text: {
    children: "Left status",
    htmlElement: "p",
    className: "sdn-text sdn-text--bx7i",
  },
  text2: {
    children: "Middle status",
    htmlElement: "p",
    className: "sdn-text sdn-text--anr7",
  },
  text3: {
    children: "Right status",
    htmlElement: "p",
    className: "sdn-text sdn-text--e2dx",
  },
}

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
import { LabelProps } from "../custom-components/primitives/Label"
import { Button, ButtonProps } from "../elements/Button"
import { Frame } from "../frames/Frame"
import { IconProps } from "../primitives/Icon"
import { Text, TextProps } from "../primitives/Text"
import { combineClassNames } from "../utils/class-name"

export interface BarTabsProjectProps extends HTMLAttributes<HTMLElement> {
  className?: string
  button?: ButtonProps
  icon?: IconProps
  label?: LabelProps
  text?: TextProps
  button2?: ButtonProps
  icon2?: IconProps
  label2?: LabelProps
  button3?: ButtonProps
  icon3?: IconProps
  label3?: LabelProps
}

/*****
 * Tabs Bar: BarTabsProject
 * Level: Part
 * Intent: Provides a horizontal tab bar for organizing content into selectable sections.
 * Tags: tabs, navigation, bar, UI, layout, controls, sections, horizontal
 * Type: Custom
 *
 * @example
 * ```tsx
 * <BarTabsProject
 *   button={() => {}}
 *   icon="material-star"
 *   label="Button Label"
 *   text="{}"
 *   button2={() => {}}
 *   button3={() => {}}
 * />
 * ```
 *****/
export function BarTabsProject({
  className = "",
  button = sdn.button,
  icon = sdn.icon,
  label = sdn.label,
  text,
  button2 = sdn.button2,
  icon2 = sdn.icon2,
  label2 = sdn.label2,
  button3,
  icon3,
  label3,
  ...props
}: BarTabsProjectProps) {
  const barTabsProjectClassName = combineClassNames(
    "sdn-bar-tabs-project",
    className,
  )
  const buttonProps = {
    ...sdn.button,
    ...button,
    className: combineClassNames(sdn.button?.className, button?.className),
  }
  const iconProps = {
    ...sdn.icon,
    ...icon,
    className: combineClassNames(sdn.icon?.className, icon?.className),
  }
  const labelProps = {
    ...sdn.label,
    ...label,
    className: combineClassNames(sdn.label?.className, label?.className),
  }
  const textProps = {
    ...sdn.text,
    ...text,
    className: combineClassNames(sdn.text?.className, text?.className),
  }
  const button2Props = {
    ...sdn.button2,
    ...button2,
    className: combineClassNames(sdn.button2?.className, button2?.className),
  }
  const icon2Props = {
    ...sdn.icon2,
    ...icon2,
    className: combineClassNames(sdn.icon2?.className, icon2?.className),
  }
  const label2Props = {
    ...sdn.label2,
    ...label2,
    className: combineClassNames(sdn.label2?.className, label2?.className),
  }
  const button3Props = button3
    ? {
        ...button3,
        className: combineClassNames(
          "sdn-button sdn-button--9f85",
          button3.className,
        ),
      }
    : undefined
  const icon3Props = button3
    ? {
        ...icon3,
        className: combineClassNames(
          "sdn-icon sdn-icon--fvvj",
          icon3?.className,
        ),
      }
    : undefined
  const label3Props = button3
    ? {
        htmlElement: "label" as const,
        ...label3,
        className: combineClassNames(
          "sdn-label sdn-label--3dyv",
          label3?.className,
        ),
      }
    : undefined

  return (
    <Frame className={barTabsProjectClassName} {...props}>
      <Button {...buttonProps} icon={iconProps} textLabel={labelProps} />
      {text && <Text {...textProps} />}
      <Button {...button2Props} icon={icon2Props} textLabel={label2Props} />
      {button3 && button3Props && (
        <Button {...button3Props} icon={icon3Props} textLabel={label3Props} />
      )}
    </Frame>
  )
}

//
// Default property values
//
const sdn: BarTabsProjectProps = {
  button: {
    className: "sdn-button sdn-button--9f85",
  },
  icon: {
    icon: "material-chevronDoubleLeft",
    className: "sdn-icon sdn-icon--fvvj",
  },
  label: {
    children: "Projects",
    htmlElement: "label",
    className: "sdn-label sdn-label--3dyv",
  },
  text: {
    className: "sdn-text sdn-text--flvt",
  },
  button2: {
    className: "sdn-button sdn-button--9f85",
  },
  icon2: {
    icon: "seldon-component",
    className: "sdn-icon sdn-icon--fvvj",
  },
  label2: {
    children: "Add",
    htmlElement: "label",
    className: "sdn-label sdn-label--3dyv",
  },
}

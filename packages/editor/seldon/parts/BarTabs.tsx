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
import { Button, ButtonProps } from "../elements/Button"
import { Frame } from "../frames/Frame"
import { IconProps } from "../primitives/Icon"
import { LabelProps } from "../custom-components/primitives/Label"
import { combineClassNames } from "../utils/class-name"

export interface BarTabsProps extends HTMLAttributes<HTMLElement> {
  className?: string
  button?: ButtonProps
  icon?: IconProps
  label?: LabelProps
  button2?: ButtonProps
  icon2?: IconProps
  label2?: LabelProps
  button3?: ButtonProps
  icon3?: IconProps
  label3?: LabelProps
}

/*****
 * Tabs Bar: BarTabs
 * Level: Part
 * Intent: Provides a horizontal tab bar for organizing content into selectable sections.
 * Tags: tabs, navigation, bar, UI, layout, controls, sections, horizontal
 * Type: Default
 *
 * @example
 * ```tsx
 * <BarTabs
 *   button={() => {}}
 *   icon="material-star"
 *   label="Button Label"
 *   button2={() => {}}
 *   button3={() => {}}
 * />
 * ```
 *****/
export function BarTabs({
  className = "",
  button = sdn.button,
  icon = sdn.icon,
  label = sdn.label,
  button2 = sdn.button2,
  icon2 = sdn.icon2,
  label2 = sdn.label2,
  button3 = sdn.button3,
  icon3 = sdn.icon3,
  label3 = sdn.label3,
  ...props
}: BarTabsProps) {
  const barTabsClassName = combineClassNames("sdn-bar-tabs", className)
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
  const button3Props = {
    ...sdn.button3,
    ...button3,
    className: combineClassNames(sdn.button3?.className, button3?.className),
  }
  const icon3Props = {
    ...sdn.icon3,
    ...icon3,
    className: combineClassNames(sdn.icon3?.className, icon3?.className),
  }
  const label3Props = {
    ...sdn.label3,
    ...label3,
    className: combineClassNames(sdn.label3?.className, label3?.className),
  }

  return (
    <Frame className={barTabsClassName} {...props}>
      <Button {...buttonProps} icon={iconProps} textLabel={labelProps} />
      <Button {...button2Props} icon={icon2Props} textLabel={label2Props} />
      <Button {...button3Props} icon={icon3Props} textLabel={label3Props} />
    </Frame>
  )
}

//
// Default property values
//
const sdn: BarTabsProps = {
  button: {
    className: "sdn-button sdn-button--if6t",
  },
  icon: {
    icon: "__default__",
    className: "sdn-icon sdn-icon--n5nb",
  },
  label: {
    children: "Button",
    htmlElement: "label",
    className: "sdn-label sdn-label--u587",
  },
  button2: {
    className: "sdn-button sdn-button--if6t",
  },
  icon2: {
    icon: "__default__",
    className: "sdn-icon sdn-icon--n5nb",
  },
  label2: {
    children: "Button",
    htmlElement: "label",
    className: "sdn-label sdn-label--u587",
  },
  button3: {
    className: "sdn-button sdn-button--if6t",
  },
  icon3: {
    icon: "__default__",
    className: "sdn-icon sdn-icon--n5nb",
  },
  label3: {
    children: "Button",
    htmlElement: "label",
    className: "sdn-label sdn-label--u587",
  },
}

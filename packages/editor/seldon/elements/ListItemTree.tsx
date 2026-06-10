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
import { LiHTMLAttributes } from "react"
import { Button, ButtonProps } from "../elements/Button"
import { HTMLLi } from "../native-react/HTML.Li"
import { Icon, IconProps } from "../primitives/Icon"
import { Label, LabelProps } from "../primitives/Label"
import { combineClassNames } from "../utils/class-name"

export interface ListItemTreeProps extends LiHTMLAttributes<HTMLLIElement> {
  className?: string
  button?: ButtonProps
  icon?: IconProps
  icon2?: IconProps
  label?: LabelProps
  button2?: ButtonProps
  icon3?: IconProps
  button3?: ButtonProps
  icon4?: IconProps
}

/*****
 * List Item: Tree
 * Level: Element
 * Intent: List item used for tree-like structures with nested children.
 * Tags: list, tree, item, UI, row
 * Type: Default
 *
 * @example
 * ```tsx
 * <ListItemTree
 *   button={() => {}}
 *   icon="material-star"
 *   label="Button Label"
 *   button2={() => {}}
 *   button3={() => {}}
 * />
 * ```
 *****/
export function ListItemTree({
  className = "",
  button = sdn.button,
  icon = sdn.icon,
  icon2 = sdn.icon2,
  label = sdn.label,
  button2 = sdn.button2,
  icon3 = sdn.icon3,
  button3 = sdn.button3,
  icon4 = sdn.icon4,
  ...props
}: ListItemTreeProps) {
  const listItemTreeClassName = combineClassNames(
    "sdn-list-item-tree",
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
  const icon2Props = {
    ...sdn.icon2,
    ...icon2,
    className: combineClassNames(sdn.icon2?.className, icon2?.className),
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
  const icon3Props = {
    ...sdn.icon3,
    ...icon3,
    className: combineClassNames(sdn.icon3?.className, icon3?.className),
  }
  const button3Props = {
    ...sdn.button3,
    ...button3,
    className: combineClassNames(sdn.button3?.className, button3?.className),
  }
  const icon4Props = {
    ...sdn.icon4,
    ...icon4,
    className: combineClassNames(sdn.icon4?.className, icon4?.className),
  }

  return (
    <HTMLLi className={listItemTreeClassName} {...props}>
      <Button {...buttonProps} icon={iconProps} />
      <Icon {...icon2Props} />
      <Label {...labelProps} />
      <Button {...button2Props} icon={icon3Props} />
      <Button {...button3Props} icon={icon4Props} />
    </HTMLLi>
  )
}

//
// Default property values
//
const sdn: ListItemTreeProps = {
  button: {
    className: "sdn-button sdn-button-iconic--0urv",
  },
  icon: {
    icon: "material-chevronRight",
    className: "sdn-icon sdn-icon--k7a9",
  },
  icon2: {
    icon: "__default__",
    className: "sdn-icon sdn-icon--3pd3",
  },
  label: {
    children: "Tree Item",
    htmlElement: "label",
    className: "sdn-label sdn-label--tw9w",
  },
  button2: {
    className: "sdn-button sdn-button--iqez",
  },
  icon3: {
    icon: "material-add",
    className: "sdn-icon sdn-icon--k7a9",
  },
  button3: {
    className: "sdn-button sdn-button--iqez",
  },
  icon4: {
    icon: "material-close",
    className: "sdn-icon sdn-icon--k7a9",
  },
}

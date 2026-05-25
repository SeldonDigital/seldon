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
import { ButtonIconic, ButtonIconicProps } from "../elements/ButtonIconic"
import { HTMLLi } from "../native-react/HTML.Li"
import { IconProps } from "../primitives/Icon"
import { Label, LabelProps } from "../primitives/Label"
import { combineClassNames } from "../utils/class-name"

export interface ListItemTreeNodeProps extends LiHTMLAttributes<HTMLLIElement> {
  className?: string
  buttonIconic?: ButtonIconicProps
  icon?: IconProps
  buttonIconic2?: ButtonIconicProps
  icon2?: IconProps
  label?: LabelProps
  buttonIconic3?: ButtonIconicProps
  icon3?: IconProps
  buttonIconic4?: ButtonIconicProps
  icon4?: IconProps
}

/*****
 * List Item: TreeNode
 * Level: Element
 * Intent: List item used for tree-like structures with nested children.
 * Tags: list, tree, item, UI, row
 * Type: Custom
 *
 * @example
 * ```tsx
 * <ListItemTreeNode
 *   buttonIconic={() => {}}
 *   icon="material-star"
 *   buttonIconic2={() => {}}
 *   label="Button Label"
 *   buttonIconic3={() => {}}
 *   buttonIconic4={() => {}}
 * />
 * ```
 *****/
export function ListItemTreeNode({
  className = "",
  buttonIconic,
  icon = sdn.icon,
  buttonIconic2,
  icon2 = sdn.icon2,
  label = sdn.label,
  buttonIconic3,
  icon3 = sdn.icon3,
  buttonIconic4,
  icon4 = sdn.icon4,
  ...props
}: ListItemTreeNodeProps) {
  const listItemTreeNodeClassName = combineClassNames(
    "sdn-list-item-tree-node",
    className,
  )
  const buttonIconicProps = {
    ...sdn.buttonIconic,
    ...buttonIconic,
    className: combineClassNames(
      sdn.buttonIconic?.className,
      buttonIconic?.className,
    ),
  }
  const iconProps = {
    ...sdn.icon,
    ...icon,
    className: combineClassNames(sdn.icon?.className, icon?.className),
  }
  const buttonIconic2Props = {
    ...sdn.buttonIconic2,
    ...buttonIconic2,
    className: combineClassNames(
      sdn.buttonIconic2?.className,
      buttonIconic2?.className,
    ),
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
  const buttonIconic3Props = {
    ...sdn.buttonIconic3,
    ...buttonIconic3,
    className: combineClassNames(
      sdn.buttonIconic3?.className,
      buttonIconic3?.className,
    ),
  }
  const icon3Props = {
    ...sdn.icon3,
    ...icon3,
    className: combineClassNames(sdn.icon3?.className, icon3?.className),
  }
  const buttonIconic4Props = {
    ...sdn.buttonIconic4,
    ...buttonIconic4,
    className: combineClassNames(
      sdn.buttonIconic4?.className,
      buttonIconic4?.className,
    ),
  }
  const icon4Props = {
    ...sdn.icon4,
    ...icon4,
    className: combineClassNames(sdn.icon4?.className, icon4?.className),
  }

  return (
    <HTMLLi className={listItemTreeNodeClassName} {...props}>
      {buttonIconic && <ButtonIconic {...buttonIconicProps} icon={iconProps} />}
      {buttonIconic2 && (
        <ButtonIconic {...buttonIconic2Props} icon={icon2Props} />
      )}
      <Label {...labelProps} />
      {buttonIconic3 && (
        <ButtonIconic {...buttonIconic3Props} icon={icon3Props} />
      )}
      {buttonIconic4 && (
        <ButtonIconic {...buttonIconic4Props} icon={icon4Props} />
      )}
    </HTMLLi>
  )
}

//
// Default property values
//
const sdn: ListItemTreeNodeProps = {
  buttonIconic: {
    className: "sdn-button-iconic sdn-button-iconic--0urv",
  },
  icon: {
    icon: "material-chevronRight",
    className: "sdn-icon sdn-icon--1aaz",
  },
  buttonIconic2: {
    className: "sdn-button-iconic sdn-button-iconic--0urv",
  },
  icon2: {
    icon: "seldon-component",
    className: "sdn-icon sdn-icon--1aaz",
  },
  label: {
    children: "Node",
    htmlElement: "label",
    className: "sdn-label sdn-label--img8",
  },
  buttonIconic3: {
    className: "sdn-button-iconic sdn-button-iconic--1iqs",
  },
  icon3: {
    icon: "seldon-reset",
    className: "sdn-icon sdn-icon--1aaz",
  },
  buttonIconic4: {
    className: "sdn-button-iconic sdn-button-iconic--1iqs",
  },
  icon4: {
    icon: "material-more",
    className: "sdn-icon sdn-icon--1aaz",
  },
}

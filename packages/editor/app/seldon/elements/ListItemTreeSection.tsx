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

export interface ListItemTreeSectionProps
  extends LiHTMLAttributes<HTMLLIElement> {
  className?: string
  buttonIconic?: ButtonIconicProps
  icon?: IconProps
  label?: LabelProps
  buttonIconic2?: ButtonIconicProps
  icon2?: IconProps
}

/*****
 * List Item: TreeSection
 * Level: Element
 * Intent: List item used for tree-like structures with nested children.
 * Tags: list, tree, item, UI, row
 * Type: Custom
 *
 * @example
 * ```tsx
 * <ListItemTreeSection
 *   buttonIconic={() => {}}
 *   icon="material-star"
 *   label="Button Label"
 *   buttonIconic2={() => {}}
 * />
 * ```
 *****/
export function ListItemTreeSection({
  className = "",
  buttonIconic,
  icon = sdn.icon,
  label = sdn.label,
  buttonIconic2,
  icon2 = sdn.icon2,
  ...props
}: ListItemTreeSectionProps) {
  const listItemTreeSectionClassName = combineClassNames(
    "sdn-list-item-tree-section",
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
  const labelProps = {
    ...sdn.label,
    ...label,
    className: combineClassNames(sdn.label?.className, label?.className),
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

  return (
    <HTMLLi className={listItemTreeSectionClassName} {...props}>
      {buttonIconic && <ButtonIconic {...buttonIconicProps} icon={iconProps} />}
      <Label {...labelProps} />
      {buttonIconic2 && (
        <ButtonIconic {...buttonIconic2Props} icon={icon2Props} />
      )}
    </HTMLLi>
  )
}

//
// Default property values
//
const sdn: ListItemTreeSectionProps = {
  buttonIconic: {
    className: "sdn-button-iconic sdn-button-iconic--0urv",
  },
  icon: {
    icon: "seldon-component",
    className: "sdn-icon sdn-icon--1aaz",
  },
  label: {
    children: "Section Name",
    htmlElement: "label",
    className: "sdn-label sdn-label--j5nz",
  },
  buttonIconic2: {
    className: "sdn-button-iconic sdn-button-iconic--x8g1",
  },
  icon2: {
    icon: "material-unfoldMore",
    className: "sdn-icon sdn-icon--cjc4",
  },
}

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
import { LiHTMLAttributes, ReactNode } from "react"
import { ButtonIconic, ButtonIconicProps } from "../elements/ButtonIconic"
import { Frame, FrameProps } from "../frames/Frame"
import { HTMLLi } from "../native-react/HTML.Li"
import { IconProps } from "../primitives/Icon"
import { Label, LabelProps } from "../primitives/Label"
import { combineClassNames } from "../utils/class-name"

export interface ListItemTreeInputProps extends LiHTMLAttributes<HTMLLIElement> {
  className?: string
  buttonIconic?: ButtonIconicProps
  icon?: IconProps
  label?: LabelProps
  frame?: FrameProps
  buttonIconic2?: ButtonIconicProps
  icon2?: IconProps
  label2?: LabelProps
  label3?: LabelProps
  buttonIconic3?: ButtonIconicProps
  icon3?: IconProps
  buttonIconic4?: ButtonIconicProps
  icon4?: IconProps
  /** When provided, replaces the trailing `buttonIconic4` slot. */
  actionsSlot?: ReactNode
}

/*****
 * List Item: TreeInput
 * Level: Element
 * Intent: List item used for tree-like structures with nested children.
 * Tags: list, tree, item, UI, row
 * Type: Inline
 *
 * @example
 * ```tsx
 * <ListItemTreeInput
 *   buttonIconic={() => {}}
 *   icon="material-star"
 *   label="Button Label"
 *   frame="{}"
 *   label2="Button Label"
 *   buttonIconic2={() => {}}
 * />
 * ```
 *****/
export function ListItemTreeInput({
  className = "",
  buttonIconic = sdn.buttonIconic,
  icon = sdn.icon,
  label = sdn.label,
  frame = sdn.frame,
  buttonIconic2 = sdn.buttonIconic2,
  icon2 = sdn.icon2,
  label2 = sdn.label2,
  label3 = sdn.label3,
  buttonIconic3 = sdn.buttonIconic3,
  icon3 = sdn.icon3,
  buttonIconic4 = sdn.buttonIconic4,
  icon4 = sdn.icon4,
  actionsSlot,
  ...props
}: ListItemTreeInputProps) {
  const listItemTreeInputClassName = combineClassNames(
    "sdn-list-item-tree-input",
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
  const frameProps = {
    ...sdn.frame,
    ...frame,
    className: combineClassNames(sdn.frame?.className, frame?.className),
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
  const label2Props = {
    ...sdn.label2,
    ...label2,
    className: combineClassNames(sdn.label2?.className, label2?.className),
  }
  const label3Props = {
    ...sdn.label3,
    ...label3,
    className: combineClassNames(sdn.label3?.className, label3?.className),
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
    <HTMLLi className={listItemTreeInputClassName} {...props}>
      {buttonIconic && <ButtonIconic {...buttonIconicProps} icon={iconProps} />}
      <Label {...labelProps} />
      <Frame {...frameProps}>
        {buttonIconic2 && (
          <ButtonIconic {...buttonIconic2Props} icon={icon2Props} />
        )}
        {label2 && <Label {...label2Props} />}
        {label3 && <Label {...label3Props} />}
        {buttonIconic3 && (
          <ButtonIconic {...buttonIconic3Props} icon={icon3Props} />
        )}
      </Frame>
      {actionsSlot
        ? actionsSlot
        : buttonIconic4 && (
            <ButtonIconic {...buttonIconic4Props} icon={icon4Props} />
          )}
    </HTMLLi>
  )
}

//
// Default property values
//
const sdn: ListItemTreeInputProps = {
  icon: {
    icon: "material-chevronRight",
    className: "sdn-icon sdn-icon--1aaz",
  },
  label: {
    children: "Property",
    htmlElement: "label",
    className: "sdn-label sdn-label--vrkm",
  },
  buttonIconic2: {
    className: "sdn-button-iconic sdn-button-iconic--lube",
  },
  icon2: {
    icon: "seldon-component",
    className: "sdn-icon sdn-icon--1aaz",
  },
  label2: {
    children: "Property Value",
    htmlElement: "label",
    className: "sdn-label sdn-label--bji1",
  },
  label3: {
    children: "PX",
    htmlElement: "label",
    className: "sdn-label sdn-label--6qca",
  },
  buttonIconic3: {
    className: "sdn-button-iconic sdn-button-iconic--lube",
  },
  icon3: {
    icon: "material-chevronDown",
    className: "sdn-icon sdn-icon--1aaz",
  },
  icon4: {
    icon: "seldon-reset",
    className: "sdn-icon sdn-icon--1aaz",
  },
}

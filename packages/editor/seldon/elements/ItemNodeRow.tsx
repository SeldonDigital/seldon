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
import { LiHTMLAttributes } from "react"
import { ButtonIconic, ButtonIconicProps } from "../elements/ButtonIconic"
import { HTMLLi } from "../native-react/HTML.Li"
import { Icon, IconProps } from "../primitives/Icon"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { combineClassNames } from "../utils/class-name"

export interface ItemNodeRowProps extends LiHTMLAttributes<HTMLLIElement> {
  className?: string
  buttonIconic?: ButtonIconicProps | null
  icon?: IconProps | null
  icon2?: IconProps | null
  textLabel?: TextLabelProps | null
  buttonIconic2?: ButtonIconicProps | null
  icon3?: IconProps | null
  buttonIconic3?: ButtonIconicProps | null
  icon4?: IconProps | null
}

/*****
 * Item: ItemNodeRow
 * Level: Element
 * Intent: Default list item used for general content with flexible layout.
 * Tags: list, item, standard, default, row, UI, layout, general
 * Type: Custom
 *
 * @example
 * ```tsx
 * <ItemNodeRow
 *   buttonIconic={() => {}}
 *   icon="material-star"
 *   textLabel="{}"
 *   buttonIconic2={() => {}}
 *   buttonIconic3={() => {}}
 * />
 * ```
 *****/
export function ItemNodeRow({
  className = "",
  buttonIconic = sdn.buttonIconic,
  icon = sdn.icon,
  icon2 = sdn.icon2,
  textLabel,
  buttonIconic2 = sdn.buttonIconic2,
  icon3 = sdn.icon3,
  buttonIconic3 = sdn.buttonIconic3,
  icon4 = sdn.icon4,
  children,
  ...props
}: ItemNodeRowProps) {
  const itemNodeRowClassName = combineClassNames("sdn-item-node-row", className)
  const buttonIconicProps =
    buttonIconic === null
      ? null
      : {
          ...sdn.buttonIconic,
          ...buttonIconic,
          className: combineClassNames(
            sdn.buttonIconic?.className,
            buttonIconic?.className,
          ),
        }
  const iconProps =
    icon === null
      ? null
      : {
          ...sdn.icon,
          ...icon,
          className: combineClassNames(sdn.icon?.className, icon?.className),
        }
  const icon2Props =
    icon2 === null
      ? null
      : {
          ...sdn.icon2,
          ...icon2,
          className: combineClassNames(sdn.icon2?.className, icon2?.className),
        }
  const textLabelProps =
    textLabel === null
      ? null
      : {
          ...sdn.textLabel,
          ...textLabel,
          className: combineClassNames(
            sdn.textLabel?.className,
            textLabel?.className,
          ),
        }
  const buttonIconic2Props =
    buttonIconic2 === null
      ? null
      : {
          ...sdn.buttonIconic2,
          ...buttonIconic2,
          className: combineClassNames(
            sdn.buttonIconic2?.className,
            buttonIconic2?.className,
          ),
        }
  const icon3Props =
    icon3 === null
      ? null
      : {
          ...sdn.icon3,
          ...icon3,
          className: combineClassNames(sdn.icon3?.className, icon3?.className),
        }
  const buttonIconic3Props =
    buttonIconic3 === null
      ? null
      : {
          ...sdn.buttonIconic3,
          ...buttonIconic3,
          className: combineClassNames(
            sdn.buttonIconic3?.className,
            buttonIconic3?.className,
          ),
        }
  const icon4Props =
    icon4 === null
      ? null
      : {
          ...sdn.icon4,
          ...icon4,
          className: combineClassNames(sdn.icon4?.className, icon4?.className),
        }

  return (
    <HTMLLi className={itemNodeRowClassName} {...props}>
      {children !== undefined ? (
        children
      ) : (
        <>
          {buttonIconicProps !== null && (
            <ButtonIconic {...buttonIconicProps} icon={iconProps} />
          )}
          {icon2Props !== null && <Icon {...icon2Props} />}
          {textLabel && textLabelProps && <TextLabel {...textLabelProps} />}
          {buttonIconic2Props !== null && (
            <ButtonIconic {...buttonIconic2Props} icon={icon3Props} />
          )}
          {buttonIconic3Props !== null && (
            <ButtonIconic {...buttonIconic3Props} icon={icon4Props} />
          )}
        </>
      )}
    </HTMLLi>
  )
}

//
// Default property values
//
const sdn: ItemNodeRowProps = {
  buttonIconic: {
    className: "sdn-button-iconic sdn-button-iconic--eyvy",
  },
  icon: {
    icon: "material-keyboardArrowDown",
    className: "sdn-icon sdn-icon--v2wj",
  },
  icon2: {
    icon: "__default__",
    className: "sdn-icon sdn-icon--afcv",
  },
  textLabel: {
    className: "sdn-text-label sdn-text-label--duwf",
  },
  buttonIconic2: {
    className: "sdn-button-iconic sdn-button-iconic--eyvy",
  },
  icon3: {
    icon: "material-add",
    className: "sdn-icon sdn-icon--v2wj",
  },
  buttonIconic3: {
    className: "sdn-button-iconic sdn-button-iconic--eyvy",
  },
  icon4: {
    icon: "material-moreHoriz",
    className: "sdn-icon sdn-icon--v2wj",
  },
}

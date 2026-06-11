import { LiHTMLAttributes, ReactNode } from "react"
import { ButtonIconic, ButtonIconicProps } from "../../elements/ButtonIconic"
import { HTMLLi } from "../../native-react/HTML.Li"
import { Icon, IconProps } from "../../primitives/Icon"
import { TextLabel, TextLabelProps } from "../../primitives/TextLabel"
import { combineClassNames } from "../../utils/class-name"

export interface NodeRowProps extends LiHTMLAttributes<HTMLLIElement> {
  className?: string
  /** Leading disclosure button. Omit to render no disclosure slot. */
  buttonIconic?: ButtonIconicProps
  icon?: IconProps
  /** Plain type icon rendered between the disclosure and the label. */
  icon2?: IconProps
  textLabel?: TextLabelProps
  /** Mid action button (e.g. add). */
  buttonIconic2?: ButtonIconicProps
  icon3?: IconProps
  /** Trailing action button. Replaced by `actionsSlot` when provided. */
  buttonIconic3?: ButtonIconicProps
  icon4?: IconProps
  /** When provided, replaces the trailing `buttonIconic3` slot. */
  actionsSlot?: ReactNode
}

const sdn: NodeRowProps = {
  buttonIconic: {
    className: "sdn-button-iconic sdn-button-iconic--o4dt",
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

/**
 * Slot-driven version of the generated `ItemNodeRow`. Mirrors its markup and
 * classes but renders every slot conditionally and accepts an `actionsSlot`
 * node in place of the trailing button, which the generated row cannot do.
 */
export function NodeRow({
  className = "",
  buttonIconic,
  icon,
  icon2,
  textLabel,
  buttonIconic2,
  icon3,
  buttonIconic3,
  icon4,
  actionsSlot,
  ...props
}: NodeRowProps) {
  const nodeRowClassName = combineClassNames("sdn-item-node-row", className)
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
  const icon2Props = {
    ...sdn.icon2,
    ...icon2,
    className: combineClassNames(sdn.icon2?.className, icon2?.className),
  }
  const textLabelProps = {
    ...sdn.textLabel,
    ...textLabel,
    className: combineClassNames(
      sdn.textLabel?.className,
      textLabel?.className,
    ),
  }
  const buttonIconic2Props = {
    ...sdn.buttonIconic2,
    ...buttonIconic2,
    className: combineClassNames(
      sdn.buttonIconic2?.className,
      buttonIconic2?.className,
    ),
  }
  const icon3Props = {
    ...sdn.icon3,
    ...icon3,
    className: combineClassNames(sdn.icon3?.className, icon3?.className),
  }
  const buttonIconic3Props = {
    ...sdn.buttonIconic3,
    ...buttonIconic3,
    className: combineClassNames(
      sdn.buttonIconic3?.className,
      buttonIconic3?.className,
    ),
  }
  const icon4Props = {
    ...sdn.icon4,
    ...icon4,
    className: combineClassNames(sdn.icon4?.className, icon4?.className),
  }

  return (
    <HTMLLi className={nodeRowClassName} {...props}>
      {buttonIconic && <ButtonIconic {...buttonIconicProps} icon={iconProps} />}
      {icon2 && <Icon {...icon2Props} />}
      {textLabel && <TextLabel {...textLabelProps} />}
      {buttonIconic2 && (
        <ButtonIconic {...buttonIconic2Props} icon={icon3Props} />
      )}
      {actionsSlot
        ? actionsSlot
        : buttonIconic3 && (
            <ButtonIconic {...buttonIconic3Props} icon={icon4Props} />
          )}
    </HTMLLi>
  )
}

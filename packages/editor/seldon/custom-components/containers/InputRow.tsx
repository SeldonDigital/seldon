import { HTMLAttributes, LiHTMLAttributes, ReactNode } from "react"
import { ButtonIconic, ButtonIconicProps } from "../../elements/ButtonIconic"
import { Frame } from "../../frames/Frame"
import { HTMLLi } from "../../native-react/HTML.Li"
import { Icon, IconProps } from "../../primitives/Icon"
import { TextLabel, TextLabelProps } from "../../primitives/TextLabel"
import { combineClassNames } from "../../utils/class-name"

export interface InputRowProps extends LiHTMLAttributes<HTMLLIElement> {
  className?: string
  /** Leading disclosure button. Omit to render no disclosure slot. */
  buttonIconic?: ButtonIconicProps
  icon?: IconProps
  /** Property name label. */
  textLabel?: TextLabelProps
  /** Form control shell wrapping the value cell. */
  formControlIconic?: HTMLAttributes<HTMLDivElement>
  /** Value type icon inside the form control. */
  icon2?: IconProps
  /**
   * Value cell label inside the form control. Callers inject the rendered
   * value node through `children` with the established cast pattern.
   */
  textLabel2?: TextLabelProps
  /** Unit label (e.g. PX) rendered after the value. */
  textLabel3?: TextLabelProps
  /** Action button inside the form control (e.g. menu chevron, upload). */
  buttonIconic2?: ButtonIconicProps
  icon3?: IconProps
  /** Trailing action button. Replaced by `actionsSlot` when provided. */
  buttonIconic3?: ButtonIconicProps
  icon4?: IconProps
  /** When provided, replaces the trailing `buttonIconic3` slot. */
  actionsSlot?: ReactNode
}

const sdn: InputRowProps = {
  buttonIconic: {
    className: "sdn-button-iconic sdn-button-iconic--o4dt",
  },
  icon: {
    icon: "material-keyboardArrowRight",
    className: "sdn-icon sdn-icon--v2wj",
  },
  textLabel: {
    className: "sdn-text-label sdn-text-label--tnwc",
  },
  formControlIconic: {
    className:
      "sdn-form-control-iconic sdn-form-control-iconic--bpko",
  },
  icon2: {
    icon: "__default__",
    className: "sdn-icon sdn-icon--cfyh",
  },
  textLabel2: {
    className: "sdn-text-label",
  },
  textLabel3: {
    className: "sdn-text-label sdn-text-label--hljl",
  },
  buttonIconic2: {
    className: "sdn-button-iconic sdn-button-iconic--o4dt",
  },
  icon3: {
    icon: "material-keyboardArrowDown",
    className: "sdn-icon sdn-icon--v2wj",
  },
  buttonIconic3: {
    className: "sdn-button-iconic sdn-button-iconic--eyvy",
  },
  icon4: {
    icon: "seldon-more",
    className: "sdn-icon sdn-icon--v2wj",
  },
}

/**
 * Slot-driven version of the generated `ItemInputRow`. Mirrors its markup and
 * classes but accepts an arbitrary `valueSlot` node in place of the fixed
 * input, an optional `unitLabel`, and an `actionsSlot` in place of the
 * trailing button.
 */
export function InputRow({
  className = "",
  buttonIconic,
  icon,
  textLabel,
  formControlIconic,
  icon2,
  textLabel2,
  textLabel3,
  buttonIconic2,
  icon3,
  buttonIconic3,
  icon4,
  actionsSlot,
  ...props
}: InputRowProps) {
  const inputRowClassName = combineClassNames("sdn-item-input-row", className)
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
  const textLabelProps = {
    ...sdn.textLabel,
    ...textLabel,
    className: combineClassNames(
      sdn.textLabel?.className,
      textLabel?.className,
    ),
  }
  const formControlIconicProps = {
    ...sdn.formControlIconic,
    ...formControlIconic,
    className: combineClassNames(
      sdn.formControlIconic?.className,
      formControlIconic?.className,
    ),
  }
  const icon2Props = {
    ...sdn.icon2,
    ...icon2,
    className: combineClassNames(sdn.icon2?.className, icon2?.className),
  }
  const textLabel2Props = {
    ...sdn.textLabel2,
    ...textLabel2,
    className: combineClassNames(
      sdn.textLabel2?.className,
      textLabel2?.className,
    ),
  }
  const textLabel3Props = {
    ...sdn.textLabel3,
    ...textLabel3,
    className: combineClassNames(
      sdn.textLabel3?.className,
      textLabel3?.className,
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
    <HTMLLi className={inputRowClassName} {...props}>
      {buttonIconic && <ButtonIconic {...buttonIconicProps} icon={iconProps} />}
      {textLabel && <TextLabel {...textLabelProps} />}
      <Frame {...formControlIconicProps}>
        {icon2 && <Icon {...icon2Props} />}
        {textLabel2 && <TextLabel {...textLabel2Props} />}
        {textLabel3 && <TextLabel {...textLabel3Props} />}
        {buttonIconic2 && (
          <ButtonIconic {...buttonIconic2Props} icon={icon3Props} />
        )}
      </Frame>
      {actionsSlot
        ? actionsSlot
        : buttonIconic3 && (
            <ButtonIconic {...buttonIconic3Props} icon={icon4Props} />
          )}
    </HTMLLi>
  )
}

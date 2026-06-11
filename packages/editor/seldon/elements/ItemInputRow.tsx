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
import {
  FormControlIconic,
  FormControlIconicProps,
} from "../elements/FormControlIconic"
import { HTMLLi } from "../native-react/HTML.Li"
import { Icon, IconProps } from "../primitives/Icon"
import { Input, InputProps } from "../primitives/Input"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { combineClassNames } from "../utils/class-name"

export interface ItemInputRowProps extends LiHTMLAttributes<HTMLLIElement> {
  className?: string
  buttonIconic?: ButtonIconicProps
  icon?: IconProps
  textLabel?: TextLabelProps
  formControlIconic?: FormControlIconicProps
  icon2?: IconProps
  input?: InputProps
  textLabel2?: TextLabelProps
  buttonIconic2?: ButtonIconicProps
  icon3?: IconProps
  buttonIconic3?: ButtonIconicProps
  icon4?: IconProps
}

/*****
 * Item: ItemInputRow
 * Level: Element
 * Intent: Default list item used for general content with flexible layout.
 * Tags: list, item, standard, default, row, UI, layout, general
 * Type: Custom
 *
 * @example
 * ```tsx
 * <ItemInputRow
 *   buttonIconic={() => {}}
 *   icon="material-star"
 *   textLabel="{}"
 *   formControlIconic="{}"
 *   input="{}"
 *   buttonIconic2={() => {}}
 * />
 * ```
 *****/
export function ItemInputRow({
  className = "",
  buttonIconic = sdn.buttonIconic,
  icon = sdn.icon,
  textLabel,
  formControlIconic = sdn.formControlIconic,
  icon2 = sdn.icon2,
  input = sdn.input,
  textLabel2,
  buttonIconic2 = sdn.buttonIconic2,
  icon3 = sdn.icon3,
  buttonIconic3 = sdn.buttonIconic3,
  icon4 = sdn.icon4,
  ...props
}: ItemInputRowProps) {
  const itemInputRowClassName = combineClassNames(
    "sdn-item-input-row",
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
  const inputProps = {
    ...sdn.input,
    ...input,
    className: combineClassNames(sdn.input?.className, input?.className),
  }
  const textLabel2Props = {
    ...sdn.textLabel2,
    ...textLabel2,
    className: combineClassNames(
      sdn.textLabel2?.className,
      textLabel2?.className,
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
    <HTMLLi className={itemInputRowClassName} {...props}>
      <ButtonIconic {...buttonIconicProps} icon={iconProps} />
      {textLabel && <TextLabel {...textLabelProps} />}
      <FormControlIconic {...formControlIconicProps}>
        {icon2 && <Icon {...icon2Props} />}
        {input && <Input {...inputProps} />}
        {textLabel2 && <TextLabel {...textLabel2Props} />}
        {buttonIconic2 && (
          <ButtonIconic {...buttonIconic2Props} icon={icon3Props} />
        )}
      </FormControlIconic>
      <ButtonIconic {...buttonIconic3Props} icon={icon4Props} />
    </HTMLLi>
  )
}

//
// Default property values
//
const sdn: ItemInputRowProps = {
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
    className: "sdn-form-control-iconic sdn-form-control-iconic--bpko",
  },
  icon2: {
    icon: "__default__",
    className: "sdn-icon sdn-icon--v2wj",
  },
  input: {
    type: "text",
    className: "sdn-input sdn-input--edpy",
  },
  textLabel2: {
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

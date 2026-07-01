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
  FormControlComboboxControl,
  FormControlComboboxControlProps,
} from "../elements/FormControlComboboxControl"
import { HTMLLi } from "../native-react/HTML.Li"
import { IconProps } from "../primitives/Icon"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { applyRef } from "../utils/apply-ref"
import { combineClassNames } from "../utils/class-name"

export interface ItemSectionProps extends LiHTMLAttributes<HTMLLIElement> {
  className?: string
  "data-seldon-ref"?: string
  seldonRefs?: Record<string, Record<string, unknown>>
  buttonIconic?: ButtonIconicProps | null
  icon?: IconProps | null
  formControlComboboxControl?: FormControlComboboxControlProps | null
  textLabel?: TextLabelProps | null
  buttonIconic2?: ButtonIconicProps | null
  icon2?: IconProps | null
  buttonIconic3?: ButtonIconicProps | null
  icon3?: IconProps | null
}

/*****
 * Item: ItemSection
 * Level: Element
 * Intent: Default list item used for general content with flexible layout.
 * Tags: list, item, standard, default, row, UI, layout, general
 * Type: Custom
 *
 * @example
 * ```tsx
 * <ItemSection
 *   aria-hidden="false"
 *   buttonIconic={() => {}}
 *   icon="material-star"
 *   formControlComboboxControl="{}"
 *   textLabel="{}"
 *   buttonIconic2={() => {}}
 *   buttonIconic3={() => {}}
 * />
 * ```
 *****/
export function ItemSection({
  className = "",
  buttonIconic,
  icon = sdn.icon,
  formControlComboboxControl,
  textLabel,
  buttonIconic2,
  icon2 = sdn.icon2,
  buttonIconic3,
  icon3 = sdn.icon3,
  children,
  seldonRefs,
  ...props
}: ItemSectionProps) {
  const itemSectionClassName = combineClassNames("sdn-item-section", className)
  const buttonIconicProps = applyRef(
    seldonRefs,
    buttonIconic === null
      ? null
      : {
          ...sdn.buttonIconic,
          ...buttonIconic,
          className: combineClassNames(
            sdn.buttonIconic?.className,
            buttonIconic?.className,
          ),
        },
  )
  const iconProps = applyRef(
    seldonRefs,
    icon === null
      ? null
      : {
          ...sdn.icon,
          ...icon,
          className: combineClassNames(sdn.icon?.className, icon?.className),
        },
  )
  const formControlComboboxControlProps = applyRef(
    seldonRefs,
    formControlComboboxControl === null
      ? null
      : {
          ...sdn.formControlComboboxControl,
          ...formControlComboboxControl,
          className: combineClassNames(
            sdn.formControlComboboxControl?.className,
            formControlComboboxControl?.className,
          ),
        },
  )
  const textLabelProps = applyRef(
    seldonRefs,
    textLabel === null
      ? null
      : {
          ...sdn.textLabel,
          ...textLabel,
          className: combineClassNames(
            sdn.textLabel?.className,
            textLabel?.className,
          ),
        },
  )
  const buttonIconic2Props = applyRef(
    seldonRefs,
    buttonIconic2 === null
      ? null
      : {
          ...sdn.buttonIconic2,
          ...buttonIconic2,
          className: combineClassNames(
            sdn.buttonIconic2?.className,
            buttonIconic2?.className,
          ),
        },
  )
  const icon2Props = applyRef(
    seldonRefs,
    icon2 === null
      ? null
      : {
          ...sdn.icon2,
          ...icon2,
          className: combineClassNames(sdn.icon2?.className, icon2?.className),
        },
  )
  const buttonIconic3Props = applyRef(
    seldonRefs,
    buttonIconic3 === null
      ? null
      : {
          ...sdn.buttonIconic3,
          ...buttonIconic3,
          className: combineClassNames(
            sdn.buttonIconic3?.className,
            buttonIconic3?.className,
          ),
        },
  )
  const icon3Props = applyRef(
    seldonRefs,
    icon3 === null
      ? null
      : {
          ...sdn.icon3,
          ...icon3,
          className: combineClassNames(sdn.icon3?.className, icon3?.className),
        },
  )

  return (
    <HTMLLi
      className={itemSectionClassName}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    >
      {children !== undefined ? (
        children
      ) : (
        <>
          {buttonIconic && buttonIconicProps && (
            <ButtonIconic {...buttonIconicProps} icon={iconProps} />
          )}
          {formControlComboboxControl && formControlComboboxControlProps && (
            <FormControlComboboxControl {...formControlComboboxControlProps}>
              {textLabel && textLabelProps && <TextLabel {...textLabelProps} />}
            </FormControlComboboxControl>
          )}
          {buttonIconic2 && buttonIconic2Props && (
            <ButtonIconic {...buttonIconic2Props} icon={icon2Props} />
          )}
          {buttonIconic3 && buttonIconic3Props && (
            <ButtonIconic {...buttonIconic3Props} icon={icon3Props} />
          )}
        </>
      )}
    </HTMLLi>
  )
}

//
// Default property values
//
const sdn: ItemSectionProps = {
  "aria-hidden": "false",
  className: "sdn-item-section sdn-item",
  buttonIconic: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
    "data-seldon-ref": "sectionToggle",
  },
  icon: {
    icon: "material-unfoldMore",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--7mkl",
    "data-seldon-ref": "sectionToggleIcon",
  },
  formControlComboboxControl: {
    className: "sdn-form-control sdn-form-control-combobox-control--qmop",
  },
  textLabel: {
    className: "sdn-text-label sdn-text-label--z34z",
    "data-seldon-ref": "sectionLabel",
  },
  buttonIconic2: {
    className: "sdn-button-iconic sdn-button-iconic--sdjv",
    "data-seldon-ref": "sectionAdd",
  },
  icon2: {
    icon: "material-add",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--7mkl",
  },
  buttonIconic3: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
    "data-seldon-ref": "sectionActions",
  },
  icon3: {
    icon: "seldon-more",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--7mkl",
  },
}

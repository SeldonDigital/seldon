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
import { HTMLAttributes } from "react"

import { MenuItemRadio, MenuItemRadioProps } from "../elements/MenuItemRadio"
import { Frame, FrameProps } from "../frames/Frame"
import { Icon, IconProps } from "../primitives/Icon"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { applyRef } from "../utils/apply-ref"
import { combineClassNames } from "../utils/class-name"

export interface FormControlRadioProps extends HTMLAttributes<HTMLElement> {
  className?: string
  "data-seldon-ref"?: string
  seldonRefs?: Record<string, Record<string, unknown>>
  textLabel?: TextLabelProps | null
  frame?: FrameProps | null
  menuItemRadio?: MenuItemRadioProps | null
  icon?: IconProps | null
  textLabel2?: TextLabelProps | null
  menuItemRadio2?: MenuItemRadioProps | null
  icon2?: IconProps | null
  textLabel3?: TextLabelProps | null
}

/*****
 * Form Control: FormControlRadio
 * Level: Element
 * Intent: Captures plain text input from the user for forms or interactions.
 * Tags: UI, UI control, binary, boolean, checkbox, choice, control, decorated, dropdown, editable, exclusive, field, form, icon, input, menu, options, query, radio, search, select, single choice, text, toggle, user entry
 * Type: Inline
 *
 * @example
 * ```tsx
 * <FormControlRadio
 *   aria-hidden="false"
 *   textLabel="{}"
 *   frame="{}"
 *   menuItemRadio="{}"
 *   icon="material-star"
 *   menuItemRadio2="{}"
 * />
 * ```
 *****/
export function FormControlRadio({
  className = "",
  textLabel,
  frame = sdn.frame,
  menuItemRadio,
  icon = sdn.icon,
  textLabel2,
  menuItemRadio2,
  icon2 = sdn.icon2,
  textLabel3,
  children,
  seldonRefs,
  ...props
}: FormControlRadioProps) {
  const formControlRadioClassName = combineClassNames(
    "sdn-form-control",
    className,
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
  const frameProps = applyRef(
    seldonRefs,
    frame === null
      ? null
      : {
          ...sdn.frame,
          ...frame,
          className: combineClassNames(sdn.frame?.className, frame?.className),
        },
  )
  const menuItemRadioProps = applyRef(
    seldonRefs,
    menuItemRadio === null
      ? null
      : {
          ...sdn.menuItemRadio,
          ...menuItemRadio,
          className: combineClassNames(
            sdn.menuItemRadio?.className,
            menuItemRadio?.className,
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
  const textLabel2Props = applyRef(
    seldonRefs,
    textLabel2 === null
      ? null
      : {
          ...sdn.textLabel2,
          ...textLabel2,
          className: combineClassNames(
            sdn.textLabel2?.className,
            textLabel2?.className,
          ),
        },
  )
  const menuItemRadio2Props = applyRef(
    seldonRefs,
    menuItemRadio2 === null
      ? null
      : {
          ...sdn.menuItemRadio2,
          ...menuItemRadio2,
          className: combineClassNames(
            sdn.menuItemRadio2?.className,
            menuItemRadio2?.className,
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
  const textLabel3Props = applyRef(
    seldonRefs,
    textLabel3 === null
      ? null
      : {
          ...sdn.textLabel3,
          ...textLabel3,
          className: combineClassNames(
            sdn.textLabel3?.className,
            textLabel3?.className,
          ),
        },
  )

  return (
    <Frame
      className={formControlRadioClassName}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    >
      {children !== undefined ? (
        children
      ) : (
        <>
          {textLabel && textLabelProps && <TextLabel {...textLabelProps} />}
          <Frame {...frameProps}>
            {menuItemRadio && menuItemRadioProps && (
              <MenuItemRadio {...menuItemRadioProps}>
                {icon && iconProps && <Icon {...iconProps} />}
                {textLabel2 && textLabel2Props && (
                  <TextLabel {...textLabel2Props} />
                )}
              </MenuItemRadio>
            )}
            {menuItemRadio2 && menuItemRadio2Props && (
              <MenuItemRadio {...menuItemRadio2Props}>
                {icon2 && icon2Props && <Icon {...icon2Props} />}
                {textLabel3 && textLabel3Props && (
                  <TextLabel {...textLabel3Props} />
                )}
              </MenuItemRadio>
            )}
          </Frame>
        </>
      )}
    </Frame>
  )
}

//
// Default property values
//
const sdn: FormControlRadioProps = {
  "aria-hidden": "false",
  className: "sdn-form-control",
  textLabel: {
    className: "sdn-text-label sdn-text-label--fwkw",
  },
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--pgac",
  },
  menuItemRadio: {
    className: "sdn-menu-item sdn-menu-item-radio--mezf",
  },
  icon: {
    icon: "material-radioButtonChecked",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--3qou",
  },
  textLabel2: {
    className: "sdn-text-label sdn-text-label--xohb",
  },
  menuItemRadio2: {
    className: "sdn-menu-item sdn-menu-item-radio--mezf",
  },
  icon2: {
    icon: "material-radioButtonChecked",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--3qou",
  },
  textLabel3: {
    className: "sdn-text-label sdn-text-label--xohb",
  },
}

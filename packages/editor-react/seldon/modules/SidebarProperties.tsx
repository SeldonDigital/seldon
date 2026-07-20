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

import { ButtonIconicProps } from "../elements/ButtonIconic"
import { ButtonMenu, ButtonMenuProps } from "../elements/ButtonMenu"
import {
  ComboboxFieldFilter,
  ComboboxFieldFilterProps,
} from "../elements/ComboboxFieldFilter"
import { Frame, FrameProps } from "../frames/Frame"
import { HTMLDiv } from "../native-react/HTML.Div"
import { Icon, IconProps } from "../primitives/Icon"
import { InputProps } from "../primitives/Input"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { applyRef } from "../utils/apply-ref"
import { combineClassNames } from "../utils/class-name"

export interface SidebarPropertiesProps extends HTMLAttributes<HTMLElement> {
  className?: string
  "data-seldon-ref"?: string
  seldonRefs?: Record<string, Record<string, unknown>>
  frame?: FrameProps | null
  comboboxFieldFilter?: ComboboxFieldFilterProps | null
  icon?: IconProps | null
  input?: InputProps | null
  buttonIconic?: ButtonIconicProps | null
  icon2?: IconProps | null
  buttonMenu?: ButtonMenuProps | null
  textLabel?: TextLabelProps | null
  icon3?: IconProps | null
  frame2?: FrameProps | null
}

/*****
 * Sidebar: SidebarProperties
 * Level: Module
 * Intent: Provides a structured sidebar panel with tabbed navigation, content area, and status footer for application interfaces.
 * Tags: sidebar, panel, module, ui, layout, navigation, tabs, structured
 * Type: Inline
 *
 * @example
 * ```tsx
 * <SidebarProperties
 *   role="complementary"
 *   aria-hidden="false"
 * />
 * ```
 *****/
export function SidebarProperties({
  className = "",
  frame = sdn.frame,
  comboboxFieldFilter,
  icon = sdn.icon,
  input = sdn.input,
  buttonIconic = sdn.buttonIconic,
  icon2 = sdn.icon2,
  buttonMenu,
  textLabel,
  icon3 = sdn.icon3,
  frame2 = sdn.frame2,
  children,
  seldonRefs,
  ...props
}: SidebarPropertiesProps) {
  const sidebarPropertiesClassName = combineClassNames(
    "sdn-sidebar-objects",
    className,
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
  const comboboxFieldFilterProps = applyRef(
    seldonRefs,
    comboboxFieldFilter === null
      ? null
      : {
          ...sdn.comboboxFieldFilter,
          ...comboboxFieldFilter,
          className: combineClassNames(
            sdn.comboboxFieldFilter?.className,
            comboboxFieldFilter?.className,
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
  const inputProps = applyRef(
    seldonRefs,
    input === null
      ? null
      : {
          ...sdn.input,
          ...input,
          className: combineClassNames(sdn.input?.className, input?.className),
        },
  )
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
  const buttonMenuProps = applyRef(
    seldonRefs,
    buttonMenu === null
      ? null
      : {
          ...sdn.buttonMenu,
          ...buttonMenu,
          className: combineClassNames(
            sdn.buttonMenu?.className,
            buttonMenu?.className,
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
  const frame2Props = applyRef(
    seldonRefs,
    frame2 === null
      ? null
      : {
          ...sdn.frame2,
          ...frame2,
          className: combineClassNames(
            sdn.frame2?.className,
            frame2?.className,
          ),
        },
  )

  return (
    <HTMLDiv
      className={sidebarPropertiesClassName}
      role={sdn["role"]}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    >
      {children !== undefined ? (
        children
      ) : (
        <>
          <Frame {...frameProps}>
            {comboboxFieldFilter && comboboxFieldFilterProps && (
              <ComboboxFieldFilter
                {...comboboxFieldFilterProps}
                icon={iconProps}
                input={inputProps}
                buttonIconic={buttonIconicProps}
                icon2={icon2Props}
              />
            )}
            {buttonMenu && buttonMenuProps && (
              <ButtonMenu {...buttonMenuProps}>
                {textLabel && textLabelProps && (
                  <TextLabel {...textLabelProps} />
                )}
                {icon3 && icon3Props && <Icon {...icon3Props} />}
              </ButtonMenu>
            )}
          </Frame>
          <Frame {...frame2Props}></Frame>
        </>
      )}
    </HTMLDiv>
  )
}

//
// Default property values
//
const sdn: SidebarPropertiesProps = {
  role: "complementary",
  "aria-hidden": "false",
  className: "sdn-sidebar-objects sdn-sidebar",
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--uief",
  },
  comboboxFieldFilter: {
    className: "sdn-combobox-field sdn-combobox-field-project--rzdy",
  },
  icon: {
    icon: "material-filterList",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
  },
  input: {
    placeholder: "Filter...",
    type: "text",
    role: "combobox",
    "aria-haspopup": "listbox",
    className: "sdn-input sdn-input--twyx",
    "data-seldon-ref": "propertyFilter",
  },
  buttonIconic: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
    "data-seldon-ref": "propertyFilterClear",
  },
  icon2: {
    icon: "material-close",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--vsau",
  },
  buttonMenu: {
    className: "sdn-button-menu sdn-button-menu--t1a2",
    "data-seldon-ref": "menuState",
  },
  textLabel: {
    className: "sdn-text-label sdn-text-label--sa6t",
  },
  icon3: {
    icon: "material-chevronDown",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--y2ct",
  },
  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--evmw",
    "data-seldon-ref": "propertiesContainer",
  },
}

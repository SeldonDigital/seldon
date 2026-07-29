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
import { ComboboxFieldFilter, ComboboxFieldFilterProps } from "../elements/ComboboxFieldFilter"
import { Frame, FrameProps } from "../frames/Frame"
import { HTMLDiv } from "../native-react/HTML.Div"
import { Icon, IconProps } from "../primitives/Icon"
import { InputProps } from "../primitives/Input"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface SidebarPropertiesProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

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

//
// Default property values
//
const sdn: SidebarPropertiesProps = {
  role: "complementary",
  "aria-hidden": "false",
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
    children: "State",
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

/**
 * Sidebar: SidebarProperties
 * Level: Module
 * Intent: Provides a structured sidebar panel with tabbed navigation, content area, and status footer for application interfaces.
 * Tags: sidebar, panel, module, ui, layout, navigation, tabs, structured
 * Type: Inline
 *
 * Structure:
 *   Frame                  frame
 *     ComboboxFieldFilter  comboboxFieldFilter
 *       Icon               icon
 *       Input              input                -> propertyFilter
 *       ButtonIconic       buttonIconic         -> propertyFilterClear
 *         Icon             icon2
 *     ButtonMenu           buttonMenu           -> menuState
 *       TextLabel          textLabel
 *       Icon               icon3
 *   Frame                  frame2               -> propertiesContainer
 *
 * @example
 * ```tsx
 * <SidebarProperties
 *   role="complementary"
 *   aria-hidden="false"
 * />
 * ```
 */
export function SidebarProperties({
  className = "",
  frame,
  comboboxFieldFilter,
  icon,
  input,
  buttonIconic,
  icon2,
  buttonMenu,
  textLabel,
  icon3,

  frame2,

  children,
  seldonRefs,
  ...props
}: SidebarPropertiesProps) {
  const sidebarPropertiesClassName = combineClassNames("sdn-sidebar-objects", className)

  const frameProps = mergeSlot(sdn.frame, frame, seldonRefs)
  const comboboxFieldFilterProps = mergeOptionalSlot(
    sdn.comboboxFieldFilter,
    comboboxFieldFilter,
    seldonRefs,
  )
  const iconProps = mergeSlot(sdn.icon, icon, seldonRefs)
  const inputProps = mergeSlot(sdn.input, input, seldonRefs)
  const buttonIconicProps = mergeSlot(sdn.buttonIconic, buttonIconic, seldonRefs)
  const icon2Props = mergeSlot(sdn.icon2, icon2, seldonRefs)
  const buttonMenuProps = mergeOptionalSlot(sdn.buttonMenu, buttonMenu, seldonRefs)
  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)
  const icon3Props = mergeSlot(sdn.icon3, icon3, seldonRefs)

  const frame2Props = mergeSlot(sdn.frame2, frame2, seldonRefs)

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
            {comboboxFieldFilterProps !== null && (
              <ComboboxFieldFilter
                {...comboboxFieldFilterProps}
                icon={iconProps}
                input={inputProps}
                buttonIconic={buttonIconicProps}
                icon2={icon2Props}
              />
            )}
            {buttonMenuProps !== null && (
              <ButtonMenu {...buttonMenuProps}>
                {textLabelProps !== null && <TextLabel {...textLabelProps} />}
                {icon3Props !== null && <Icon {...icon3Props} />}
              </ButtonMenu>
            )}
          </Frame>
          <Frame {...frame2Props}></Frame>
        </>
      )}
    </HTMLDiv>
  )
}

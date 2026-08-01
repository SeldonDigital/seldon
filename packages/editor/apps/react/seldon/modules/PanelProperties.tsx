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

import { ButtonIconic, ButtonIconicProps } from "../elements/ButtonIconic"
import { ButtonMenu, ButtonMenuProps } from "../elements/ButtonMenu"
import { ComboboxFieldFilter, ComboboxFieldFilterProps } from "../elements/ComboboxFieldFilter"
import { Frame, FrameProps } from "../frames/Frame"
import { HTMLDiv } from "../native-react/HTML.Div"
import { Bar, BarProps } from "../parts/Bar"
import { Icon, IconProps } from "../primitives/Icon"
import { InputProps } from "../primitives/Input"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface PanelPropertiesProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  bar?: BarProps | null
  buttonMenu?: ButtonMenuProps | null
  textLabel?: TextLabelProps | null
  icon?: IconProps | null
  buttonIconic?: ButtonIconicProps | null
  icon2?: IconProps | null

  frame?: FrameProps | null

  comboboxFieldFilter?: ComboboxFieldFilterProps | null
  icon3?: IconProps | null
  input?: InputProps | null
  buttonIconic2?: ButtonIconicProps | null
  icon4?: IconProps | null
}

//
// Default property values
//
const sdn: PanelPropertiesProps = {
  role: "dialog",
  "aria-hidden": "false",
  bar: {
    "aria-hidden": "false",
    className: "sdn-bar sdn-bar--9xs7",
  },
  buttonMenu: {
    className: "sdn-button-menu sdn-button-menu--jufk",
  },
  textLabel: {
    children: "State",
    className: "sdn-text-label sdn-text-label--kasa",
  },
  icon: {
    icon: "material-chevronDown",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--y2ct",
  },
  buttonIconic: {
    className: "sdn-button-iconic sdn-button-iconic--obd2",
  },
  icon2: {
    icon: "material-close",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--4d5e",
  },

  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--snek",
  },

  comboboxFieldFilter: {
    className: "sdn-combobox-field sdn-combobox-field-filter--2si7",
  },
  icon3: {
    icon: "material-filterList",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
  },
  input: {
    placeholder: "Filter...",
    type: "text",
    role: "combobox",
    "aria-haspopup": "listbox",
    className: "sdn-input sdn-input--yoqi",
  },
  buttonIconic2: {
    className: "sdn-button-iconic sdn-button-iconic--6gst",
  },
  icon4: {
    icon: "material-close",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--vsau",
  },
}

/**
 * Panel: PanelProperties
 * Level: Module
 * Intent: Schema for modal-style dialog panels with overlay behavior, used for alerts, confirmations, or embedded interactive content.
 * Tags: panel, dialog, modal, ui, overlay, popup, interaction, alert
 * Type: Inline
 *
 * Structure:
 *   Bar                  bar
 *     ButtonMenu         buttonMenu
 *       TextLabel        textLabel
 *       Icon             icon
 *     ButtonIconic       buttonIconic
 *       Icon             icon2
 *   Frame                frame
 *   ComboboxFieldFilter  comboboxFieldFilter
 *     Icon               icon3
 *     Input              input
 *     ButtonIconic       buttonIconic2
 *       Icon             icon4
 *
 * @example
 * ```tsx
 * <PanelProperties
 *   role="dialog"
 *   aria-hidden="false"
 * />
 * ```
 */
export function PanelProperties({
  className = "",
  bar,
  buttonMenu,
  textLabel,
  icon,
  buttonIconic,
  icon2,

  frame,

  comboboxFieldFilter,
  icon3,
  input,
  buttonIconic2,
  icon4,

  children,
  seldonRefs,
  ...props
}: PanelPropertiesProps) {
  const panelPropertiesClassName = combineClassNames("sdn-panel-properties", className)

  const barProps = mergeSlot(sdn.bar, bar, seldonRefs)
  const buttonMenuProps = mergeOptionalSlot(sdn.buttonMenu, buttonMenu, seldonRefs)
  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)
  const iconProps = mergeSlot(sdn.icon, icon, seldonRefs)
  const buttonIconicProps = mergeSlot(sdn.buttonIconic, buttonIconic, seldonRefs)
  const icon2Props = mergeSlot(sdn.icon2, icon2, seldonRefs)

  const frameProps = mergeSlot(sdn.frame, frame, seldonRefs)

  const comboboxFieldFilterProps = mergeOptionalSlot(
    sdn.comboboxFieldFilter,
    comboboxFieldFilter,
    seldonRefs,
  )
  const icon3Props = mergeSlot(sdn.icon3, icon3, seldonRefs)
  const inputProps = mergeSlot(sdn.input, input, seldonRefs)
  const buttonIconic2Props = mergeSlot(sdn.buttonIconic2, buttonIconic2, seldonRefs)
  const icon4Props = mergeSlot(sdn.icon4, icon4, seldonRefs)

  return (
    <HTMLDiv
      className={panelPropertiesClassName}
      role={sdn["role"]}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    >
      {children !== undefined ? (
        children
      ) : (
        <>
          {barProps !== null && (
            <Bar {...barProps}>
              {buttonMenuProps !== null && (
                <ButtonMenu {...buttonMenuProps}>
                  {textLabelProps !== null && <TextLabel {...textLabelProps} />}
                  {iconProps !== null && <Icon {...iconProps} />}
                </ButtonMenu>
              )}
              {buttonIconicProps !== null && (
                <ButtonIconic {...buttonIconicProps} icon={icon2Props} />
              )}
            </Bar>
          )}
          <Frame {...frameProps}></Frame>
          {comboboxFieldFilterProps !== null && (
            <ComboboxFieldFilter
              {...comboboxFieldFilterProps}
              icon={icon3Props}
              input={inputProps}
              buttonIconic={buttonIconic2Props}
              icon2={icon4Props}
            />
          )}
        </>
      )}
    </HTMLDiv>
  )
}

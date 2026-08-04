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

import { ButtonMenu, ButtonMenuProps } from "../elements/ButtonMenu"
import { Frame } from "../frames/Frame"
import { Icon, IconProps } from "../primitives/Icon"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface BarStateProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  buttonMenu?: ButtonMenuProps | null
  textLabel?: TextLabelProps | null
  icon?: IconProps | null
}

//
// Default property values
//
const sdn: BarStateProps = {
  "aria-hidden": "false",
  buttonMenu: {
    className: "sdn-button-menu sdn-button-iconic--pgsr",
    "data-seldon-ref": "propertyState",
  },
  textLabel: {
    children: "Button Menu",
    className: "sdn-text-label sdn-text-label--sa6t",
    "data-seldon-ref": "propertyStateLabel",
  },
  icon: {
    icon: "material-chevronDown",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--y2ct",
    "data-seldon-ref": "propertyStateIcon",
  },
}

/**
 * Bar: BarState
 * Level: Part
 * Intent: Groups related controls in a horizontal bar with buttons, navigation, or tabs layouts.
 * Tags: bar, controls, buttons, navigation, tabs, UI, layout, group
 * Type: Custom
 *
 * Structure:
 *   ButtonMenu   buttonMenu  -> propertyState
 *     TextLabel  textLabel   -> propertyStateLabel
 *     Icon       icon        -> propertyStateIcon
 *
 * @example
 * ```tsx
 * <BarState
 *   aria-hidden="false"
 *   buttonMenu={() => {}}
 *   textLabel="{}"
 *   icon="material-star"
 * />
 * ```
 */
export function BarState({
  className = "",
  buttonMenu,
  textLabel,
  icon,

  children,
  seldonRefs,
  ...props
}: BarStateProps) {
  const barStateClassName = combineClassNames("sdn-bar-state", className)

  const buttonMenuProps = mergeOptionalSlot(sdn.buttonMenu, buttonMenu, seldonRefs)
  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)
  const iconProps = mergeSlot(sdn.icon, icon, seldonRefs)

  return (
    <Frame className={barStateClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
      {children !== undefined ? (
        children
      ) : (
        <>
          {buttonMenuProps !== null && (
            <ButtonMenu {...buttonMenuProps}>
              {textLabelProps !== null && <TextLabel {...textLabelProps} />}
              {iconProps !== null && <Icon {...iconProps} />}
            </ButtonMenu>
          )}
        </>
      )}
    </Frame>
  )
}

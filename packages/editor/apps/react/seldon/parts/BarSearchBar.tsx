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
import { ComboboxFieldSearch, ComboboxFieldSearchProps } from "../elements/ComboboxFieldSearch"
import { Frame } from "../frames/Frame"
import { IconProps } from "../primitives/Icon"
import { InputProps } from "../primitives/Input"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeSlot } from "../utils/merge-slot"

export interface BarSearchBarProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  comboboxFieldSearch?: ComboboxFieldSearchProps | null
  icon?: IconProps | null
  input?: InputProps | null
  buttonIconic?: ButtonIconicProps | null
  icon2?: IconProps | null
}

//
// Default property values
//
const sdn: BarSearchBarProps = {
  "aria-hidden": "false",
  comboboxFieldSearch: {
    "aria-hidden": "false",
    className: "sdn-combobox-field-search sdn-combobox-field-search--vbyg",
  },
  icon: {
    icon: "material-search",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--ucf5",
  },
  input: {
    placeholder: "Search for...",
    type: "text",
    role: "combobox",
    "aria-haspopup": "listbox",
    className: "sdn-input sdn-input--stob",
  },
  buttonIconic: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
  },
  icon2: {
    icon: "material-close",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--rezm",
  },
}

/**
 * Bar: BarSearchBar
 * Level: Part
 * Intent: Groups related controls in a horizontal bar with buttons, navigation, or tabs layouts.
 * Tags: bar, controls, buttons, navigation, tabs, UI, layout, group
 * Type: Custom
 *
 * Structure:
 *   ComboboxFieldSearch  comboboxFieldSearch
 *     Icon               icon
 *     Input              input
 *     ButtonIconic       buttonIconic
 *       Icon             icon2
 *
 * @example
 * ```tsx
 * <BarSearchBar
 *   aria-hidden="false"
 *   comboboxFieldSearch="{}"
 *   icon="material-star"
 *   input="{}"
 *   buttonIconic={() => {}}
 * />
 * ```
 */
export function BarSearchBar({
  className = "",
  comboboxFieldSearch,
  icon,
  input,
  buttonIconic,
  icon2,

  children,
  seldonRefs,
  ...props
}: BarSearchBarProps) {
  const barSearchBarClassName = combineClassNames("sdn-bar", className)

  const comboboxFieldSearchProps = mergeSlot(
    sdn.comboboxFieldSearch,
    comboboxFieldSearch,
    seldonRefs,
  )
  const iconProps = mergeSlot(sdn.icon, icon, seldonRefs)
  const inputProps = mergeSlot(sdn.input, input, seldonRefs)
  const buttonIconicProps = mergeSlot(sdn.buttonIconic, buttonIconic, seldonRefs)
  const icon2Props = mergeSlot(sdn.icon2, icon2, seldonRefs)

  return (
    <Frame className={barSearchBarClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
      {children !== undefined ? (
        children
      ) : (
        <>
          {comboboxFieldSearchProps !== null && (
            <ComboboxFieldSearch
              {...comboboxFieldSearchProps}
              icon={iconProps}
              input={inputProps}
              buttonIconic={buttonIconicProps}
              icon2={icon2Props}
            />
          )}
        </>
      )}
    </Frame>
  )
}

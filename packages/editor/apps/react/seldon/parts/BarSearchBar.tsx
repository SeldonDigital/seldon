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
import {
  ComboboxFieldSearch,
  ComboboxFieldSearchProps,
} from "../elements/ComboboxFieldSearch"
import { Frame } from "../frames/Frame"
import { IconProps } from "../primitives/Icon"
import { InputProps } from "../primitives/Input"
import { applyRef } from "../utils/apply-ref"
import { combineClassNames } from "../utils/class-name"

export interface BarSearchBarProps extends HTMLAttributes<HTMLElement> {
  className?: string
  "data-seldon-ref"?: string
  seldonRefs?: Record<string, Record<string, unknown>>
  comboboxFieldSearch?: ComboboxFieldSearchProps | null
  icon?: IconProps | null
  input?: InputProps | null
  buttonIconic?: ButtonIconicProps | null
  icon2?: IconProps | null
}

/*****
 * Bar: BarSearchBar
 * Level: Part
 * Intent: Groups related controls in a horizontal bar with buttons, navigation, or tabs layouts.
 * Tags: bar, controls, buttons, navigation, tabs, UI, layout, group
 * Type: Custom
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
 *****/
export function BarSearchBar({
  className = "",
  comboboxFieldSearch = sdn.comboboxFieldSearch,
  icon = sdn.icon,
  input = sdn.input,
  buttonIconic = sdn.buttonIconic,
  icon2 = sdn.icon2,
  children,
  seldonRefs,
  ...props
}: BarSearchBarProps) {
  const barSearchBarClassName = combineClassNames("sdn-bar", className)
  const comboboxFieldSearchProps = applyRef(
    seldonRefs,
    comboboxFieldSearch === null
      ? null
      : {
          ...sdn.comboboxFieldSearch,
          ...comboboxFieldSearch,
          className: combineClassNames(
            sdn.comboboxFieldSearch?.className,
            comboboxFieldSearch?.className,
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

  return (
    <Frame
      className={barSearchBarClassName}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    >
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

//
// Default property values
//
const sdn: BarSearchBarProps = {
  "aria-hidden": "false",
  className: "sdn-bar",
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

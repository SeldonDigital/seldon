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
  ComboboxFieldSearchField,
  ComboboxFieldSearchFieldProps,
} from "../elements/ComboboxFieldSearchField"
import { Frame } from "../frames/Frame"
import { IconProps } from "../primitives/Icon"
import { InputProps } from "../primitives/Input"
import { combineClassNames } from "../utils/class-name"

export interface BarSearchBarProps extends HTMLAttributes<HTMLElement> {
  className?: string
  comboboxFieldSearchField?: ComboboxFieldSearchFieldProps | null
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
 *   comboboxFieldSearchField="{}"
 *   icon="material-star"
 *   input="{}"
 *   buttonIconic={() => {}}
 * />
 * ```
 *****/
export function BarSearchBar({
  className = "",
  comboboxFieldSearchField = sdn.comboboxFieldSearchField,
  icon = sdn.icon,
  input = sdn.input,
  buttonIconic = sdn.buttonIconic,
  icon2 = sdn.icon2,
  children,
  ...props
}: BarSearchBarProps) {
  const barSearchBarClassName = combineClassNames("sdn-bar", className)
  const comboboxFieldSearchFieldProps =
    comboboxFieldSearchField === null
      ? null
      : {
          ...sdn.comboboxFieldSearchField,
          ...comboboxFieldSearchField,
          className: combineClassNames(
            sdn.comboboxFieldSearchField?.className,
            comboboxFieldSearchField?.className,
          ),
        }
  const iconProps =
    icon === null
      ? null
      : {
          ...sdn.icon,
          ...icon,
          className: combineClassNames(sdn.icon?.className, icon?.className),
        }
  const inputProps =
    input === null
      ? null
      : {
          ...sdn.input,
          ...input,
          className: combineClassNames(sdn.input?.className, input?.className),
        }
  const buttonIconicProps =
    buttonIconic === null
      ? null
      : {
          ...sdn.buttonIconic,
          ...buttonIconic,
          className: combineClassNames(
            sdn.buttonIconic?.className,
            buttonIconic?.className,
          ),
        }
  const icon2Props =
    icon2 === null
      ? null
      : {
          ...sdn.icon2,
          ...icon2,
          className: combineClassNames(sdn.icon2?.className, icon2?.className),
        }

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
          {comboboxFieldSearchFieldProps !== null && (
            <ComboboxFieldSearchField
              {...comboboxFieldSearchFieldProps}
              icon={iconProps}
              input={inputProps}
              buttonIconic={buttonIconicProps}
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
  className: "sdn-bar sdn-bar",
  comboboxFieldSearchField: {
    "aria-hidden": "false",
    className:
      "sdn-combobox-field-search-field sdn-combobox-field-search-field--vbyg",
  },
  icon: {
    icon: "material-search",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
  },
  input: {
    type: "text",
    role: "combobox",
    "aria-haspopup": "listbox",
    className: "sdn-input sdn-input--yoqi",
  },
  buttonIconic: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
  },
  icon2: {
    icon: "material-close",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--umgs",
  },
}

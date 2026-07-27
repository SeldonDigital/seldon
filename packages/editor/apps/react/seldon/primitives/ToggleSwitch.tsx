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
import { InputHTMLAttributes, Ref, forwardRef } from "react"

import { SeldonToggle } from "../custom/SeldonToggle"
import { combineClassNames } from "../utils/class-name"

export interface ToggleSwitchProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string
  "data-seldon-ref"?: string
  ref?: Ref<HTMLInputElement>
}

/*****
 * Toggle Switch: ToggleSwitch
 * Level: Primitive
 * Intent: Toggles a single setting on or off with a sliding thumb.
 * Tags: toggle, switch, control, boolean, binary, on off, ui, form
 * Type: Default
 *
 * @example
 * ```tsx
 * <ToggleSwitch
 *   role="switch"
 *   aria-checked="false"
 * />
 * ```
 *****/
export const ToggleSwitch = forwardRef<HTMLInputElement, ToggleSwitchProps>(
  function ToggleSwitch({ className = "", ...props }, ref) {
    const toggleSwitchClassName = combineClassNames(
      "sdn-toggle-switch",
      className,
    )

    //
    // React JSX component with merged default and custom properties
    //
    return (
      <SeldonToggle
        className={toggleSwitchClassName}
        role={sdn["role"]}
        aria-checked={sdn["aria-checked"]}
        ref={ref}
        {...props}
      />
    )
  },
)

//
// Default property values
//
const sdn: ToggleSwitchProps = {
  role: "switch",
  "aria-checked": "false",
  className: "sdn-toggle-switch",
}

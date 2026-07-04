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
import { Frame } from "../frames/Frame"
import { Icon, IconProps } from "../primitives/Icon"
import { Input, InputProps } from "../primitives/Input"
import { applyRef } from "../utils/apply-ref"
import { combineClassNames } from "../utils/class-name"

export interface ComboboxFieldProjectProps extends HTMLAttributes<HTMLElement> {
  className?: string
  "data-seldon-ref"?: string
  seldonRefs?: Record<string, Record<string, unknown>>
  icon?: IconProps | null
  input?: InputProps | null
  buttonIconic?: ButtonIconicProps | null
  icon2?: IconProps | null
}

/*****
 * Combobox Field: ComboboxFieldProject
 * Level: Element
 * Intent: Field box that holds the combobox input and opens its listbox.
 * Tags: combobox, trigger, input, field, select, element, UI
 * Type: Custom
 *
 * @example
 * ```tsx
 * <ComboboxFieldProject
 *   aria-hidden="false"
 *   icon="material-star"
 *   input="{}"
 *   buttonIconic={() => {}}
 * />
 * ```
 *****/
export function ComboboxFieldProject({
  className = "",
  icon = sdn.icon,
  input = sdn.input,
  buttonIconic = sdn.buttonIconic,
  icon2 = sdn.icon2,
  children,
  seldonRefs,
  ...props
}: ComboboxFieldProjectProps) {
  const comboboxFieldProjectClassName = combineClassNames(
    "sdn-combobox-field",
    className,
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
      className={comboboxFieldProjectClassName}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    >
      {children !== undefined ? (
        children
      ) : (
        <>
          {iconProps !== null && <Icon {...iconProps} />}
          {inputProps !== null && <Input {...inputProps} />}
          {buttonIconicProps !== null && (
            <ButtonIconic {...buttonIconicProps} icon={icon2Props} />
          )}
        </>
      )}
    </Frame>
  )
}

//
// Default property values
//
const sdn: ComboboxFieldProjectProps = {
  "aria-hidden": "false",
  className: "sdn-combobox-field sdn-combobox-field",
  icon: {
    icon: "material-dataObject",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
    "data-seldon-ref": "projectIcon",
  },
  input: {
    type: "text",
    role: "combobox",
    "aria-haspopup": "listbox",
    className: "sdn-input sdn-input--twyx",
    "data-seldon-ref": "projectLabel",
  },
  buttonIconic: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
    "data-seldon-ref": "projectActions",
  },
  icon2: {
    icon: "material-save",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--vsau",
  },
}

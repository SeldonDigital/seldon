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
import { LiHTMLAttributes } from "react"
import { Chip, ChipProps } from "../elements/Chip"
import { HTMLLi } from "../native-react/HTML.Li"
import { Icon, IconProps } from "../primitives/Icon"
import { InputCheckbox, InputCheckboxProps } from "../primitives/InputCheckbox"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { applyRef } from "../utils/apply-ref"
import { combineClassNames } from "../utils/class-name"

export interface ItemToDoItemProps extends LiHTMLAttributes<HTMLLIElement> {
  className?: string
  "data-seldon-ref"?: string
  seldonRefs?: Record<string, Record<string, unknown>>
  inputCheckbox?: InputCheckboxProps | null
  textLabel?: TextLabelProps | null
  chip?: ChipProps | null
  icon?: IconProps | null
  textLabel2?: TextLabelProps | null
  chip2?: ChipProps | null
  icon2?: IconProps | null
  textLabel3?: TextLabelProps | null
  chip3?: ChipProps | null
  textLabel4?: TextLabelProps | null
}

/*****
 * Item: ItemToDoItem
 * Level: Element
 * Intent: Default list item used for general content with flexible layout.
 * Tags: list, item, standard, default, row, UI, layout, general
 * Type: Custom
 *
 * @example
 * ```tsx
 * <ItemToDoItem
 *   aria-hidden="false"
 *   inputCheckbox="{}"
 *   textLabel="{}"
 *   chip="{}"
 *   icon="material-star"
 *   chip2="{}"
 *   chip3="{}"
 * />
 * ```
 *****/
export function ItemToDoItem({
  className = "",
  inputCheckbox,
  textLabel,
  chip = sdn.chip,
  icon,
  textLabel2,
  chip2 = sdn.chip2,
  icon2,
  textLabel3,
  chip3 = sdn.chip3,
  textLabel4,
  children,
  seldonRefs,
  ...props
}: ItemToDoItemProps) {
  const itemToDoItemClassName = combineClassNames("sdn-item", className)
  const inputCheckboxProps = applyRef(
    seldonRefs,
    inputCheckbox === null
      ? null
      : {
          ...sdn.inputCheckbox,
          ...inputCheckbox,
          className: combineClassNames(
            sdn.inputCheckbox?.className,
            inputCheckbox?.className,
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
  const chipProps = applyRef(
    seldonRefs,
    chip === null
      ? null
      : {
          ...sdn.chip,
          ...chip,
          className: combineClassNames(sdn.chip?.className, chip?.className),
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
  const chip2Props = applyRef(
    seldonRefs,
    chip2 === null
      ? null
      : {
          ...sdn.chip2,
          ...chip2,
          className: combineClassNames(sdn.chip2?.className, chip2?.className),
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
  const chip3Props = applyRef(
    seldonRefs,
    chip3 === null
      ? null
      : {
          ...sdn.chip3,
          ...chip3,
          className: combineClassNames(sdn.chip3?.className, chip3?.className),
        },
  )
  const textLabel4Props = applyRef(
    seldonRefs,
    textLabel4 === null
      ? null
      : {
          ...sdn.textLabel4,
          ...textLabel4,
          className: combineClassNames(
            sdn.textLabel4?.className,
            textLabel4?.className,
          ),
        },
  )

  return (
    <HTMLLi
      className={itemToDoItemClassName}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    >
      {children !== undefined ? (
        children
      ) : (
        <>
          {inputCheckbox && inputCheckboxProps && (
            <InputCheckbox {...inputCheckboxProps} />
          )}
          {textLabel && textLabelProps && <TextLabel {...textLabelProps} />}
          {chipProps !== null && (
            <Chip {...chipProps}>
              {icon && iconProps && <Icon {...iconProps} />}
              {textLabel2 && textLabel2Props && (
                <TextLabel {...textLabel2Props} />
              )}
            </Chip>
          )}
          {chip2Props !== null && (
            <Chip {...chip2Props}>
              {icon2 && icon2Props && <Icon {...icon2Props} />}
              {textLabel3 && textLabel3Props && (
                <TextLabel {...textLabel3Props} />
              )}
            </Chip>
          )}
          {chip3Props !== null && (
            <Chip {...chip3Props}>
              {textLabel4 && textLabel4Props && (
                <TextLabel {...textLabel4Props} />
              )}
            </Chip>
          )}
        </>
      )}
    </HTMLLi>
  )
}

//
// Default property values
//
const sdn: ItemToDoItemProps = {
  "aria-hidden": "false",
  className: "sdn-item sdn-item",
  inputCheckbox: {
    className: "sdn-input-checkbox sdn-input-checkbox--vajr",
  },
  textLabel: {
    className: "sdn-text-label sdn-text--svkr",
  },
  chip: {
    "aria-hidden": "false",
    className: "sdn-chip sdn-chip--o0xb",
  },
  icon: {
    className: "sdn-icon sdn-icon--eyw9",
  },
  textLabel2: {
    className: "sdn-text-label sdn-text-label--lug5",
  },
  chip2: {
    "aria-hidden": "false",
    className: "sdn-chip sdn-chip--o0xb",
  },
  icon2: {
    className: "sdn-icon sdn-icon--eyw9",
  },
  textLabel3: {
    className: "sdn-text-label sdn-text-label--lug5",
  },
  chip3: {
    "aria-hidden": "false",
    className: "sdn-chip sdn-chip--o0xb",
  },
  textLabel4: {
    className: "sdn-text-label sdn-text-label--lug5",
  },
}

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

import { Button, ButtonProps } from "../elements/Button"
import { Frame } from "../frames/Frame"
import { Icon, IconProps } from "../primitives/Icon"
import { Input, InputProps } from "../primitives/Input"
import {
  TextDescription,
  TextDescriptionProps,
} from "../primitives/TextDescription"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { TextTitle, TextTitleProps } from "../primitives/TextTitle"
import { applyRef } from "../utils/apply-ref"
import { combineClassNames } from "../utils/class-name"

export interface SectionSectionNewsletterProps extends HTMLAttributes<HTMLElement> {
  className?: string
  "data-seldon-ref"?: string
  seldonRefs?: Record<string, Record<string, unknown>>
  textTitle?: TextTitleProps | null
  textDescription?: TextDescriptionProps | null
  input?: InputProps | null
  button?: ButtonProps | null
  icon?: IconProps | null
  textLabel?: TextLabelProps | null
}

/*****
 * Section: SectionNewsletter
 * Level: Element
 * Intent: Navigation section containing links to important pages. Can be used in footers, headers, sidebars, or any other layout context. Follows Material Design navigation patterns.
 * Tags: section, navigation, links, menu, element, layout, header, footer, sidebar
 * Type: Custom
 *
 * @example
 * ```tsx
 * <SectionSectionNewsletter
 *   aria-hidden="false"
 *   textTitle="Product Title"
 *   textDescription2="{}"
 *   input="{}"
 *   button={() => {}}
 *   icon="material-star"
 *   textLabel="{}"
 * />
 * ```
 *****/
export function SectionSectionNewsletter({
  className = "",
  textTitle,
  textDescription,
  input = sdn.input,
  button = sdn.button,
  icon = sdn.icon,
  textLabel,
  children,
  seldonRefs,
  ...props
}: SectionSectionNewsletterProps) {
  const sectionSectionNewsletterClassName = combineClassNames(
    "sdn-section",
    className,
  )
  const textTitleProps = applyRef(
    seldonRefs,
    textTitle === null
      ? null
      : {
          ...sdn.textTitle,
          ...textTitle,
          className: combineClassNames(
            sdn.textTitle?.className,
            textTitle?.className,
          ),
        },
  )
  const textDescriptionProps = applyRef(
    seldonRefs,
    textDescription === null
      ? null
      : {
          ...sdn.textDescription,
          ...textDescription,
          className: combineClassNames(
            sdn.textDescription?.className,
            textDescription?.className,
          ),
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
  const buttonProps = applyRef(
    seldonRefs,
    button === null
      ? null
      : {
          ...sdn.button,
          ...button,
          className: combineClassNames(
            sdn.button?.className,
            button?.className,
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

  return (
    <Frame
      className={sectionSectionNewsletterClassName}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    >
      {children !== undefined ? (
        children
      ) : (
        <>
          {textTitle && textTitleProps && <TextTitle {...textTitleProps} />}
          {textDescription && textDescriptionProps && (
            <TextDescription {...textDescriptionProps} />
          )}
          {inputProps !== null && <Input {...inputProps} />}
          {buttonProps !== null && (
            <Button {...buttonProps}>
              {icon && iconProps && <Icon {...iconProps} />}
              {textLabel && textLabelProps && <TextLabel {...textLabelProps} />}
            </Button>
          )}
        </>
      )}
    </Frame>
  )
}

//
// Default property values
//
const sdn: SectionSectionNewsletterProps = {
  "aria-hidden": "false",
  className: "sdn-section",
  textTitle: {
    className: "sdn-text-title sdn-text-title--a5sd",
  },
  textDescription: {
    className: "sdn-text-description sdn-text-description--tjnl",
  },
  input: {
    placeholder: "Enter your email",
    type: "email",
    className: "sdn-input sdn-input--rfy8",
  },
  button: {
    className: "sdn-button sdn-button--x8e4",
  },
  icon: {
    icon: "material-notifications",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--eyw9",
  },
  textLabel: {
    className: "sdn-text-label sdn-text-label--zk5o",
  },
}

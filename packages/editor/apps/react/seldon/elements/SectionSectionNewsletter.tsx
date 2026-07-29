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
import { TextDescription, TextDescriptionProps } from "../primitives/TextDescription"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { TextTitle, TextTitleProps } from "../primitives/TextTitle"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface SectionSectionNewsletterProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  textTitle?: TextTitleProps | null

  textDescription?: TextDescriptionProps | null

  input?: InputProps | null

  button?: ButtonProps | null
  icon?: IconProps | null
  textLabel?: TextLabelProps | null
}

//
// Default property values
//
const sdn: SectionSectionNewsletterProps = {
  "aria-hidden": "false",
  textTitle: {
    children: "Stay Updated",
    className: "sdn-text-title sdn-text-title--a5sd",
  },

  textDescription: {
    children: "Subscribe to our newsletter for the latest updates.",
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
    children: "Subscribe",
    className: "sdn-text-label sdn-text-label--zk5o",
  },
}

/**
 * Section: SectionNewsletter
 * Level: Element
 * Intent: Navigation section containing links to important pages. Can be used in footers, headers, sidebars, or any other layout context. Follows Material Design navigation patterns.
 * Tags: section, navigation, links, menu, element, layout, header, footer, sidebar
 * Type: Custom
 *
 * Structure:
 *   TextTitle        textTitle
 *   TextDescription  textDescription
 *   Input            input
 *   Button           button
 *     Icon           icon
 *     TextLabel      textLabel
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
 */
export function SectionSectionNewsletter({
  className = "",
  textTitle,

  textDescription,

  input,

  button,
  icon,
  textLabel,

  children,
  seldonRefs,
  ...props
}: SectionSectionNewsletterProps) {
  const sectionSectionNewsletterClassName = combineClassNames("sdn-section", className)

  const textTitleProps = mergeOptionalSlot(sdn.textTitle, textTitle, seldonRefs)

  const textDescriptionProps = mergeOptionalSlot(sdn.textDescription, textDescription, seldonRefs)

  const inputProps = mergeSlot(sdn.input, input, seldonRefs)

  const buttonProps = mergeSlot(sdn.button, button, seldonRefs)
  const iconProps = mergeSlot(sdn.icon, icon, seldonRefs)
  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)

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
          {textTitleProps !== null && <TextTitle {...textTitleProps} />}
          {textDescriptionProps !== null && <TextDescription {...textDescriptionProps} />}
          {inputProps !== null && <Input {...inputProps} />}
          {buttonProps !== null && (
            <Button {...buttonProps}>
              {iconProps !== null && <Icon {...iconProps} />}
              {textLabelProps !== null && <TextLabel {...textLabelProps} />}
            </Button>
          )}
        </>
      )}
    </Frame>
  )
}

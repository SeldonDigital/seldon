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
import { Frame, FrameProps } from "../frames/Frame"
import { BarButtons, BarButtonsProps } from "../parts/BarButtons"
import { Icon, IconProps } from "../primitives/Icon"
import { TextDescription, TextDescriptionProps } from "../primitives/TextDescription"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { TextTagline, TextTaglineProps } from "../primitives/TextTagline"
import { TextTitle, TextTitleProps } from "../primitives/TextTitle"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface CardStackedProductProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  frame?: FrameProps | null
  textTagline?: TextTaglineProps | null
  textTitle?: TextTitleProps | null
  textDescription?: TextDescriptionProps | null

  barButtons?: BarButtonsProps | null
  frame2?: FrameProps | null
  button?: ButtonProps | null
  icon?: IconProps | null
  textLabel?: TextLabelProps | null
  button2?: ButtonProps | null
  icon2?: IconProps | null
  textLabel2?: TextLabelProps | null
  button3?: ButtonProps | null
  icon3?: IconProps | null
  textLabel3?: TextLabelProps | null
  frame3?: FrameProps | null
  button4?: ButtonProps | null
  icon4?: IconProps | null
  textLabel4?: TextLabelProps | null
  button5?: ButtonProps | null
  icon5?: IconProps | null
  textLabel5?: TextLabelProps | null
}

//
// Default property values
//
const sdn: CardStackedProductProps = {
  "aria-hidden": "false",
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--irc0",
  },
  textTagline: {
    className: "sdn-text-tagline sdn-text-label--yqnd",
  },
  textTitle: {
    className: "sdn-text-title sdn-text-title--zgck",
  },
  textDescription: {
    className: "sdn-text-description sdn-text-label--yqnd",
  },

  barButtons: {
    "aria-hidden": "false",
    className: "sdn-bar-buttons sdn-bar-buttons--i6jv",
  },
  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ysu5",
  },
  button: {
    className: "sdn-button sdn-button--wjtm",
  },
  icon: {
    className: "sdn-icon sdn-icon--gh8m",
  },
  textLabel: {
    className: "sdn-text-label sdn-text-label--wxqf",
  },
  button2: {
    className: "sdn-button sdn-button--wjtm",
  },
  icon2: {
    className: "sdn-icon sdn-icon--gh8m",
  },
  textLabel2: {
    className: "sdn-text-label sdn-text-label--wxqf",
  },
  button3: {
    className: "sdn-button sdn-button--wjtm",
  },
  icon3: {
    className: "sdn-icon sdn-icon--gh8m",
  },
  textLabel3: {
    className: "sdn-text-label sdn-text-label--wxqf",
  },
  frame3: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--nzij",
  },
  button4: {
    className: "sdn-button sdn-button--wjtm",
  },
  icon4: {
    icon: "seldon-none",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--gh8m",
  },
  textLabel4: {
    className: "sdn-text-label sdn-text-label--wxqf",
  },
  button5: {
    className: "sdn-button sdn-button--wjtm",
  },
  icon5: {
    icon: "material-check",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--gh8m",
  },
  textLabel5: {
    className: "sdn-text-label sdn-text-label--wxqf",
  },
}

/**
 * Card: CardStackedProduct
 * Level: Part
 * Intent: Defines a vertically stacked card layout with support for headers, content blocks, and action elements.
 * Tags: card, stacked, vertical, ui, block, layout, cta, content
 * Type: Inline
 *
 * Structure:
 *   Frame              frame
 *     TextTagline      textTagline
 *     TextTitle        textTitle
 *     TextDescription  textDescription
 *   BarButtons         barButtons
 *     Frame            frame2
 *       Button         button
 *         Icon         icon
 *         TextLabel    textLabel
 *       Button         button2
 *         Icon         icon2
 *         TextLabel    textLabel2
 *       Button         button3
 *         Icon         icon3
 *         TextLabel    textLabel3
 *     Frame            frame3
 *       Button         button4
 *         Icon         icon4
 *         TextLabel    textLabel4
 *       Button         button5
 *         Icon         icon5
 *         TextLabel    textLabel5
 *
 * @example
 * ```tsx
 * <CardStackedProduct
 *   aria-hidden="false"
 *   frame="{}"
 *   textTagline="{}"
 *   textTitle2="Product Title"
 *   textDescription3="{}"
 *   barButtons="{}"
 *   button={() => {}}
 *   icon="material-star"
 *   textLabel="{}"
 *   button2={() => {}}
 *   button3={() => {}}
 *   frame2="{}"
 * />
 * ```
 */
export function CardStackedProduct({
  className = "",
  frame,
  textTagline,
  textTitle,
  textDescription,

  barButtons,
  frame2,
  button,
  icon,
  textLabel,
  button2,
  icon2,
  textLabel2,
  button3,
  icon3,
  textLabel3,
  frame3,
  button4,
  icon4,
  textLabel4,
  button5,
  icon5,
  textLabel5,

  children,
  seldonRefs,
  ...props
}: CardStackedProductProps) {
  const cardStackedProductClassName = combineClassNames("sdn-card-stacked-product", className)

  const frameProps = mergeSlot(sdn.frame, frame, seldonRefs)
  const textTaglineProps = mergeOptionalSlot(sdn.textTagline, textTagline, seldonRefs)
  const textTitleProps = mergeOptionalSlot(sdn.textTitle, textTitle, seldonRefs)
  const textDescriptionProps = mergeOptionalSlot(sdn.textDescription, textDescription, seldonRefs)

  const barButtonsProps = mergeSlot(sdn.barButtons, barButtons, seldonRefs)
  const frame2Props = mergeSlot(sdn.frame2, frame2, seldonRefs)
  const buttonProps = mergeOptionalSlot(sdn.button, button, seldonRefs)
  const iconProps = mergeOptionalSlot(sdn.icon, icon, seldonRefs)
  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)
  const button2Props = mergeOptionalSlot(sdn.button2, button2, seldonRefs)
  const icon2Props = mergeOptionalSlot(sdn.icon2, icon2, seldonRefs)
  const textLabel2Props = mergeOptionalSlot(sdn.textLabel2, textLabel2, seldonRefs)
  const button3Props = mergeOptionalSlot(sdn.button3, button3, seldonRefs)
  const icon3Props = mergeOptionalSlot(sdn.icon3, icon3, seldonRefs)
  const textLabel3Props = mergeOptionalSlot(sdn.textLabel3, textLabel3, seldonRefs)
  const frame3Props = mergeSlot(sdn.frame3, frame3, seldonRefs)
  const button4Props = mergeOptionalSlot(sdn.button4, button4, seldonRefs)
  const icon4Props = mergeSlot(sdn.icon4, icon4, seldonRefs)
  const textLabel4Props = mergeOptionalSlot(sdn.textLabel4, textLabel4, seldonRefs)
  const button5Props = mergeOptionalSlot(sdn.button5, button5, seldonRefs)
  const icon5Props = mergeSlot(sdn.icon5, icon5, seldonRefs)
  const textLabel5Props = mergeOptionalSlot(sdn.textLabel5, textLabel5, seldonRefs)

  return (
    <Frame className={cardStackedProductClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
      {children !== undefined ? (
        children
      ) : (
        <>
          <Frame {...frameProps}>
            {textTaglineProps !== null && <TextTagline {...textTaglineProps} />}
            {textTitleProps !== null && <TextTitle {...textTitleProps} />}
            {textDescriptionProps !== null && <TextDescription {...textDescriptionProps} />}
          </Frame>
          {barButtonsProps !== null && (
            <BarButtons {...barButtonsProps}>
              <Frame {...frame2Props}>
                {buttonProps !== null && (
                  <Button {...buttonProps}>
                    {iconProps !== null && <Icon {...iconProps} />}
                    {textLabelProps !== null && <TextLabel {...textLabelProps} />}
                  </Button>
                )}
                {button2Props !== null && (
                  <Button {...button2Props}>
                    {icon2Props !== null && <Icon {...icon2Props} />}
                    {textLabel2Props !== null && <TextLabel {...textLabel2Props} />}
                  </Button>
                )}
                {button3Props !== null && (
                  <Button {...button3Props}>
                    {icon3Props !== null && <Icon {...icon3Props} />}
                    {textLabel3Props !== null && <TextLabel {...textLabel3Props} />}
                  </Button>
                )}
              </Frame>
              <Frame {...frame3Props}>
                {button4Props !== null && (
                  <Button {...button4Props}>
                    {icon4Props !== null && <Icon {...icon4Props} />}
                    {textLabel4Props !== null && <TextLabel {...textLabel4Props} />}
                  </Button>
                )}
                {button5Props !== null && (
                  <Button {...button5Props}>
                    {icon5Props !== null && <Icon {...icon5Props} />}
                    {textLabel5Props !== null && <TextLabel {...textLabel5Props} />}
                  </Button>
                )}
              </Frame>
            </BarButtons>
          )}
        </>
      )}
    </Frame>
  )
}

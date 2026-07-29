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

import { AvatarProps } from "../elements/Avatar"
import { Button, ButtonProps } from "../elements/Button"
import { Header, HeaderProps } from "../elements/Header"
import { Frame, FrameProps } from "../frames/Frame"
import { BarButtons, BarButtonsProps } from "../parts/BarButtons"
import { Icon, IconProps } from "../primitives/Icon"
import { Image, ImageProps } from "../primitives/Image"
import { TextDescription, TextDescriptionProps } from "../primitives/TextDescription"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { TextSubtitle, TextSubtitleProps } from "../primitives/TextSubtitle"
import { TextTitle, TextTitleProps } from "../primitives/TextTitle"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface CardStackedProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  header?: HeaderProps | null
  avatar?: AvatarProps | null
  image?: ImageProps | null
  button?: ButtonProps | null
  icon?: IconProps | null
  textLabel?: TextLabelProps | null

  image2?: ImageProps | null

  frame?: FrameProps | null
  textTitle?: TextTitleProps | null
  textSubtitle?: TextSubtitleProps | null

  textDescription?: TextDescriptionProps | null

  barButtons?: BarButtonsProps | null
  frame2?: FrameProps | null
  button2?: ButtonProps | null
  icon2?: IconProps | null
  textLabel2?: TextLabelProps | null
  button3?: ButtonProps | null
  icon3?: IconProps | null
  textLabel3?: TextLabelProps | null
  button4?: ButtonProps | null
  icon4?: IconProps | null
  textLabel4?: TextLabelProps | null
  frame3?: FrameProps | null
  button5?: ButtonProps | null
  icon5?: IconProps | null
  textLabel5?: TextLabelProps | null
  button6?: ButtonProps | null
  icon6?: IconProps | null
  textLabel6?: TextLabelProps | null
}

//
// Default property values
//
const sdn: CardStackedProps = {
  "aria-hidden": "false",
  header: {
    "aria-hidden": "false",
    className: "sdn-header sdn-header--qqif",
  },
  avatar: {
    "aria-hidden": "false",
    className: "sdn-avatar sdn-avatar--zukr",
  },
  image: {
    src: "/avatar-user.png",
    "aria-hidden": "false",
    className: "sdn-image sdn-image--to5v",
  },
  button: {
    className: "sdn-button sdn-button-iconic--pgsr",
  },
  icon: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--umgs",
  },
  textLabel: {
    className: "sdn-text-label sdn-text-label--ylte",
  },

  image2: {
    src: "https://static.seldon.app/background-default-dark.jpg",
    "aria-hidden": "false",
    className: "sdn-image sdn-image--w46q",
  },

  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--auwd",
  },
  textTitle: {
    className: "sdn-text-title sdn-text-label--yqnd",
  },
  textSubtitle: {
    className: "sdn-text-subtitle sdn-text-subtitle--pyri",
  },

  textDescription: {
    className: "sdn-text-description sdn-text-description--qqmc",
  },

  barButtons: {
    "aria-hidden": "false",
    className: "sdn-bar-buttons sdn-bar-buttons--icjh",
  },
  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ysu5",
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
  button4: {
    className: "sdn-button sdn-button--wjtm",
  },
  icon4: {
    className: "sdn-icon sdn-icon--gh8m",
  },
  textLabel4: {
    className: "sdn-text-label sdn-text-label--wxqf",
  },
  frame3: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--nzij",
  },
  button5: {
    className: "sdn-button sdn-button--wjtm",
  },
  icon5: {
    icon: "seldon-none",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--gh8m",
  },
  textLabel5: {
    className: "sdn-text-label sdn-text-label--wxqf",
  },
  button6: {
    className: "sdn-button sdn-button--wjtm",
  },
  icon6: {
    icon: "material-check",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--gh8m",
  },
  textLabel6: {
    className: "sdn-text-label sdn-text-label--wxqf",
  },
}

/**
 * Card: CardStacked
 * Level: Part
 * Intent: Defines a vertically stacked card layout with support for headers, content blocks, and action elements.
 * Tags: card, stacked, vertical, ui, block, layout, cta, content
 * Type: Inline
 *
 * Structure:
 *   Header           header
 *     Avatar         avatar
 *       Image        image
 *     Button         button
 *       Icon         icon
 *       TextLabel    textLabel
 *   Image            image2
 *   Frame            frame
 *     TextTitle      textTitle
 *     TextSubtitle   textSubtitle
 *   TextDescription  textDescription
 *   BarButtons       barButtons
 *     Frame          frame2
 *       Button       button2
 *         Icon       icon2
 *         TextLabel  textLabel2
 *       Button       button3
 *         Icon       icon3
 *         TextLabel  textLabel3
 *       Button       button4
 *         Icon       icon4
 *         TextLabel  textLabel4
 *     Frame          frame3
 *       Button       button5
 *         Icon       icon5
 *         TextLabel  textLabel5
 *       Button       button6
 *         Icon       icon6
 *         TextLabel  textLabel6
 *
 * @example
 * ```tsx
 * <CardStacked
 *   aria-hidden="false"
 *   header="{}"
 *   avatar="/image.jpg"
 *   image="/image.jpg"
 *   button={() => {}}
 *   icon="material-star"
 *   textLabel="{}"
 *   frame="{}"
 *   textTitle="Product Title"
 *   textSubtitle2="Product Title"
 *   textDescription="{}"
 *   barButtons="{}"
 *   button2={() => {}}
 *   button3={() => {}}
 *   frame2="{}"
 * />
 * ```
 */
export function CardStacked({
  className = "",
  header,
  avatar,
  image,
  button,
  icon,
  textLabel,

  image2,

  frame,
  textTitle,
  textSubtitle,

  textDescription,

  barButtons,
  frame2,
  button2,
  icon2,
  textLabel2,
  button3,
  icon3,
  textLabel3,
  button4,
  icon4,
  textLabel4,
  frame3,
  button5,
  icon5,
  textLabel5,
  button6,
  icon6,
  textLabel6,

  children,
  seldonRefs,
  ...props
}: CardStackedProps) {
  const cardStackedClassName = combineClassNames("sdn-card-stacked", className)

  const headerProps = mergeSlot(sdn.header, header, seldonRefs)
  const avatarProps = mergeSlot(sdn.avatar, avatar, seldonRefs)
  const imageProps = mergeSlot(sdn.image, image, seldonRefs)
  const buttonProps = mergeSlot(sdn.button, button, seldonRefs)
  const iconProps = mergeSlot(sdn.icon, icon, seldonRefs)
  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)

  const image2Props = mergeSlot(sdn.image2, image2, seldonRefs)

  const frameProps = mergeSlot(sdn.frame, frame, seldonRefs)
  const textTitleProps = mergeOptionalSlot(sdn.textTitle, textTitle, seldonRefs)
  const textSubtitleProps = mergeOptionalSlot(sdn.textSubtitle, textSubtitle, seldonRefs)

  const textDescriptionProps = mergeOptionalSlot(sdn.textDescription, textDescription, seldonRefs)

  const barButtonsProps = mergeSlot(sdn.barButtons, barButtons, seldonRefs)
  const frame2Props = mergeSlot(sdn.frame2, frame2, seldonRefs)
  const button2Props = mergeOptionalSlot(sdn.button2, button2, seldonRefs)
  const icon2Props = mergeOptionalSlot(sdn.icon2, icon2, seldonRefs)
  const textLabel2Props = mergeOptionalSlot(sdn.textLabel2, textLabel2, seldonRefs)
  const button3Props = mergeOptionalSlot(sdn.button3, button3, seldonRefs)
  const icon3Props = mergeOptionalSlot(sdn.icon3, icon3, seldonRefs)
  const textLabel3Props = mergeOptionalSlot(sdn.textLabel3, textLabel3, seldonRefs)
  const button4Props = mergeOptionalSlot(sdn.button4, button4, seldonRefs)
  const icon4Props = mergeOptionalSlot(sdn.icon4, icon4, seldonRefs)
  const textLabel4Props = mergeOptionalSlot(sdn.textLabel4, textLabel4, seldonRefs)
  const frame3Props = mergeSlot(sdn.frame3, frame3, seldonRefs)
  const button5Props = mergeOptionalSlot(sdn.button5, button5, seldonRefs)
  const icon5Props = mergeSlot(sdn.icon5, icon5, seldonRefs)
  const textLabel5Props = mergeOptionalSlot(sdn.textLabel5, textLabel5, seldonRefs)
  const button6Props = mergeOptionalSlot(sdn.button6, button6, seldonRefs)
  const icon6Props = mergeSlot(sdn.icon6, icon6, seldonRefs)
  const textLabel6Props = mergeOptionalSlot(sdn.textLabel6, textLabel6, seldonRefs)

  return (
    <Frame className={cardStackedClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
      {children !== undefined ? (
        children
      ) : (
        <>
          {headerProps !== null && (
            <Header
              {...headerProps}
              avatar={avatarProps}
              image={imageProps}
              button={buttonProps}
              icon={iconProps}
              textLabel={textLabelProps}
            />
          )}
          {image2Props !== null && <Image {...image2Props} />}
          <Frame {...frameProps}>
            {textTitleProps !== null && <TextTitle {...textTitleProps} />}
            {textSubtitleProps !== null && <TextSubtitle {...textSubtitleProps} />}
          </Frame>
          {textDescriptionProps !== null && <TextDescription {...textDescriptionProps} />}
          {barButtonsProps !== null && (
            <BarButtons {...barButtonsProps}>
              <Frame {...frame2Props}>
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
                {button4Props !== null && (
                  <Button {...button4Props}>
                    {icon4Props !== null && <Icon {...icon4Props} />}
                    {textLabel4Props !== null && <TextLabel {...textLabel4Props} />}
                  </Button>
                )}
              </Frame>
              <Frame {...frame3Props}>
                {button5Props !== null && (
                  <Button {...button5Props}>
                    {icon5Props !== null && <Icon {...icon5Props} />}
                    {textLabel5Props !== null && <TextLabel {...textLabel5Props} />}
                  </Button>
                )}
                {button6Props !== null && (
                  <Button {...button6Props}>
                    {icon6Props !== null && <Icon {...icon6Props} />}
                    {textLabel6Props !== null && <TextLabel {...textLabel6Props} />}
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

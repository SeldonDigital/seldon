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
import { Avatar } from "../elements/Avatar"
import { Button } from "../elements/Button"
import { ButtonSimple } from "../elements/ButtonSimple"
import { Chip } from "../elements/Chip"
import { ComboboxFieldSearch } from "../elements/ComboboxFieldSearch"
import { Frame } from "../frames/Frame"
import { HTMLDiv } from "../native-react/HTML.Div"
import { ArticleCard } from "../parts/ArticleCard"
import { Bar } from "../parts/Bar"
import { BarButtons } from "../parts/BarButtons"
import { Icon } from "../primitives/Icon"
import { Image } from "../primitives/Image"
import { TextDescription } from "../primitives/TextDescription"
import { TextHeading } from "../primitives/TextHeading"
import { TextLabel } from "../primitives/TextLabel"
import { TextTitle } from "../primitives/TextTitle"
import { combineClassNames } from "../utils/class-name"
import { mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

import type { AvatarProps } from "../elements/Avatar"
import type { ButtonProps } from "../elements/Button"
import type { ButtonIconicProps } from "../elements/ButtonIconic"
import type { ButtonSimpleProps } from "../elements/ButtonSimple"
import type { ChipProps } from "../elements/Chip"
import type { ComboboxFieldSearchProps } from "../elements/ComboboxFieldSearch"
import type { FrameProps } from "../frames/Frame"
import type { ArticleCardProps } from "../parts/ArticleCard"
import type { BarProps } from "../parts/Bar"
import type { BarButtonsProps } from "../parts/BarButtons"
import type { IconProps } from "../primitives/Icon"
import type { ImageProps } from "../primitives/Image"
import type { InputProps } from "../primitives/Input"
import type { TextDescriptionProps } from "../primitives/TextDescription"
import type { TextHeadingProps } from "../primitives/TextHeading"
import type { TextLabelProps } from "../primitives/TextLabel"
import type { TextTitleProps } from "../primitives/TextTitle"
import type { SeldonRefs } from "../utils/merge-slot"
import type { HTMLAttributes } from "react"

export interface DialogProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  bar?: BarProps | null
  textTitle?: TextTitleProps | null
  comboboxFieldSearch?: ComboboxFieldSearchProps | null
  icon?: IconProps | null
  input?: InputProps | null
  buttonIconic?: ButtonIconicProps | null
  icon2?: IconProps | null

  frame?: FrameProps | null
  articleCard?: ArticleCardProps | null
  image?: ImageProps | null
  frame2?: FrameProps | null
  chip?: ChipProps | null
  textLabel?: TextLabelProps | null
  textHeading?: TextHeadingProps | null
  textDescription?: TextDescriptionProps | null
  frame3?: FrameProps | null
  avatar?: AvatarProps | null
  image2?: ImageProps | null
  frame4?: FrameProps | null
  textLabel2?: TextLabelProps | null
  textLabel3?: TextLabelProps | null
  buttonSimple?: ButtonSimpleProps | null
  textLabel4?: TextLabelProps | null

  barButtons?: BarButtonsProps | null
  frame5?: FrameProps | null
  button?: ButtonProps | null
  icon3?: IconProps | null
  textLabel5?: TextLabelProps | null
  button2?: ButtonProps | null
  icon4?: IconProps | null
  textLabel6?: TextLabelProps | null
  button3?: ButtonProps | null
  icon5?: IconProps | null
  textLabel7?: TextLabelProps | null
  frame6?: FrameProps | null
  button4?: ButtonProps | null
  icon6?: IconProps | null
  textLabel8?: TextLabelProps | null
  button5?: ButtonProps | null
  icon7?: IconProps | null
  textLabel9?: TextLabelProps | null
}

//
// Default property values
//
const sdn: DialogProps = {
  "aria-hidden": "false",
  bar: {
    "aria-hidden": "false",
    className: "sdn-bar sdn-bar--yje0",
  },
  textTitle: {
    children: "Dialog",
    htmlElement: "h4",
    "aria-hidden": "false",
    className: "sdn-text-title sdn-text-title--j8d9",
  },
  comboboxFieldSearch: {
    "aria-hidden": "false",
    className: "sdn-combobox-field-search sdn-combobox-field-search--9jd5",
  },
  icon: {
    icon: "material-search",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
  },
  input: {
    placeholder: "Search for...",
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
    className: "sdn-icon sdn-icon--vsau",
  },

  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--rbpu",
  },
  articleCard: {
    "aria-hidden": "false",
    className: "sdn-article-card sdn-article-card--z7hy",
  },
  image: {
    src: "/sdn/assets/background-default-light.jpg",
    "aria-hidden": "false",
    className: "sdn-image sdn-image--yoiz",
  },
  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--f3ng",
  },
  chip: {
    "aria-hidden": "false",
    className: "sdn-chip sdn-chip--jsvs",
  },
  textLabel: {
    children: "Design",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--lug5",
  },
  textHeading: {
    children: "How to design better cards",
    htmlElement: "h2",
    "aria-hidden": "false",
    className: "sdn-text-heading sdn-text-heading--q8wa",
  },
  textDescription: {
    children:
      "A short, two-line excerpt written for the card earns the click without giving everything away.",
    htmlElement: "p",
    "aria-hidden": "false",
    className: "sdn-text-description sdn-text-description--lwq7",
  },
  frame3: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ts0m",
  },
  avatar: {
    "aria-hidden": "false",
    className: "sdn-avatar sdn-avatar-rounded--fb5j",
  },
  image2: {
    src: "/avatar-bentley.png",
    "aria-hidden": "false",
    className: "sdn-image sdn-image--to5v",
  },
  frame4: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--yuto",
  },
  textLabel2: {
    children: "Sir Bentley",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--idib",
  },
  textLabel3: {
    children: "Mar 30 · 5 min read",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-subheading--bxdp",
  },
  buttonSimple: {
    className: "sdn-button-simple sdn-button-simple--ldcn",
  },
  textLabel4: {
    children: "Read more",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--tge3",
  },

  barButtons: {
    "aria-hidden": "false",
    className: "sdn-bar-buttons sdn-bar-buttons--ymyq",
  },
  frame5: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ysu5",
  },
  button: {
    className: "sdn-button sdn-button--wjtm",
  },
  icon3: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--gh8m",
  },
  textLabel5: {
    children: "Button",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--wxqf",
  },
  button2: {
    className: "sdn-button sdn-button--wjtm",
  },
  icon4: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--gh8m",
  },
  textLabel6: {
    children: "Button",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--wxqf",
  },
  button3: {
    className: "sdn-button sdn-button--wjtm",
  },
  icon5: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--gh8m",
  },
  textLabel7: {
    children: "Button",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--wxqf",
  },
  frame6: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--nzij",
  },
  button4: {
    className: "sdn-button sdn-button--wjtm",
  },
  icon6: {
    icon: "seldon-none",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--gh8m",
  },
  textLabel8: {
    children: "Cancel",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--wxqf",
  },
  button5: {
    className: "sdn-button sdn-button--wjtm",
  },
  icon7: {
    icon: "material-check",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--gh8m",
  },
  textLabel9: {
    children: "OK",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--wxqf",
  },
}

/**
 * Module: Dialog
 * Level: Module
 * Intent:
 * Tags:
 * Type: Inline
 *
 * Structure:
 *   Bar                    bar
 *     TextTitle            textTitle
 *     ComboboxFieldSearch  comboboxFieldSearch
 *       Icon               icon
 *       Input              input
 *       ButtonIconic       buttonIconic
 *         Icon             icon2
 *   Frame                  frame
 *     ArticleCard          articleCard
 *       Image              image
 *       Frame              frame2
 *         Chip             chip
 *           TextLabel      textLabel
 *         TextHeading      textHeading
 *         TextDescription  textDescription
 *         Frame            frame3
 *           Avatar         avatar
 *             Image        image2
 *           Frame          frame4
 *             TextLabel    textLabel2
 *             TextLabel    textLabel3
 *           ButtonSimple   buttonSimple
 *             TextLabel    textLabel4
 *   BarButtons             barButtons
 *     Frame                frame5
 *       Button             button
 *         Icon             icon3
 *         TextLabel        textLabel5
 *       Button             button2
 *         Icon             icon4
 *         TextLabel        textLabel6
 *       Button             button3
 *         Icon             icon5
 *         TextLabel        textLabel7
 *     Frame                frame6
 *       Button             button4
 *         Icon             icon6
 *         TextLabel        textLabel8
 *       Button             button5
 *         Icon             icon7
 *         TextLabel        textLabel9
 *
 * @example
 * ```tsx
 * <Dialog
 *   aria-hidden="false"
 *   bar="{}"
 *   textTitle="Product Title"
 *   comboboxFieldSearch="{}"
 *   icon="material-star"
 *   input="{}"
 *   buttonIconic={() => {}}
 *   frame="{}"
 *   articleCard="{}"
 *   image="/image.jpg"
 *   chip="{}"
 *   textLabel="{}"
 *   textHeading="{}"
 *   textDescription2="{}"
 *   avatar="/image.jpg"
 *   textLabel2="{}"
 *   buttonSimple={() => {}}
 *   barButtons2="{}"
 *   button={() => {}}
 *   button2={() => {}}
 *   button3={() => {}}
 *   frame2="{}"
 * />
 * ```
 */
export function Dialog({
  className = "",
  bar,
  textTitle,
  comboboxFieldSearch,
  icon,
  input,
  buttonIconic,
  icon2,

  frame,
  articleCard,
  image,
  frame2,
  chip,
  textLabel,
  textHeading,
  textDescription,
  frame3,
  avatar,
  image2,
  frame4,
  textLabel2,
  textLabel3,
  buttonSimple,
  textLabel4,

  barButtons,
  frame5,
  button,
  icon3,
  textLabel5,
  button2,
  icon4,
  textLabel6,
  button3,
  icon5,
  textLabel7,
  frame6,
  button4,
  icon6,
  textLabel8,
  button5,
  icon7,
  textLabel9,

  children,
  seldonRefs,
  ...props
}: DialogProps) {
  const dialogClassName = combineClassNames("sdn-dialog", className)

  const barProps = mergeSlot(sdn.bar, bar, seldonRefs)
  const textTitleProps = mergeOptionalSlot(sdn.textTitle, textTitle, seldonRefs)
  const comboboxFieldSearchProps = mergeOptionalSlot(
    sdn.comboboxFieldSearch,
    comboboxFieldSearch,
    seldonRefs,
  )
  const iconProps = mergeSlot(sdn.icon, icon, seldonRefs)
  const inputProps = mergeSlot(sdn.input, input, seldonRefs)
  const buttonIconicProps = mergeSlot(sdn.buttonIconic, buttonIconic, seldonRefs)
  const icon2Props = mergeSlot(sdn.icon2, icon2, seldonRefs)

  const frameProps = mergeSlot(sdn.frame, frame, seldonRefs)
  const articleCardProps = mergeOptionalSlot(sdn.articleCard, articleCard, seldonRefs)
  const imageProps = mergeSlot(sdn.image, image, seldonRefs)
  const frame2Props = mergeSlot(sdn.frame2, frame2, seldonRefs)
  const chipProps = mergeOptionalSlot(sdn.chip, chip, seldonRefs)
  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)
  const textHeadingProps = mergeOptionalSlot(sdn.textHeading, textHeading, seldonRefs)
  const textDescriptionProps = mergeOptionalSlot(sdn.textDescription, textDescription, seldonRefs)
  const frame3Props = mergeSlot(sdn.frame3, frame3, seldonRefs)
  const avatarProps = mergeOptionalSlot(sdn.avatar, avatar, seldonRefs)
  const image2Props = mergeSlot(sdn.image2, image2, seldonRefs)
  const frame4Props = mergeSlot(sdn.frame4, frame4, seldonRefs)
  const textLabel2Props = mergeOptionalSlot(sdn.textLabel2, textLabel2, seldonRefs)
  const textLabel3Props = mergeOptionalSlot(sdn.textLabel3, textLabel3, seldonRefs)
  const buttonSimpleProps = mergeOptionalSlot(sdn.buttonSimple, buttonSimple, seldonRefs)
  const textLabel4Props = mergeOptionalSlot(sdn.textLabel4, textLabel4, seldonRefs)

  const barButtonsProps = mergeSlot(sdn.barButtons, barButtons, seldonRefs)
  const frame5Props = mergeSlot(sdn.frame5, frame5, seldonRefs)
  const buttonProps = mergeOptionalSlot(sdn.button, button, seldonRefs)
  const icon3Props = mergeOptionalSlot(sdn.icon3, icon3, seldonRefs)
  const textLabel5Props = mergeOptionalSlot(sdn.textLabel5, textLabel5, seldonRefs)
  const button2Props = mergeOptionalSlot(sdn.button2, button2, seldonRefs)
  const icon4Props = mergeOptionalSlot(sdn.icon4, icon4, seldonRefs)
  const textLabel6Props = mergeOptionalSlot(sdn.textLabel6, textLabel6, seldonRefs)
  const button3Props = mergeOptionalSlot(sdn.button3, button3, seldonRefs)
  const icon5Props = mergeOptionalSlot(sdn.icon5, icon5, seldonRefs)
  const textLabel7Props = mergeOptionalSlot(sdn.textLabel7, textLabel7, seldonRefs)
  const frame6Props = mergeSlot(sdn.frame6, frame6, seldonRefs)
  const button4Props = mergeOptionalSlot(sdn.button4, button4, seldonRefs)
  const icon6Props = mergeSlot(sdn.icon6, icon6, seldonRefs)
  const textLabel8Props = mergeOptionalSlot(sdn.textLabel8, textLabel8, seldonRefs)
  const button5Props = mergeOptionalSlot(sdn.button5, button5, seldonRefs)
  const icon7Props = mergeSlot(sdn.icon7, icon7, seldonRefs)
  const textLabel9Props = mergeOptionalSlot(sdn.textLabel9, textLabel9, seldonRefs)

  return (
    <HTMLDiv className={dialogClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
      {children !== undefined ? (
        children
      ) : (
        <>
          {barProps !== null && (
            <Bar {...barProps}>
              {textTitleProps !== null && <TextTitle {...textTitleProps} />}
              {comboboxFieldSearchProps !== null && (
                <ComboboxFieldSearch
                  {...comboboxFieldSearchProps}
                  icon={iconProps}
                  input={inputProps}
                  buttonIconic={buttonIconicProps}
                  icon2={icon2Props}
                />
              )}
            </Bar>
          )}
          <Frame {...frameProps}>
            {articleCardProps !== null && (
              <ArticleCard {...articleCardProps}>
                {imageProps !== null && <Image {...imageProps} />}
                <Frame {...frame2Props}>
                  {chipProps !== null && (
                    <Chip {...chipProps}>
                      {textLabelProps !== null && <TextLabel {...textLabelProps} />}
                    </Chip>
                  )}
                  {textHeadingProps !== null && <TextHeading {...textHeadingProps} />}
                  {textDescriptionProps !== null && <TextDescription {...textDescriptionProps} />}
                  <Frame {...frame3Props}>
                    {avatarProps !== null && <Avatar {...avatarProps} image={image2Props} />}
                    <Frame {...frame4Props}>
                      {textLabel2Props !== null && <TextLabel {...textLabel2Props} />}
                      {textLabel3Props !== null && <TextLabel {...textLabel3Props} />}
                    </Frame>
                    {buttonSimpleProps !== null && (
                      <ButtonSimple {...buttonSimpleProps}>
                        {textLabel4Props !== null && <TextLabel {...textLabel4Props} />}
                      </ButtonSimple>
                    )}
                  </Frame>
                </Frame>
              </ArticleCard>
            )}
          </Frame>
          {barButtonsProps !== null && (
            <BarButtons {...barButtonsProps}>
              <Frame {...frame5Props}>
                {buttonProps !== null && (
                  <Button {...buttonProps}>
                    {icon3Props !== null && <Icon {...icon3Props} />}
                    {textLabel5Props !== null && <TextLabel {...textLabel5Props} />}
                  </Button>
                )}
                {button2Props !== null && (
                  <Button {...button2Props}>
                    {icon4Props !== null && <Icon {...icon4Props} />}
                    {textLabel6Props !== null && <TextLabel {...textLabel6Props} />}
                  </Button>
                )}
                {button3Props !== null && (
                  <Button {...button3Props}>
                    {icon5Props !== null && <Icon {...icon5Props} />}
                    {textLabel7Props !== null && <TextLabel {...textLabel7Props} />}
                  </Button>
                )}
              </Frame>
              <Frame {...frame6Props}>
                {button4Props !== null && (
                  <Button {...button4Props}>
                    {icon6Props !== null && <Icon {...icon6Props} />}
                    {textLabel8Props !== null && <TextLabel {...textLabel8Props} />}
                  </Button>
                )}
                {button5Props !== null && (
                  <Button {...button5Props}>
                    {icon7Props !== null && <Icon {...icon7Props} />}
                    {textLabel9Props !== null && <TextLabel {...textLabel9Props} />}
                  </Button>
                )}
              </Frame>
            </BarButtons>
          )}
        </>
      )}
    </HTMLDiv>
  )
}

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

import { Frame, FrameProps } from "../frames/Frame"
import { HTMLDiv } from "../native-react/HTML.Div"
import { TextCallout, TextCalloutProps } from "../primitives/TextCallout"
import { TextDescription, TextDescriptionProps } from "../primitives/TextDescription"
import { TextDisplay, TextDisplayProps } from "../primitives/TextDisplay"
import { TextHeading, TextHeadingProps } from "../primitives/TextHeading"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { TextSubheading, TextSubheadingProps } from "../primitives/TextSubheading"
import { TextSubtitle, TextSubtitleProps } from "../primitives/TextSubtitle"
import { TextTagline, TextTaglineProps } from "../primitives/TextTagline"
import { TextTitle, TextTitleProps } from "../primitives/TextTitle"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface SpecimenProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  frame?: FrameProps | null
  frame2?: FrameProps | null
  textLabel?: TextLabelProps | null
  textLabel2?: TextLabelProps | null
  frame3?: FrameProps | null
  textDescription?: TextDescriptionProps | null

  frame4?: FrameProps | null
  frame5?: FrameProps | null
  textLabel3?: TextLabelProps | null
  textLabel4?: TextLabelProps | null
  frame6?: FrameProps | null
  textLabel5?: TextLabelProps | null

  frame7?: FrameProps | null
  frame8?: FrameProps | null
  textLabel6?: TextLabelProps | null
  textLabel7?: TextLabelProps | null
  frame9?: FrameProps | null
  textTagline?: TextTaglineProps | null

  frame10?: FrameProps | null
  frame11?: FrameProps | null
  textLabel8?: TextLabelProps | null
  textLabel9?: TextLabelProps | null
  frame12?: FrameProps | null
  textCallout?: TextCalloutProps | null

  frame13?: FrameProps | null
  frame14?: FrameProps | null
  textLabel10?: TextLabelProps | null
  textLabel11?: TextLabelProps | null
  frame15?: FrameProps | null
  textSubtitle?: TextSubtitleProps | null

  frame16?: FrameProps | null
  frame17?: FrameProps | null
  textLabel12?: TextLabelProps | null
  textLabel13?: TextLabelProps | null
  frame18?: FrameProps | null
  textTitle?: TextTitleProps | null

  frame19?: FrameProps | null
  frame20?: FrameProps | null
  textLabel14?: TextLabelProps | null
  textLabel15?: TextLabelProps | null
  frame21?: FrameProps | null
  textSubheading?: TextSubheadingProps | null

  frame22?: FrameProps | null
  frame23?: FrameProps | null
  textLabel16?: TextLabelProps | null
  textLabel17?: TextLabelProps | null
  frame24?: FrameProps | null
  textHeading?: TextHeadingProps | null

  frame25?: FrameProps | null
  frame26?: FrameProps | null
  textLabel18?: TextLabelProps | null
  textLabel19?: TextLabelProps | null
  frame27?: FrameProps | null
  textDisplay?: TextDisplayProps | null
}

//
// Default property values
//
const sdn: SpecimenProps = {
  "aria-hidden": "false",
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--uqd5",
    "data-seldon-ref": "typeSpecimenNormal",
  },
  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ual8",
  },
  textLabel: {
    children: "Body · P",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--t17u",
    "data-seldon-ref": "typeSpecimenNormalLabel",
  },
  textLabel2: {
    children: "Normal / 0.75rem / 400 / 1.25",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--s2lk",
    "data-seldon-ref": "typeSpecimenNormalSpec",
  },
  frame3: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--kpqc",
  },
  textDescription: {
    children:
      "Visual communication of any kind, whether persuasive or informative, from billboards to birth announcements, should be seen as the embodiment of form and function: the integration of the beautiful and useful. Copy, art, and typography should be seen as a living entity; each element integrally related, in harmony with the whole, and essential to the execution of an idea.",
    htmlElement: "p",
    "aria-hidden": "false",
    className: "sdn-text-description sdn-text-description--wdml",
    "data-seldon-ref": "typeSpecimenNormalPreview",
  },

  frame4: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--uqd5",
    "data-seldon-ref": "typeSpecimenLabel",
  },
  frame5: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ual8",
  },
  textLabel3: {
    children: "Label",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--t17u",
    "data-seldon-ref": "typeSpecimenLabelLabel",
  },
  textLabel4: {
    children: "Normal / 0.75rem / 400 / 1.15",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--s2lk",
    "data-seldon-ref": "typeSpecimenLabelSpec",
  },
  frame6: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--g08m",
  },
  textLabel5: {
    children: "Design can be art. Design can be aesthetics.",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-description--welb",
    "data-seldon-ref": "typeSpecimenLabelPreview",
  },

  frame7: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--uqd5",
    "data-seldon-ref": "typeSpecimenTagline",
  },
  frame8: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ual8",
  },
  textLabel6: {
    children: "Tagline · P",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--t17u",
    "data-seldon-ref": "typeSpecimenTaglineLabel",
  },
  textLabel7: {
    children: "Normal / 0.75rem / 500 / 1.25",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--s2lk",
    "data-seldon-ref": "typeSpecimenTaglineSpec",
  },
  frame9: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--g08m",
  },
  textTagline: {
    children: "Design is so simple, that&#039;s why it is so complicated.",
    htmlElement: "p",
    "aria-hidden": "false",
    className: "sdn-text-tagline sdn-text-title--drqy",
    "data-seldon-ref": "typeSpecimenTaglinePreview",
  },

  frame10: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--uqd5",
    "data-seldon-ref": "typeSpecimenCallout",
  },
  frame11: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ual8",
  },
  textLabel8: {
    children: "Callout · H6",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--t17u",
    "data-seldon-ref": "typeSpecimenCalloutLabel",
  },
  textLabel9: {
    children: "Normal / 0.75rem / 300 / 1.33",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--s2lk",
    "data-seldon-ref": "typeSpecimenCalloutSpec",
  },
  frame12: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--g08m",
  },
  textCallout: {
    children:
      "Design can be art. Design can be aesthetics. Design is so simple, that&#039;s why it is so complicated.",
    htmlElement: "h6",
    "aria-hidden": "false",
    className: "sdn-text-callout sdn-text-title--drqy",
    "data-seldon-ref": "typeSpecimenCalloutPreview",
  },

  frame13: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--uqd5",
    "data-seldon-ref": "typeSpecimenSubtitle",
  },
  frame14: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ual8",
  },
  textLabel10: {
    children: "Subtitle · H5",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--t17u",
    "data-seldon-ref": "typeSpecimenSubtitleLabel",
  },
  textLabel11: {
    children: "Normal / 0.875rem / 400 / 1.25",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--s2lk",
    "data-seldon-ref": "typeSpecimenSubtitleSpec",
  },
  frame15: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--cgym",
  },
  textSubtitle: {
    children:
      "Design can be art. Design can be aesthetics. Design is so simple, that&#039;s why it is so complicated.",
    htmlElement: "h5",
    "aria-hidden": "false",
    className: "sdn-text-subtitle sdn-text-title--drqy",
    "data-seldon-ref": "typeSpecimenSubtitlePreview",
  },

  frame16: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--uqd5",
    "data-seldon-ref": "typeSpecimenTitle",
  },
  frame17: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ual8",
  },
  textLabel12: {
    children: "Title · H4",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--t17u",
    "data-seldon-ref": "typeSpecimenTitleLabel",
  },
  textLabel13: {
    children: "Normal / 1rem / 500 / 1.25",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--s2lk",
    "data-seldon-ref": "typeSpecimenTitleSpec",
  },
  frame18: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--cgym",
  },
  textTitle: {
    children:
      "Design can be art. Design can be aesthetics. Design is so simple, that&#039;s why it is so complicated.",
    htmlElement: "h4",
    "aria-hidden": "false",
    className: "sdn-text-title sdn-text-title--drqy",
    "data-seldon-ref": "typeSpecimenTitlePreview",
  },

  frame19: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--uqd5",
    "data-seldon-ref": "typeSpecimenSubheading",
  },
  frame20: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ual8",
  },
  textLabel14: {
    children: "Subheading · H3",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--t17u",
    "data-seldon-ref": "typeSpecimenSubheadingLabel",
  },
  textLabel15: {
    children: "Normal / 1.5rem / 500 / 1.25",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--s2lk",
    "data-seldon-ref": "typeSpecimenSubheadingSpec",
  },
  frame21: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--cgym",
  },
  textSubheading: {
    children:
      "Design can be art. Design can be aesthetics. Design is so simple, that&#039;s why it is so complicated.",
    htmlElement: "h3",
    "aria-hidden": "false",
    className: "sdn-text-subheading sdn-text-title--drqy",
    "data-seldon-ref": "typeSpecimenSubheadingPreview",
  },

  frame22: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--uqd5",
    "data-seldon-ref": "typeSpecimenHeading",
  },
  frame23: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ual8",
  },
  textLabel16: {
    children: "Heading · H2",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--t17u",
    "data-seldon-ref": "typeSpecimenHeadingLabel",
  },
  textLabel17: {
    children: "Normal / 2rem / 600 / 1.25",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--s2lk",
    "data-seldon-ref": "typeSpecimenHeadingSpec",
  },
  frame24: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--cgym",
  },
  textHeading: {
    children:
      "Design can be art. Design can be aesthetics. Design is so simple, that&#039;s why it is so complicated.",
    htmlElement: "h2",
    "aria-hidden": "false",
    className: "sdn-text-heading sdn-text-display--ejwe",
    "data-seldon-ref": "typeSpecimenHeadingPreview",
  },

  frame25: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--uqd5",
    "data-seldon-ref": "typeSpecimenDisplay",
  },
  frame26: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ual8",
  },
  textLabel18: {
    children: "Display · H1",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--t17u",
    "data-seldon-ref": "typeSpecimenDisplayLabel",
  },
  textLabel19: {
    children: "Norma / 3rem / 700 / 1.15",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--s2lk",
    "data-seldon-ref": "typeSpecimenDisplaySpec",
  },
  frame27: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--cgym",
  },
  textDisplay: {
    children:
      "Design can be art. Design can be aesthetics. Design is so simple, that&#039;s why it is so complicated.",
    htmlElement: "h1",
    "aria-hidden": "false",
    className: "sdn-text-display sdn-text-display--ejwe",
    "data-seldon-ref": "typeSpecimenDisplayPreview",
  },
}

/**
 * Module: Specimen
 * Level: Module
 * Intent: Specimens for all types of typography, iconography, themes, and design system specs
 * Tags:
 * Type: Inline
 *
 * Structure:
 *   Frame                frame            -> typeSpecimenNormal
 *     Frame              frame2
 *       TextLabel        textLabel        -> typeSpecimenNormalLabel
 *       TextLabel        textLabel2       -> typeSpecimenNormalSpec
 *     Frame              frame3
 *       TextDescription  textDescription  -> typeSpecimenNormalPreview
 *   Frame                frame4           -> typeSpecimenLabel
 *     Frame              frame5
 *       TextLabel        textLabel3       -> typeSpecimenLabelLabel
 *       TextLabel        textLabel4       -> typeSpecimenLabelSpec
 *     Frame              frame6
 *       TextLabel        textLabel5       -> typeSpecimenLabelPreview
 *   Frame                frame7           -> typeSpecimenTagline
 *     Frame              frame8
 *       TextLabel        textLabel6       -> typeSpecimenTaglineLabel
 *       TextLabel        textLabel7       -> typeSpecimenTaglineSpec
 *     Frame              frame9
 *       TextTagline      textTagline      -> typeSpecimenTaglinePreview
 *   Frame                frame10          -> typeSpecimenCallout
 *     Frame              frame11
 *       TextLabel        textLabel8       -> typeSpecimenCalloutLabel
 *       TextLabel        textLabel9       -> typeSpecimenCalloutSpec
 *     Frame              frame12
 *       TextCallout      textCallout      -> typeSpecimenCalloutPreview
 *   Frame                frame13          -> typeSpecimenSubtitle
 *     Frame              frame14
 *       TextLabel        textLabel10      -> typeSpecimenSubtitleLabel
 *       TextLabel        textLabel11      -> typeSpecimenSubtitleSpec
 *     Frame              frame15
 *       TextSubtitle     textSubtitle     -> typeSpecimenSubtitlePreview
 *   Frame                frame16          -> typeSpecimenTitle
 *     Frame              frame17
 *       TextLabel        textLabel12      -> typeSpecimenTitleLabel
 *       TextLabel        textLabel13      -> typeSpecimenTitleSpec
 *     Frame              frame18
 *       TextTitle        textTitle        -> typeSpecimenTitlePreview
 *   Frame                frame19          -> typeSpecimenSubheading
 *     Frame              frame20
 *       TextLabel        textLabel14      -> typeSpecimenSubheadingLabel
 *       TextLabel        textLabel15      -> typeSpecimenSubheadingSpec
 *     Frame              frame21
 *       TextSubheading   textSubheading   -> typeSpecimenSubheadingPreview
 *   Frame                frame22          -> typeSpecimenHeading
 *     Frame              frame23
 *       TextLabel        textLabel16      -> typeSpecimenHeadingLabel
 *       TextLabel        textLabel17      -> typeSpecimenHeadingSpec
 *     Frame              frame24
 *       TextHeading      textHeading      -> typeSpecimenHeadingPreview
 *   Frame                frame25          -> typeSpecimenDisplay
 *     Frame              frame26
 *       TextLabel        textLabel18      -> typeSpecimenDisplayLabel
 *       TextLabel        textLabel19      -> typeSpecimenDisplaySpec
 *     Frame              frame27
 *       TextDisplay      textDisplay      -> typeSpecimenDisplayPreview
 *
 * @example
 * ```tsx
 * <Specimen
 *   aria-hidden="false"
 *   frame="{}"
 *   textLabel="{}"
 *   textLabel2="{}"
 *   frame2="{}"
 *   textDescription="{}"
 *   frame3="{}"
 *   textTagline="{}"
 *   frame4="{}"
 *   textCallout="{}"
 *   frame5="{}"
 *   textSubtitle="Product Title"
 *   frame6="{}"
 *   textTitle="Product Title"
 *   frame7="{}"
 *   textSubheading="{}"
 *   frame8="{}"
 *   textHeading="{}"
 *   frame9="{}"
 *   textDisplay="{}"
 * />
 * ```
 */
export function Specimen({
  className = "",
  frame,
  frame2,
  textLabel,
  textLabel2,
  frame3,
  textDescription,

  frame4,
  frame5,
  textLabel3,
  textLabel4,
  frame6,
  textLabel5,

  frame7,
  frame8,
  textLabel6,
  textLabel7,
  frame9,
  textTagline,

  frame10,
  frame11,
  textLabel8,
  textLabel9,
  frame12,
  textCallout,

  frame13,
  frame14,
  textLabel10,
  textLabel11,
  frame15,
  textSubtitle,

  frame16,
  frame17,
  textLabel12,
  textLabel13,
  frame18,
  textTitle,

  frame19,
  frame20,
  textLabel14,
  textLabel15,
  frame21,
  textSubheading,

  frame22,
  frame23,
  textLabel16,
  textLabel17,
  frame24,
  textHeading,

  frame25,
  frame26,
  textLabel18,
  textLabel19,
  frame27,
  textDisplay,

  children,
  seldonRefs,
  ...props
}: SpecimenProps) {
  const specimenClassName = combineClassNames("sdn-specimen", className)

  const frameProps = mergeSlot(sdn.frame, frame, seldonRefs)
  const frame2Props = mergeSlot(sdn.frame2, frame2, seldonRefs)
  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)
  const textLabel2Props = mergeOptionalSlot(sdn.textLabel2, textLabel2, seldonRefs)
  const frame3Props = mergeSlot(sdn.frame3, frame3, seldonRefs)
  const textDescriptionProps = mergeOptionalSlot(sdn.textDescription, textDescription, seldonRefs)

  const frame4Props = mergeSlot(sdn.frame4, frame4, seldonRefs)
  const frame5Props = mergeSlot(sdn.frame5, frame5, seldonRefs)
  const textLabel3Props = mergeOptionalSlot(sdn.textLabel3, textLabel3, seldonRefs)
  const textLabel4Props = mergeOptionalSlot(sdn.textLabel4, textLabel4, seldonRefs)
  const frame6Props = mergeSlot(sdn.frame6, frame6, seldonRefs)
  const textLabel5Props = mergeOptionalSlot(sdn.textLabel5, textLabel5, seldonRefs)

  const frame7Props = mergeSlot(sdn.frame7, frame7, seldonRefs)
  const frame8Props = mergeSlot(sdn.frame8, frame8, seldonRefs)
  const textLabel6Props = mergeOptionalSlot(sdn.textLabel6, textLabel6, seldonRefs)
  const textLabel7Props = mergeOptionalSlot(sdn.textLabel7, textLabel7, seldonRefs)
  const frame9Props = mergeSlot(sdn.frame9, frame9, seldonRefs)
  const textTaglineProps = mergeOptionalSlot(sdn.textTagline, textTagline, seldonRefs)

  const frame10Props = mergeSlot(sdn.frame10, frame10, seldonRefs)
  const frame11Props = mergeSlot(sdn.frame11, frame11, seldonRefs)
  const textLabel8Props = mergeOptionalSlot(sdn.textLabel8, textLabel8, seldonRefs)
  const textLabel9Props = mergeOptionalSlot(sdn.textLabel9, textLabel9, seldonRefs)
  const frame12Props = mergeSlot(sdn.frame12, frame12, seldonRefs)
  const textCalloutProps = mergeOptionalSlot(sdn.textCallout, textCallout, seldonRefs)

  const frame13Props = mergeSlot(sdn.frame13, frame13, seldonRefs)
  const frame14Props = mergeSlot(sdn.frame14, frame14, seldonRefs)
  const textLabel10Props = mergeOptionalSlot(sdn.textLabel10, textLabel10, seldonRefs)
  const textLabel11Props = mergeOptionalSlot(sdn.textLabel11, textLabel11, seldonRefs)
  const frame15Props = mergeSlot(sdn.frame15, frame15, seldonRefs)
  const textSubtitleProps = mergeOptionalSlot(sdn.textSubtitle, textSubtitle, seldonRefs)

  const frame16Props = mergeSlot(sdn.frame16, frame16, seldonRefs)
  const frame17Props = mergeSlot(sdn.frame17, frame17, seldonRefs)
  const textLabel12Props = mergeOptionalSlot(sdn.textLabel12, textLabel12, seldonRefs)
  const textLabel13Props = mergeOptionalSlot(sdn.textLabel13, textLabel13, seldonRefs)
  const frame18Props = mergeSlot(sdn.frame18, frame18, seldonRefs)
  const textTitleProps = mergeOptionalSlot(sdn.textTitle, textTitle, seldonRefs)

  const frame19Props = mergeSlot(sdn.frame19, frame19, seldonRefs)
  const frame20Props = mergeSlot(sdn.frame20, frame20, seldonRefs)
  const textLabel14Props = mergeOptionalSlot(sdn.textLabel14, textLabel14, seldonRefs)
  const textLabel15Props = mergeOptionalSlot(sdn.textLabel15, textLabel15, seldonRefs)
  const frame21Props = mergeSlot(sdn.frame21, frame21, seldonRefs)
  const textSubheadingProps = mergeOptionalSlot(sdn.textSubheading, textSubheading, seldonRefs)

  const frame22Props = mergeSlot(sdn.frame22, frame22, seldonRefs)
  const frame23Props = mergeSlot(sdn.frame23, frame23, seldonRefs)
  const textLabel16Props = mergeOptionalSlot(sdn.textLabel16, textLabel16, seldonRefs)
  const textLabel17Props = mergeOptionalSlot(sdn.textLabel17, textLabel17, seldonRefs)
  const frame24Props = mergeSlot(sdn.frame24, frame24, seldonRefs)
  const textHeadingProps = mergeOptionalSlot(sdn.textHeading, textHeading, seldonRefs)

  const frame25Props = mergeSlot(sdn.frame25, frame25, seldonRefs)
  const frame26Props = mergeSlot(sdn.frame26, frame26, seldonRefs)
  const textLabel18Props = mergeOptionalSlot(sdn.textLabel18, textLabel18, seldonRefs)
  const textLabel19Props = mergeOptionalSlot(sdn.textLabel19, textLabel19, seldonRefs)
  const frame27Props = mergeSlot(sdn.frame27, frame27, seldonRefs)
  const textDisplayProps = mergeOptionalSlot(sdn.textDisplay, textDisplay, seldonRefs)

  return (
    <HTMLDiv className={specimenClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
      {children !== undefined ? (
        children
      ) : (
        <>
          <Frame {...frameProps}>
            <Frame {...frame2Props}>
              {textLabelProps !== null && <TextLabel {...textLabelProps} />}
              {textLabel2Props !== null && <TextLabel {...textLabel2Props} />}
            </Frame>
            <Frame {...frame3Props}>
              {textDescriptionProps !== null && <TextDescription {...textDescriptionProps} />}
            </Frame>
          </Frame>
          <Frame {...frame4Props}>
            <Frame {...frame5Props}>
              {textLabel3Props !== null && <TextLabel {...textLabel3Props} />}
              {textLabel4Props !== null && <TextLabel {...textLabel4Props} />}
            </Frame>
            <Frame {...frame6Props}>
              {textLabel5Props !== null && <TextLabel {...textLabel5Props} />}
            </Frame>
          </Frame>
          <Frame {...frame7Props}>
            <Frame {...frame8Props}>
              {textLabel6Props !== null && <TextLabel {...textLabel6Props} />}
              {textLabel7Props !== null && <TextLabel {...textLabel7Props} />}
            </Frame>
            <Frame {...frame9Props}>
              {textTaglineProps !== null && <TextTagline {...textTaglineProps} />}
            </Frame>
          </Frame>
          <Frame {...frame10Props}>
            <Frame {...frame11Props}>
              {textLabel8Props !== null && <TextLabel {...textLabel8Props} />}
              {textLabel9Props !== null && <TextLabel {...textLabel9Props} />}
            </Frame>
            <Frame {...frame12Props}>
              {textCalloutProps !== null && <TextCallout {...textCalloutProps} />}
            </Frame>
          </Frame>
          <Frame {...frame13Props}>
            <Frame {...frame14Props}>
              {textLabel10Props !== null && <TextLabel {...textLabel10Props} />}
              {textLabel11Props !== null && <TextLabel {...textLabel11Props} />}
            </Frame>
            <Frame {...frame15Props}>
              {textSubtitleProps !== null && <TextSubtitle {...textSubtitleProps} />}
            </Frame>
          </Frame>
          <Frame {...frame16Props}>
            <Frame {...frame17Props}>
              {textLabel12Props !== null && <TextLabel {...textLabel12Props} />}
              {textLabel13Props !== null && <TextLabel {...textLabel13Props} />}
            </Frame>
            <Frame {...frame18Props}>
              {textTitleProps !== null && <TextTitle {...textTitleProps} />}
            </Frame>
          </Frame>
          <Frame {...frame19Props}>
            <Frame {...frame20Props}>
              {textLabel14Props !== null && <TextLabel {...textLabel14Props} />}
              {textLabel15Props !== null && <TextLabel {...textLabel15Props} />}
            </Frame>
            <Frame {...frame21Props}>
              {textSubheadingProps !== null && <TextSubheading {...textSubheadingProps} />}
            </Frame>
          </Frame>
          <Frame {...frame22Props}>
            <Frame {...frame23Props}>
              {textLabel16Props !== null && <TextLabel {...textLabel16Props} />}
              {textLabel17Props !== null && <TextLabel {...textLabel17Props} />}
            </Frame>
            <Frame {...frame24Props}>
              {textHeadingProps !== null && <TextHeading {...textHeadingProps} />}
            </Frame>
          </Frame>
          <Frame {...frame25Props}>
            <Frame {...frame26Props}>
              {textLabel18Props !== null && <TextLabel {...textLabel18Props} />}
              {textLabel19Props !== null && <TextLabel {...textLabel19Props} />}
            </Frame>
            <Frame {...frame27Props}>
              {textDisplayProps !== null && <TextDisplay {...textDisplayProps} />}
            </Frame>
          </Frame>
        </>
      )}
    </HTMLDiv>
  )
}

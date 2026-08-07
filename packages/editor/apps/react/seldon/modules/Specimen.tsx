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
import { Hr, HrProps } from "../primitives/Hr"
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
  textDescription2?: TextDescriptionProps | null
  textDescription3?: TextDescriptionProps | null
  textDescription4?: TextDescriptionProps | null

  hr?: HrProps | null

  frame4?: FrameProps | null
  frame5?: FrameProps | null
  textLabel3?: TextLabelProps | null
  textLabel4?: TextLabelProps | null
  frame6?: FrameProps | null
  textDescription5?: TextDescriptionProps | null

  frame7?: FrameProps | null
  frame8?: FrameProps | null
  textLabel5?: TextLabelProps | null
  textLabel6?: TextLabelProps | null
  frame9?: FrameProps | null
  textLabel7?: TextLabelProps | null

  frame10?: FrameProps | null
  frame11?: FrameProps | null
  textLabel8?: TextLabelProps | null
  textLabel9?: TextLabelProps | null
  frame12?: FrameProps | null
  textTagline?: TextTaglineProps | null

  frame13?: FrameProps | null
  frame14?: FrameProps | null
  textLabel10?: TextLabelProps | null
  textLabel11?: TextLabelProps | null
  frame15?: FrameProps | null
  textCallout?: TextCalloutProps | null

  frame16?: FrameProps | null
  frame17?: FrameProps | null
  textLabel12?: TextLabelProps | null
  textLabel13?: TextLabelProps | null
  frame18?: FrameProps | null
  textSubtitle?: TextSubtitleProps | null

  frame19?: FrameProps | null
  frame20?: FrameProps | null
  textLabel14?: TextLabelProps | null
  textLabel15?: TextLabelProps | null
  frame21?: FrameProps | null
  textTitle?: TextTitleProps | null

  frame22?: FrameProps | null
  frame23?: FrameProps | null
  textLabel16?: TextLabelProps | null
  textLabel17?: TextLabelProps | null
  frame24?: FrameProps | null
  textSubheading?: TextSubheadingProps | null

  frame25?: FrameProps | null
  frame26?: FrameProps | null
  textLabel18?: TextLabelProps | null
  textLabel19?: TextLabelProps | null
  frame27?: FrameProps | null
  textHeading?: TextHeadingProps | null

  frame28?: FrameProps | null
  frame29?: FrameProps | null
  textLabel20?: TextLabelProps | null
  textLabel21?: TextLabelProps | null
  frame30?: FrameProps | null
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
    "data-seldon-ref": "typeSpecimenPreview",
  },
  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--odzo",
    "data-seldon-ref": "typeSpecimenFamily",
  },
  textLabel: {
    children: "Font Family",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--t17u",
    "data-seldon-ref": "typeSpecimenFamilyLabel",
  },
  textLabel2: {
    children:
      "100, 200, 300, 400, 500, 600, 700, 100 Italic, 200 Italic, 300 Italic, 400 Italic, 500 Italic, 600 Italic, 700 Italic",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--s2lk",
    "data-seldon-ref": "typeSpecimenFamilySizes",
  },
  frame3: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--pmdr",
    "data-seldon-ref": "typeSpecimenGlyphs",
  },
  textDescription: {
    children: "IBM Plex San",
    htmlElement: "p",
    "aria-hidden": "false",
    className: "sdn-text-description sdn-text-description--r0mk",
    "data-seldon-ref": "typeSpecimenName",
  },
  textDescription2: {
    children: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    htmlElement: "p",
    "aria-hidden": "false",
    className: "sdn-text-description sdn-text-description--hrzz",
    "data-seldon-ref": "typeSpecimenUppercase",
  },
  textDescription3: {
    children: "abcdefghijklmnopqrstuvwxyz",
    htmlElement: "p",
    "aria-hidden": "false",
    className: "sdn-text-description sdn-text-description--hrzz",
    "data-seldon-ref": "typeSpecimenLowercase",
  },
  textDescription4: {
    children: "0123456789 ¿ ? ¡ ! &amp; @ ‘ ’ “ ” « » % * ^ # $ £ € ¢ / ( ) [ ] { } . , ® ©",
    htmlElement: "p",
    "aria-hidden": "false",
    className: "sdn-text-description sdn-text-description--hrzz",
    "data-seldon-ref": "typeSpecimenNumbers",
  },

  hr: {
    "aria-hidden": "false",
    className: "sdn-hr sdn-hr--atz4",
  },

  frame4: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--uqd5",
    "data-seldon-ref": "typeSpecimenNormal",
  },
  frame5: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ual8",
  },
  textLabel3: {
    children: "Body · P",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--t17u",
    "data-seldon-ref": "typeSpecimenNormalLabel",
  },
  textLabel4: {
    children: "Normal / 0.75rem / 400 / 1.25",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--s2lk",
    "data-seldon-ref": "typeSpecimenNormalSpec",
  },
  frame6: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--pmdr",
  },
  textDescription5: {
    children:
      "Visual communication of any kind, whether persuasive or informative, from billboards to birth announcements, should be seen as the embodiment of form and function: the integration of the beautiful and useful. Copy, art, and typography should be seen as a living entity; each element integrally related, in harmony with the whole, and essential to the execution of an idea.",
    htmlElement: "p",
    "aria-hidden": "false",
    className: "sdn-text-description sdn-text-description--wdml",
    "data-seldon-ref": "typeSpecimenNormalPreview",
  },

  frame7: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--uqd5",
    "data-seldon-ref": "typeSpecimenLabel",
  },
  frame8: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ual8",
  },
  textLabel5: {
    children: "Label",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--t17u",
    "data-seldon-ref": "typeSpecimenLabelLabel",
  },
  textLabel6: {
    children: "Normal / 0.75rem / 400 / 1.15",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--s2lk",
    "data-seldon-ref": "typeSpecimenLabelSpec",
  },
  frame9: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--g08m",
  },
  textLabel7: {
    children: "Design can be art. Design can be aesthetics.",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-description--welb",
    "data-seldon-ref": "typeSpecimenLabelPreview",
  },

  frame10: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--uqd5",
    "data-seldon-ref": "typeSpecimenTagline",
  },
  frame11: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ual8",
  },
  textLabel8: {
    children: "Tagline · P",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--t17u",
    "data-seldon-ref": "typeSpecimenTaglineLabel",
  },
  textLabel9: {
    children: "Normal / 0.75rem / 500 / 1.25",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--s2lk",
    "data-seldon-ref": "typeSpecimenTaglineSpec",
  },
  frame12: {
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

  frame13: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--uqd5",
    "data-seldon-ref": "typeSpecimenCallout",
  },
  frame14: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ual8",
  },
  textLabel10: {
    children: "Callout · H6",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--t17u",
    "data-seldon-ref": "typeSpecimenCalloutLabel",
  },
  textLabel11: {
    children: "Italic / 0.75rem / 300 / 1.33",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--s2lk",
    "data-seldon-ref": "typeSpecimenCalloutSpec",
  },
  frame15: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--g08m",
  },
  textCallout: {
    children:
      "Design can be art. Design can be aesthetics. Design is so simple, that&#039;s why it is so complicated.",
    htmlElement: "h6",
    "aria-hidden": "false",
    className: "sdn-text-callout sdn-text-subheading--bxdp",
    "data-seldon-ref": "typeSpecimenCalloutPreview",
  },

  frame16: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--uqd5",
    "data-seldon-ref": "typeSpecimenSubtitle",
  },
  frame17: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ual8",
  },
  textLabel12: {
    children: "Subtitle · H5",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--t17u",
    "data-seldon-ref": "typeSpecimenSubtitleLabel",
  },
  textLabel13: {
    children: "Normal / 0.875rem / 400 / 1.25",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--s2lk",
    "data-seldon-ref": "typeSpecimenSubtitleSpec",
  },
  frame18: {
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

  frame19: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--uqd5",
    "data-seldon-ref": "typeSpecimenTitle",
  },
  frame20: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ual8",
  },
  textLabel14: {
    children: "Title · H4",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--t17u",
    "data-seldon-ref": "typeSpecimenTitleLabel",
  },
  textLabel15: {
    children: "Normal / 1rem / 500 / 1.25",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--s2lk",
    "data-seldon-ref": "typeSpecimenTitleSpec",
  },
  frame21: {
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

  frame22: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--uqd5",
    "data-seldon-ref": "typeSpecimenSubheading",
  },
  frame23: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ual8",
  },
  textLabel16: {
    children: "Subheading · H3",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--t17u",
    "data-seldon-ref": "typeSpecimenSubheadingLabel",
  },
  textLabel17: {
    children: "Italic / 1.5rem / 500 / 1.25",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--s2lk",
    "data-seldon-ref": "typeSpecimenSubheadingSpec",
  },
  frame24: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--cgym",
  },
  textSubheading: {
    children:
      "Design can be art. Design can be aesthetics. Design is so simple, that&#039;s why it is so complicated.",
    htmlElement: "h3",
    "aria-hidden": "false",
    className: "sdn-text-subheading sdn-text-subheading--bxdp",
    "data-seldon-ref": "typeSpecimenSubheadingPreview",
  },

  frame25: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--uqd5",
    "data-seldon-ref": "typeSpecimenHeading",
  },
  frame26: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ual8",
  },
  textLabel18: {
    children: "Heading · H2",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--t17u",
    "data-seldon-ref": "typeSpecimenHeadingLabel",
  },
  textLabel19: {
    children: "Normal / 2rem / 600 / 1.25",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--s2lk",
    "data-seldon-ref": "typeSpecimenHeadingSpec",
  },
  frame27: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--cgym",
  },
  textHeading: {
    children:
      "Design can be art. Design can be aesthetics. Design is so simple, that&#039;s why it is so complicated.",
    htmlElement: "h2",
    "aria-hidden": "false",
    className: "sdn-text-heading sdn-text-heading--dnyx",
    "data-seldon-ref": "typeSpecimenHeadingPreview",
  },

  frame28: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--uqd5",
    "data-seldon-ref": "typeSpecimenDisplay",
  },
  frame29: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ual8",
  },
  textLabel20: {
    children: "Display · H1",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--t17u",
    "data-seldon-ref": "typeSpecimenDisplayLabel",
  },
  textLabel21: {
    children: "Italic / 3rem / 700 / 1.15",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--s2lk",
    "data-seldon-ref": "typeSpecimenDisplaySpec",
  },
  frame30: {
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
 *   Frame                frame             -> typeSpecimenPreview
 *     Frame              frame2            -> typeSpecimenFamily
 *       TextLabel        textLabel         -> typeSpecimenFamilyLabel
 *       TextLabel        textLabel2        -> typeSpecimenFamilySizes
 *     Frame              frame3            -> typeSpecimenGlyphs
 *       TextDescription  textDescription   -> typeSpecimenName
 *       TextDescription  textDescription2  -> typeSpecimenUppercase
 *       TextDescription  textDescription3  -> typeSpecimenLowercase
 *       TextDescription  textDescription4  -> typeSpecimenNumbers
 *   Hr                   hr
 *   Frame                frame4            -> typeSpecimenNormal
 *     Frame              frame5
 *       TextLabel        textLabel3        -> typeSpecimenNormalLabel
 *       TextLabel        textLabel4        -> typeSpecimenNormalSpec
 *     Frame              frame6
 *       TextDescription  textDescription5  -> typeSpecimenNormalPreview
 *   Frame                frame7            -> typeSpecimenLabel
 *     Frame              frame8
 *       TextLabel        textLabel5        -> typeSpecimenLabelLabel
 *       TextLabel        textLabel6        -> typeSpecimenLabelSpec
 *     Frame              frame9
 *       TextLabel        textLabel7        -> typeSpecimenLabelPreview
 *   Frame                frame10           -> typeSpecimenTagline
 *     Frame              frame11
 *       TextLabel        textLabel8        -> typeSpecimenTaglineLabel
 *       TextLabel        textLabel9        -> typeSpecimenTaglineSpec
 *     Frame              frame12
 *       TextTagline      textTagline       -> typeSpecimenTaglinePreview
 *   Frame                frame13           -> typeSpecimenCallout
 *     Frame              frame14
 *       TextLabel        textLabel10       -> typeSpecimenCalloutLabel
 *       TextLabel        textLabel11       -> typeSpecimenCalloutSpec
 *     Frame              frame15
 *       TextCallout      textCallout       -> typeSpecimenCalloutPreview
 *   Frame                frame16           -> typeSpecimenSubtitle
 *     Frame              frame17
 *       TextLabel        textLabel12       -> typeSpecimenSubtitleLabel
 *       TextLabel        textLabel13       -> typeSpecimenSubtitleSpec
 *     Frame              frame18
 *       TextSubtitle     textSubtitle      -> typeSpecimenSubtitlePreview
 *   Frame                frame19           -> typeSpecimenTitle
 *     Frame              frame20
 *       TextLabel        textLabel14       -> typeSpecimenTitleLabel
 *       TextLabel        textLabel15       -> typeSpecimenTitleSpec
 *     Frame              frame21
 *       TextTitle        textTitle         -> typeSpecimenTitlePreview
 *   Frame                frame22           -> typeSpecimenSubheading
 *     Frame              frame23
 *       TextLabel        textLabel16       -> typeSpecimenSubheadingLabel
 *       TextLabel        textLabel17       -> typeSpecimenSubheadingSpec
 *     Frame              frame24
 *       TextSubheading   textSubheading    -> typeSpecimenSubheadingPreview
 *   Frame                frame25           -> typeSpecimenHeading
 *     Frame              frame26
 *       TextLabel        textLabel18       -> typeSpecimenHeadingLabel
 *       TextLabel        textLabel19       -> typeSpecimenHeadingSpec
 *     Frame              frame27
 *       TextHeading      textHeading       -> typeSpecimenHeadingPreview
 *   Frame                frame28           -> typeSpecimenDisplay
 *     Frame              frame29
 *       TextLabel        textLabel20       -> typeSpecimenDisplayLabel
 *       TextLabel        textLabel21       -> typeSpecimenDisplaySpec
 *     Frame              frame30
 *       TextDisplay      textDisplay       -> typeSpecimenDisplayPreview
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
 *   textDescription2="{}"
 *   textDescription3="{}"
 *   textDescription4="{}"
 *   hr="{}"
 *   frame3="{}"
 *   frame4="{}"
 *   textTagline="{}"
 *   frame5="{}"
 *   textCallout="{}"
 *   frame6="{}"
 *   textSubtitle="Product Title"
 *   frame7="{}"
 *   textTitle="Product Title"
 *   frame8="{}"
 *   textSubheading="{}"
 *   frame9="{}"
 *   textHeading="{}"
 *   frame10="{}"
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
  textDescription2,
  textDescription3,
  textDescription4,

  hr,

  frame4,
  frame5,
  textLabel3,
  textLabel4,
  frame6,
  textDescription5,

  frame7,
  frame8,
  textLabel5,
  textLabel6,
  frame9,
  textLabel7,

  frame10,
  frame11,
  textLabel8,
  textLabel9,
  frame12,
  textTagline,

  frame13,
  frame14,
  textLabel10,
  textLabel11,
  frame15,
  textCallout,

  frame16,
  frame17,
  textLabel12,
  textLabel13,
  frame18,
  textSubtitle,

  frame19,
  frame20,
  textLabel14,
  textLabel15,
  frame21,
  textTitle,

  frame22,
  frame23,
  textLabel16,
  textLabel17,
  frame24,
  textSubheading,

  frame25,
  frame26,
  textLabel18,
  textLabel19,
  frame27,
  textHeading,

  frame28,
  frame29,
  textLabel20,
  textLabel21,
  frame30,
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
  const textDescription2Props = mergeOptionalSlot(
    sdn.textDescription2,
    textDescription2,
    seldonRefs,
  )
  const textDescription3Props = mergeOptionalSlot(
    sdn.textDescription3,
    textDescription3,
    seldonRefs,
  )
  const textDescription4Props = mergeOptionalSlot(
    sdn.textDescription4,
    textDescription4,
    seldonRefs,
  )

  const hrProps = mergeSlot(sdn.hr, hr, seldonRefs)

  const frame4Props = mergeSlot(sdn.frame4, frame4, seldonRefs)
  const frame5Props = mergeSlot(sdn.frame5, frame5, seldonRefs)
  const textLabel3Props = mergeOptionalSlot(sdn.textLabel3, textLabel3, seldonRefs)
  const textLabel4Props = mergeOptionalSlot(sdn.textLabel4, textLabel4, seldonRefs)
  const frame6Props = mergeSlot(sdn.frame6, frame6, seldonRefs)
  const textDescription5Props = mergeOptionalSlot(
    sdn.textDescription5,
    textDescription5,
    seldonRefs,
  )

  const frame7Props = mergeSlot(sdn.frame7, frame7, seldonRefs)
  const frame8Props = mergeSlot(sdn.frame8, frame8, seldonRefs)
  const textLabel5Props = mergeOptionalSlot(sdn.textLabel5, textLabel5, seldonRefs)
  const textLabel6Props = mergeOptionalSlot(sdn.textLabel6, textLabel6, seldonRefs)
  const frame9Props = mergeSlot(sdn.frame9, frame9, seldonRefs)
  const textLabel7Props = mergeOptionalSlot(sdn.textLabel7, textLabel7, seldonRefs)

  const frame10Props = mergeSlot(sdn.frame10, frame10, seldonRefs)
  const frame11Props = mergeSlot(sdn.frame11, frame11, seldonRefs)
  const textLabel8Props = mergeOptionalSlot(sdn.textLabel8, textLabel8, seldonRefs)
  const textLabel9Props = mergeOptionalSlot(sdn.textLabel9, textLabel9, seldonRefs)
  const frame12Props = mergeSlot(sdn.frame12, frame12, seldonRefs)
  const textTaglineProps = mergeOptionalSlot(sdn.textTagline, textTagline, seldonRefs)

  const frame13Props = mergeSlot(sdn.frame13, frame13, seldonRefs)
  const frame14Props = mergeSlot(sdn.frame14, frame14, seldonRefs)
  const textLabel10Props = mergeOptionalSlot(sdn.textLabel10, textLabel10, seldonRefs)
  const textLabel11Props = mergeOptionalSlot(sdn.textLabel11, textLabel11, seldonRefs)
  const frame15Props = mergeSlot(sdn.frame15, frame15, seldonRefs)
  const textCalloutProps = mergeOptionalSlot(sdn.textCallout, textCallout, seldonRefs)

  const frame16Props = mergeSlot(sdn.frame16, frame16, seldonRefs)
  const frame17Props = mergeSlot(sdn.frame17, frame17, seldonRefs)
  const textLabel12Props = mergeOptionalSlot(sdn.textLabel12, textLabel12, seldonRefs)
  const textLabel13Props = mergeOptionalSlot(sdn.textLabel13, textLabel13, seldonRefs)
  const frame18Props = mergeSlot(sdn.frame18, frame18, seldonRefs)
  const textSubtitleProps = mergeOptionalSlot(sdn.textSubtitle, textSubtitle, seldonRefs)

  const frame19Props = mergeSlot(sdn.frame19, frame19, seldonRefs)
  const frame20Props = mergeSlot(sdn.frame20, frame20, seldonRefs)
  const textLabel14Props = mergeOptionalSlot(sdn.textLabel14, textLabel14, seldonRefs)
  const textLabel15Props = mergeOptionalSlot(sdn.textLabel15, textLabel15, seldonRefs)
  const frame21Props = mergeSlot(sdn.frame21, frame21, seldonRefs)
  const textTitleProps = mergeOptionalSlot(sdn.textTitle, textTitle, seldonRefs)

  const frame22Props = mergeSlot(sdn.frame22, frame22, seldonRefs)
  const frame23Props = mergeSlot(sdn.frame23, frame23, seldonRefs)
  const textLabel16Props = mergeOptionalSlot(sdn.textLabel16, textLabel16, seldonRefs)
  const textLabel17Props = mergeOptionalSlot(sdn.textLabel17, textLabel17, seldonRefs)
  const frame24Props = mergeSlot(sdn.frame24, frame24, seldonRefs)
  const textSubheadingProps = mergeOptionalSlot(sdn.textSubheading, textSubheading, seldonRefs)

  const frame25Props = mergeSlot(sdn.frame25, frame25, seldonRefs)
  const frame26Props = mergeSlot(sdn.frame26, frame26, seldonRefs)
  const textLabel18Props = mergeOptionalSlot(sdn.textLabel18, textLabel18, seldonRefs)
  const textLabel19Props = mergeOptionalSlot(sdn.textLabel19, textLabel19, seldonRefs)
  const frame27Props = mergeSlot(sdn.frame27, frame27, seldonRefs)
  const textHeadingProps = mergeOptionalSlot(sdn.textHeading, textHeading, seldonRefs)

  const frame28Props = mergeSlot(sdn.frame28, frame28, seldonRefs)
  const frame29Props = mergeSlot(sdn.frame29, frame29, seldonRefs)
  const textLabel20Props = mergeOptionalSlot(sdn.textLabel20, textLabel20, seldonRefs)
  const textLabel21Props = mergeOptionalSlot(sdn.textLabel21, textLabel21, seldonRefs)
  const frame30Props = mergeSlot(sdn.frame30, frame30, seldonRefs)
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
              {textDescription2Props !== null && <TextDescription {...textDescription2Props} />}
              {textDescription3Props !== null && <TextDescription {...textDescription3Props} />}
              {textDescription4Props !== null && <TextDescription {...textDescription4Props} />}
            </Frame>
          </Frame>
          {hrProps !== null && <Hr {...hrProps} />}
          <Frame {...frame4Props}>
            <Frame {...frame5Props}>
              {textLabel3Props !== null && <TextLabel {...textLabel3Props} />}
              {textLabel4Props !== null && <TextLabel {...textLabel4Props} />}
            </Frame>
            <Frame {...frame6Props}>
              {textDescription5Props !== null && <TextDescription {...textDescription5Props} />}
            </Frame>
          </Frame>
          <Frame {...frame7Props}>
            <Frame {...frame8Props}>
              {textLabel5Props !== null && <TextLabel {...textLabel5Props} />}
              {textLabel6Props !== null && <TextLabel {...textLabel6Props} />}
            </Frame>
            <Frame {...frame9Props}>
              {textLabel7Props !== null && <TextLabel {...textLabel7Props} />}
            </Frame>
          </Frame>
          <Frame {...frame10Props}>
            <Frame {...frame11Props}>
              {textLabel8Props !== null && <TextLabel {...textLabel8Props} />}
              {textLabel9Props !== null && <TextLabel {...textLabel9Props} />}
            </Frame>
            <Frame {...frame12Props}>
              {textTaglineProps !== null && <TextTagline {...textTaglineProps} />}
            </Frame>
          </Frame>
          <Frame {...frame13Props}>
            <Frame {...frame14Props}>
              {textLabel10Props !== null && <TextLabel {...textLabel10Props} />}
              {textLabel11Props !== null && <TextLabel {...textLabel11Props} />}
            </Frame>
            <Frame {...frame15Props}>
              {textCalloutProps !== null && <TextCallout {...textCalloutProps} />}
            </Frame>
          </Frame>
          <Frame {...frame16Props}>
            <Frame {...frame17Props}>
              {textLabel12Props !== null && <TextLabel {...textLabel12Props} />}
              {textLabel13Props !== null && <TextLabel {...textLabel13Props} />}
            </Frame>
            <Frame {...frame18Props}>
              {textSubtitleProps !== null && <TextSubtitle {...textSubtitleProps} />}
            </Frame>
          </Frame>
          <Frame {...frame19Props}>
            <Frame {...frame20Props}>
              {textLabel14Props !== null && <TextLabel {...textLabel14Props} />}
              {textLabel15Props !== null && <TextLabel {...textLabel15Props} />}
            </Frame>
            <Frame {...frame21Props}>
              {textTitleProps !== null && <TextTitle {...textTitleProps} />}
            </Frame>
          </Frame>
          <Frame {...frame22Props}>
            <Frame {...frame23Props}>
              {textLabel16Props !== null && <TextLabel {...textLabel16Props} />}
              {textLabel17Props !== null && <TextLabel {...textLabel17Props} />}
            </Frame>
            <Frame {...frame24Props}>
              {textSubheadingProps !== null && <TextSubheading {...textSubheadingProps} />}
            </Frame>
          </Frame>
          <Frame {...frame25Props}>
            <Frame {...frame26Props}>
              {textLabel18Props !== null && <TextLabel {...textLabel18Props} />}
              {textLabel19Props !== null && <TextLabel {...textLabel19Props} />}
            </Frame>
            <Frame {...frame27Props}>
              {textHeadingProps !== null && <TextHeading {...textHeadingProps} />}
            </Frame>
          </Frame>
          <Frame {...frame28Props}>
            <Frame {...frame29Props}>
              {textLabel20Props !== null && <TextLabel {...textLabel20Props} />}
              {textLabel21Props !== null && <TextLabel {...textLabel21Props} />}
            </Frame>
            <Frame {...frame30Props}>
              {textDisplayProps !== null && <TextDisplay {...textDisplayProps} />}
            </Frame>
          </Frame>
        </>
      )}
    </HTMLDiv>
  )
}

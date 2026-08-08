<script lang="ts">
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
 * ```vue
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
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"

import Frame from "../frames/Frame.vue"
import TextCallout from "../primitives/TextCallout.vue"
import TextDescription from "../primitives/TextDescription.vue"
import TextDisplay from "../primitives/TextDisplay.vue"
import TextHeading from "../primitives/TextHeading.vue"
import TextLabel from "../primitives/TextLabel.vue"
import TextSubheading from "../primitives/TextSubheading.vue"
import TextSubtitle from "../primitives/TextSubtitle.vue"
import TextTagline from "../primitives/TextTagline.vue"
import TextTitle from "../primitives/TextTitle.vue"
import { combineClassNames, mergeOptionalSlot, mergeSlot } from "../utils/class-names"

const props = defineProps<{
  className?: string
  frame?: Record<string, unknown> | null
  frame2?: Record<string, unknown> | null
  textLabel?: Record<string, unknown> | null
  textLabel2?: Record<string, unknown> | null
  frame3?: Record<string, unknown> | null
  textDescription?: Record<string, unknown> | null
  frame4?: Record<string, unknown> | null
  frame5?: Record<string, unknown> | null
  textLabel3?: Record<string, unknown> | null
  textLabel4?: Record<string, unknown> | null
  frame6?: Record<string, unknown> | null
  textLabel5?: Record<string, unknown> | null
  frame7?: Record<string, unknown> | null
  frame8?: Record<string, unknown> | null
  textLabel6?: Record<string, unknown> | null
  textLabel7?: Record<string, unknown> | null
  frame9?: Record<string, unknown> | null
  textTagline?: Record<string, unknown> | null
  frame10?: Record<string, unknown> | null
  frame11?: Record<string, unknown> | null
  textLabel8?: Record<string, unknown> | null
  textLabel9?: Record<string, unknown> | null
  frame12?: Record<string, unknown> | null
  textCallout?: Record<string, unknown> | null
  frame13?: Record<string, unknown> | null
  frame14?: Record<string, unknown> | null
  textLabel10?: Record<string, unknown> | null
  textLabel11?: Record<string, unknown> | null
  frame15?: Record<string, unknown> | null
  textSubtitle?: Record<string, unknown> | null
  frame16?: Record<string, unknown> | null
  frame17?: Record<string, unknown> | null
  textLabel12?: Record<string, unknown> | null
  textLabel13?: Record<string, unknown> | null
  frame18?: Record<string, unknown> | null
  textTitle?: Record<string, unknown> | null
  frame19?: Record<string, unknown> | null
  frame20?: Record<string, unknown> | null
  textLabel14?: Record<string, unknown> | null
  textLabel15?: Record<string, unknown> | null
  frame21?: Record<string, unknown> | null
  textSubheading?: Record<string, unknown> | null
  frame22?: Record<string, unknown> | null
  frame23?: Record<string, unknown> | null
  textLabel16?: Record<string, unknown> | null
  textLabel17?: Record<string, unknown> | null
  frame24?: Record<string, unknown> | null
  textHeading?: Record<string, unknown> | null
  frame25?: Record<string, unknown> | null
  frame26?: Record<string, unknown> | null
  textLabel18?: Record<string, unknown> | null
  textLabel19?: Record<string, unknown> | null
  frame27?: Record<string, unknown> | null
  textDisplay?: Record<string, unknown> | null
  seldonRefs?: Record<string, Record<string, unknown>>
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
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
    children: "Design is so simple, that's why it is so complicated.",
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
      "Design can be art. Design can be aesthetics. Design is so simple, that's why it is so complicated.",
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
      "Design can be art. Design can be aesthetics. Design is so simple, that's why it is so complicated.",
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
      "Design can be art. Design can be aesthetics. Design is so simple, that's why it is so complicated.",
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
      "Design can be art. Design can be aesthetics. Design is so simple, that's why it is so complicated.",
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
      "Design can be art. Design can be aesthetics. Design is so simple, that's why it is so complicated.",
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
      "Design can be art. Design can be aesthetics. Design is so simple, that's why it is so complicated.",
    htmlElement: "h1",
    "aria-hidden": "false",
    className: "sdn-text-display sdn-text-display--ejwe",
    "data-seldon-ref": "typeSpecimenDisplayPreview",
  },
}

const rootClassName = computed(() => combineClassNames("sdn-specimen", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const frameProps = computed(() => mergeSlot(sdn.frame, props.frame, props.seldonRefs))
const frame2Props = computed(() => mergeSlot(sdn.frame2, props.frame2, props.seldonRefs))
const textLabelProps = computed(() =>
  mergeOptionalSlot(sdn.textLabel, props.textLabel, props.seldonRefs),
)
const textLabel2Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel2, props.textLabel2, props.seldonRefs),
)
const frame3Props = computed(() => mergeSlot(sdn.frame3, props.frame3, props.seldonRefs))
const textDescriptionProps = computed(() =>
  mergeOptionalSlot(sdn.textDescription, props.textDescription, props.seldonRefs),
)
const frame4Props = computed(() => mergeSlot(sdn.frame4, props.frame4, props.seldonRefs))
const frame5Props = computed(() => mergeSlot(sdn.frame5, props.frame5, props.seldonRefs))
const textLabel3Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel3, props.textLabel3, props.seldonRefs),
)
const textLabel4Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel4, props.textLabel4, props.seldonRefs),
)
const frame6Props = computed(() => mergeSlot(sdn.frame6, props.frame6, props.seldonRefs))
const textLabel5Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel5, props.textLabel5, props.seldonRefs),
)
const frame7Props = computed(() => mergeSlot(sdn.frame7, props.frame7, props.seldonRefs))
const frame8Props = computed(() => mergeSlot(sdn.frame8, props.frame8, props.seldonRefs))
const textLabel6Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel6, props.textLabel6, props.seldonRefs),
)
const textLabel7Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel7, props.textLabel7, props.seldonRefs),
)
const frame9Props = computed(() => mergeSlot(sdn.frame9, props.frame9, props.seldonRefs))
const textTaglineProps = computed(() =>
  mergeOptionalSlot(sdn.textTagline, props.textTagline, props.seldonRefs),
)
const frame10Props = computed(() => mergeSlot(sdn.frame10, props.frame10, props.seldonRefs))
const frame11Props = computed(() => mergeSlot(sdn.frame11, props.frame11, props.seldonRefs))
const textLabel8Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel8, props.textLabel8, props.seldonRefs),
)
const textLabel9Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel9, props.textLabel9, props.seldonRefs),
)
const frame12Props = computed(() => mergeSlot(sdn.frame12, props.frame12, props.seldonRefs))
const textCalloutProps = computed(() =>
  mergeOptionalSlot(sdn.textCallout, props.textCallout, props.seldonRefs),
)
const frame13Props = computed(() => mergeSlot(sdn.frame13, props.frame13, props.seldonRefs))
const frame14Props = computed(() => mergeSlot(sdn.frame14, props.frame14, props.seldonRefs))
const textLabel10Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel10, props.textLabel10, props.seldonRefs),
)
const textLabel11Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel11, props.textLabel11, props.seldonRefs),
)
const frame15Props = computed(() => mergeSlot(sdn.frame15, props.frame15, props.seldonRefs))
const textSubtitleProps = computed(() =>
  mergeOptionalSlot(sdn.textSubtitle, props.textSubtitle, props.seldonRefs),
)
const frame16Props = computed(() => mergeSlot(sdn.frame16, props.frame16, props.seldonRefs))
const frame17Props = computed(() => mergeSlot(sdn.frame17, props.frame17, props.seldonRefs))
const textLabel12Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel12, props.textLabel12, props.seldonRefs),
)
const textLabel13Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel13, props.textLabel13, props.seldonRefs),
)
const frame18Props = computed(() => mergeSlot(sdn.frame18, props.frame18, props.seldonRefs))
const textTitleProps = computed(() =>
  mergeOptionalSlot(sdn.textTitle, props.textTitle, props.seldonRefs),
)
const frame19Props = computed(() => mergeSlot(sdn.frame19, props.frame19, props.seldonRefs))
const frame20Props = computed(() => mergeSlot(sdn.frame20, props.frame20, props.seldonRefs))
const textLabel14Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel14, props.textLabel14, props.seldonRefs),
)
const textLabel15Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel15, props.textLabel15, props.seldonRefs),
)
const frame21Props = computed(() => mergeSlot(sdn.frame21, props.frame21, props.seldonRefs))
const textSubheadingProps = computed(() =>
  mergeOptionalSlot(sdn.textSubheading, props.textSubheading, props.seldonRefs),
)
const frame22Props = computed(() => mergeSlot(sdn.frame22, props.frame22, props.seldonRefs))
const frame23Props = computed(() => mergeSlot(sdn.frame23, props.frame23, props.seldonRefs))
const textLabel16Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel16, props.textLabel16, props.seldonRefs),
)
const textLabel17Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel17, props.textLabel17, props.seldonRefs),
)
const frame24Props = computed(() => mergeSlot(sdn.frame24, props.frame24, props.seldonRefs))
const textHeadingProps = computed(() =>
  mergeOptionalSlot(sdn.textHeading, props.textHeading, props.seldonRefs),
)
const frame25Props = computed(() => mergeSlot(sdn.frame25, props.frame25, props.seldonRefs))
const frame26Props = computed(() => mergeSlot(sdn.frame26, props.frame26, props.seldonRefs))
const textLabel18Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel18, props.textLabel18, props.seldonRefs),
)
const textLabel19Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel19, props.textLabel19, props.seldonRefs),
)
const frame27Props = computed(() => mergeSlot(sdn.frame27, props.frame27, props.seldonRefs))
const textDisplayProps = computed(() =>
  mergeOptionalSlot(sdn.textDisplay, props.textDisplay, props.seldonRefs),
)
</script>

<template>
  <div :class="rootClassName" v-bind="rootAttrs">
    <slot>
      <Frame v-bind="frameProps">
        <Frame v-bind="frame2Props" v-if="frame2Props !== null">
          <TextLabel v-if="textLabelProps !== null" v-bind="textLabelProps" />
          <TextLabel v-if="textLabel2Props !== null" v-bind="textLabel2Props" />
        </Frame>
        <Frame v-bind="frame3Props" v-if="frame3Props !== null">
          <TextDescription v-if="textDescriptionProps !== null" v-bind="textDescriptionProps" />
        </Frame>
      </Frame>
      <Frame v-bind="frame4Props">
        <Frame v-bind="frame5Props" v-if="frame5Props !== null">
          <TextLabel v-if="textLabel3Props !== null" v-bind="textLabel3Props" />
          <TextLabel v-if="textLabel4Props !== null" v-bind="textLabel4Props" />
        </Frame>
        <Frame v-bind="frame6Props" v-if="frame6Props !== null">
          <TextLabel v-if="textLabel5Props !== null" v-bind="textLabel5Props" />
        </Frame>
      </Frame>
      <Frame v-bind="frame7Props">
        <Frame v-bind="frame8Props" v-if="frame8Props !== null">
          <TextLabel v-if="textLabel6Props !== null" v-bind="textLabel6Props" />
          <TextLabel v-if="textLabel7Props !== null" v-bind="textLabel7Props" />
        </Frame>
        <Frame v-bind="frame9Props" v-if="frame9Props !== null">
          <TextTagline v-if="textTaglineProps !== null" v-bind="textTaglineProps" />
        </Frame>
      </Frame>
      <Frame v-bind="frame10Props">
        <Frame v-bind="frame11Props" v-if="frame11Props !== null">
          <TextLabel v-if="textLabel8Props !== null" v-bind="textLabel8Props" />
          <TextLabel v-if="textLabel9Props !== null" v-bind="textLabel9Props" />
        </Frame>
        <Frame v-bind="frame12Props" v-if="frame12Props !== null">
          <TextCallout v-if="textCalloutProps !== null" v-bind="textCalloutProps" />
        </Frame>
      </Frame>
      <Frame v-bind="frame13Props">
        <Frame v-bind="frame14Props" v-if="frame14Props !== null">
          <TextLabel v-if="textLabel10Props !== null" v-bind="textLabel10Props" />
          <TextLabel v-if="textLabel11Props !== null" v-bind="textLabel11Props" />
        </Frame>
        <Frame v-bind="frame15Props" v-if="frame15Props !== null">
          <TextSubtitle v-if="textSubtitleProps !== null" v-bind="textSubtitleProps" />
        </Frame>
      </Frame>
      <Frame v-bind="frame16Props">
        <Frame v-bind="frame17Props" v-if="frame17Props !== null">
          <TextLabel v-if="textLabel12Props !== null" v-bind="textLabel12Props" />
          <TextLabel v-if="textLabel13Props !== null" v-bind="textLabel13Props" />
        </Frame>
        <Frame v-bind="frame18Props" v-if="frame18Props !== null">
          <TextTitle v-if="textTitleProps !== null" v-bind="textTitleProps" />
        </Frame>
      </Frame>
      <Frame v-bind="frame19Props">
        <Frame v-bind="frame20Props" v-if="frame20Props !== null">
          <TextLabel v-if="textLabel14Props !== null" v-bind="textLabel14Props" />
          <TextLabel v-if="textLabel15Props !== null" v-bind="textLabel15Props" />
        </Frame>
        <Frame v-bind="frame21Props" v-if="frame21Props !== null">
          <TextSubheading v-if="textSubheadingProps !== null" v-bind="textSubheadingProps" />
        </Frame>
      </Frame>
      <Frame v-bind="frame22Props">
        <Frame v-bind="frame23Props" v-if="frame23Props !== null">
          <TextLabel v-if="textLabel16Props !== null" v-bind="textLabel16Props" />
          <TextLabel v-if="textLabel17Props !== null" v-bind="textLabel17Props" />
        </Frame>
        <Frame v-bind="frame24Props" v-if="frame24Props !== null">
          <TextHeading v-if="textHeadingProps !== null" v-bind="textHeadingProps" />
        </Frame>
      </Frame>
      <Frame v-bind="frame25Props">
        <Frame v-bind="frame26Props" v-if="frame26Props !== null">
          <TextLabel v-if="textLabel18Props !== null" v-bind="textLabel18Props" />
          <TextLabel v-if="textLabel19Props !== null" v-bind="textLabel19Props" />
        </Frame>
        <Frame v-bind="frame27Props" v-if="frame27Props !== null">
          <TextDisplay v-if="textDisplayProps !== null" v-bind="textDisplayProps" />
        </Frame>
      </Frame>
    </slot>
  </div>
</template>

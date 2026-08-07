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
import { TextDescription, TextDescriptionProps } from "../primitives/TextDescription"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface SpecimenSampleProps extends HTMLAttributes<HTMLElement> {
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
}

//
// Default property values
//
const sdn: SpecimenSampleProps = {
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
    className: "sdn-frame sdn-frame--vxea",
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
    "data-seldon-ref": "typeSpecimenFamilyWeights",
  },
  frame3: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--kpqc",
    "data-seldon-ref": "typeSpecimenGlyphs",
  },
  textDescription: {
    children: "IBM Plex San",
    htmlElement: "p",
    "aria-hidden": "false",
    className: "sdn-text-description sdn-text-description--tnd9",
    "data-seldon-ref": "typeSpecimenName",
  },
  textDescription2: {
    children: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    htmlElement: "p",
    "aria-hidden": "false",
    className: "sdn-text-description sdn-text-description--i3zd",
    "data-seldon-ref": "typeSpecimenUppercase",
  },
  textDescription3: {
    children: "abcdefghijklmnopqrstuvwxyz",
    htmlElement: "p",
    "aria-hidden": "false",
    className: "sdn-text-description sdn-text-description--i3zd",
    "data-seldon-ref": "typeSpecimenLowercase",
  },
  textDescription4: {
    children: "0123456789 ¿ ? ¡ ! &amp; @ ‘ ’ “ ” « » % * ^ # $ £ € ¢ / ( ) [ ] { } . , ® ©",
    htmlElement: "p",
    "aria-hidden": "false",
    className: "sdn-text-description sdn-text-description--i3zd",
    "data-seldon-ref": "typeSpecimenNumbers",
  },

  hr: {
    "aria-hidden": "false",
    className: "sdn-hr sdn-hr--p83j",
  },
}

/**
 * Part: SpecimenSample
 * Level: Part
 * Intent: Various samples and pieces for building specimen components
 * Tags:
 * Type: Inline
 *
 * Structure:
 *   Frame                frame             -> typeSpecimenPreview
 *     Frame              frame2            -> typeSpecimenFamily
 *       TextLabel        textLabel         -> typeSpecimenFamilyLabel
 *       TextLabel        textLabel2        -> typeSpecimenFamilyWeights
 *     Frame              frame3            -> typeSpecimenGlyphs
 *       TextDescription  textDescription   -> typeSpecimenName
 *       TextDescription  textDescription2  -> typeSpecimenUppercase
 *       TextDescription  textDescription3  -> typeSpecimenLowercase
 *       TextDescription  textDescription4  -> typeSpecimenNumbers
 *   Hr                   hr
 *
 * @example
 * ```tsx
 * <SpecimenSample
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
 * />
 * ```
 */
export function SpecimenSample({
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

  children,
  seldonRefs,
  ...props
}: SpecimenSampleProps) {
  const specimenSampleClassName = combineClassNames("sdn-specimen", className)

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

  return (
    <HTMLDiv className={specimenSampleClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
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
        </>
      )}
    </HTMLDiv>
  )
}

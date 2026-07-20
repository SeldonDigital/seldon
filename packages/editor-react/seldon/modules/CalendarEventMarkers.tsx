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

import { ButtonIconic, ButtonIconicProps } from "../elements/ButtonIconic"
import { CalendarDay, CalendarDayProps } from "../elements/CalendarDay"
import {
  CalendarDayMuted,
  CalendarDayMutedProps,
} from "../elements/CalendarDayMuted"
import {
  CalendarDaySelected,
  CalendarDaySelectedProps,
} from "../elements/CalendarDaySelected"
import { Container, ContainerProps } from "../frames/Container"
import { Frame, FrameProps } from "../frames/Frame"
import { IconProps } from "../primitives/Icon"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { applyRef } from "../utils/apply-ref"
import { combineClassNames } from "../utils/class-name"

export interface CalendarEventMarkersProps extends HTMLAttributes<HTMLElement> {
  className?: string
  "data-seldon-ref"?: string
  seldonRefs?: Record<string, Record<string, unknown>>
  frame?: FrameProps | null
  textLabel?: TextLabelProps | null
  buttonIconic?: ButtonIconicProps | null
  icon?: IconProps | null
  buttonIconic2?: ButtonIconicProps | null
  icon2?: IconProps | null
  container?: ContainerProps | null
  textLabel2?: TextLabelProps | null
  textLabel3?: TextLabelProps | null
  textLabel4?: TextLabelProps | null
  textLabel5?: TextLabelProps | null
  textLabel6?: TextLabelProps | null
  textLabel7?: TextLabelProps | null
  textLabel8?: TextLabelProps | null
  frame2?: FrameProps | null
  container2?: ContainerProps | null
  calendarDayMuted?: CalendarDayMutedProps | null
  textLabel9?: TextLabelProps | null
  calendarDaySelected?: CalendarDaySelectedProps | null
  textLabel10?: TextLabelProps | null
  textLabel11?: TextLabelProps | null
  calendarDay?: CalendarDayProps | null
  textLabel12?: TextLabelProps | null
  calendarDay2?: CalendarDayProps | null
  textLabel13?: TextLabelProps | null
  calendarDay3?: CalendarDayProps | null
  textLabel14?: TextLabelProps | null
  calendarDay4?: CalendarDayProps | null
  textLabel15?: TextLabelProps | null
  calendarDayMuted2?: CalendarDayMutedProps | null
  textLabel16?: TextLabelProps | null
  container3?: ContainerProps | null
  calendarDayMuted3?: CalendarDayMutedProps | null
  textLabel17?: TextLabelProps | null
  calendarDayMuted4?: CalendarDayMutedProps | null
  textLabel18?: TextLabelProps | null
  calendarDayMuted5?: CalendarDayMutedProps | null
  textLabel19?: TextLabelProps | null
  calendarDayMuted6?: CalendarDayMutedProps | null
  textLabel20?: TextLabelProps | null
  calendarDayMuted7?: CalendarDayMutedProps | null
  textLabel21?: TextLabelProps | null
  calendarDayMuted8?: CalendarDayMutedProps | null
  textLabel22?: TextLabelProps | null
  calendarDayMuted9?: CalendarDayMutedProps | null
  textLabel23?: TextLabelProps | null
  container4?: ContainerProps | null
  calendarDayMuted10?: CalendarDayMutedProps | null
  textLabel24?: TextLabelProps | null
  calendarDayMuted11?: CalendarDayMutedProps | null
  textLabel25?: TextLabelProps | null
  calendarDayMuted12?: CalendarDayMutedProps | null
  textLabel26?: TextLabelProps | null
  calendarDayMuted13?: CalendarDayMutedProps | null
  textLabel27?: TextLabelProps | null
  calendarDayMuted14?: CalendarDayMutedProps | null
  textLabel28?: TextLabelProps | null
  calendarDayMuted15?: CalendarDayMutedProps | null
  textLabel29?: TextLabelProps | null
  calendarDayMuted16?: CalendarDayMutedProps | null
  textLabel30?: TextLabelProps | null
  container5?: ContainerProps | null
  calendarDayMuted17?: CalendarDayMutedProps | null
  textLabel31?: TextLabelProps | null
  calendarDayMuted18?: CalendarDayMutedProps | null
  textLabel32?: TextLabelProps | null
  calendarDayMuted19?: CalendarDayMutedProps | null
  textLabel33?: TextLabelProps | null
  calendarDayMuted20?: CalendarDayMutedProps | null
  textLabel34?: TextLabelProps | null
  calendarDayMuted21?: CalendarDayMutedProps | null
  textLabel35?: TextLabelProps | null
  calendarDayMuted22?: CalendarDayMutedProps | null
  textLabel36?: TextLabelProps | null
  calendarDayMuted23?: CalendarDayMutedProps | null
  textLabel37?: TextLabelProps | null
  container6?: ContainerProps | null
  calendarDayMuted24?: CalendarDayMutedProps | null
  textLabel38?: TextLabelProps | null
  calendarDayMuted25?: CalendarDayMutedProps | null
  textLabel39?: TextLabelProps | null
  calendarDay5?: CalendarDayProps | null
  textLabel40?: TextLabelProps | null
}

/*****
 * Calendar: CalendarEventMarkers
 * Level: Module
 * Intent: Month calendar with a navigable header, weekday labels, and a day grid. The default shows a single bordered month; variants cover a two-month range picker and a single month with event markers.
 * Tags: calendar, ui, month, date, navigation, selection, range, events
 * Type: Inline
 *
 * @example
 * ```tsx
 * <CalendarEventMarkers
 *   aria-hidden="false"
 *   frame="{}"
 *   textLabel="{}"
 *   buttonIconic={() => {}}
 *   icon="material-star"
 *   buttonIconic2={() => {}}
 *   container="{}"
 *   textLabel2="{}"
 *   textLabel3="{}"
 *   textLabel4="{}"
 *   textLabel5="{}"
 *   textLabel6="{}"
 *   textLabel7="{}"
 *   frame2="{}"
 *   calendarDayMuted="{}"
 *   calendarDaySelected2="{}"
 *   calendarDay3="{}"
 *   calendarDay4="{}"
 *   calendarDay5="{}"
 *   calendarDay6="{}"
 *   calendarDayMuted7="{}"
 *   container2="{}"
 *   calendarDayMuted2="{}"
 *   calendarDayMuted3="{}"
 *   calendarDayMuted4="{}"
 *   calendarDayMuted5="{}"
 *   calendarDayMuted6="{}"
 *   container3="{}"
 *   container4="{}"
 *   container5="{}"
 * />
 * ```
 *****/
export function CalendarEventMarkers({
  className = "",
  frame = sdn.frame,
  textLabel,
  buttonIconic,
  icon = sdn.icon,
  buttonIconic2,
  icon2 = sdn.icon2,
  container = sdn.container,
  textLabel2,
  textLabel3,
  textLabel4,
  textLabel5,
  textLabel6,
  textLabel7,
  textLabel8,
  frame2 = sdn.frame2,
  container2 = sdn.container2,
  calendarDayMuted,
  textLabel9,
  calendarDaySelected,
  textLabel10,
  textLabel11,
  calendarDay,
  textLabel12,
  calendarDay2,
  textLabel13,
  calendarDay3,
  textLabel14,
  calendarDay4,
  textLabel15,
  calendarDayMuted2,
  textLabel16,
  container3 = sdn.container3,
  calendarDayMuted3,
  textLabel17,
  calendarDayMuted4,
  textLabel18,
  calendarDayMuted5,
  textLabel19,
  calendarDayMuted6,
  textLabel20,
  calendarDayMuted7,
  textLabel21,
  calendarDayMuted8,
  textLabel22,
  calendarDayMuted9,
  textLabel23,
  container4 = sdn.container4,
  calendarDayMuted10,
  textLabel24,
  calendarDayMuted11,
  textLabel25,
  calendarDayMuted12,
  textLabel26,
  calendarDayMuted13,
  textLabel27,
  calendarDayMuted14,
  textLabel28,
  calendarDayMuted15,
  textLabel29,
  calendarDayMuted16,
  textLabel30,
  container5 = sdn.container5,
  calendarDayMuted17,
  textLabel31,
  calendarDayMuted18,
  textLabel32,
  calendarDayMuted19,
  textLabel33,
  calendarDayMuted20,
  textLabel34,
  calendarDayMuted21,
  textLabel35,
  calendarDayMuted22,
  textLabel36,
  calendarDayMuted23,
  textLabel37,
  container6 = sdn.container6,
  calendarDayMuted24,
  textLabel38,
  calendarDayMuted25,
  textLabel39,
  calendarDay5,
  textLabel40,
  children,
  seldonRefs,
  ...props
}: CalendarEventMarkersProps) {
  const calendarEventMarkersClassName = combineClassNames(
    "sdn-calendar",
    className,
  )
  const frameProps = applyRef(
    seldonRefs,
    frame === null
      ? null
      : {
          ...sdn.frame,
          ...frame,
          className: combineClassNames(sdn.frame?.className, frame?.className),
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
  const buttonIconicProps = applyRef(
    seldonRefs,
    buttonIconic === null
      ? null
      : {
          ...sdn.buttonIconic,
          ...buttonIconic,
          className: combineClassNames(
            sdn.buttonIconic?.className,
            buttonIconic?.className,
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
  const buttonIconic2Props = applyRef(
    seldonRefs,
    buttonIconic2 === null
      ? null
      : {
          ...sdn.buttonIconic2,
          ...buttonIconic2,
          className: combineClassNames(
            sdn.buttonIconic2?.className,
            buttonIconic2?.className,
          ),
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
  const containerProps = applyRef(
    seldonRefs,
    container === null
      ? null
      : {
          ...sdn.container,
          ...container,
          className: combineClassNames(
            sdn.container?.className,
            container?.className,
          ),
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
  const textLabel5Props = applyRef(
    seldonRefs,
    textLabel5 === null
      ? null
      : {
          ...sdn.textLabel5,
          ...textLabel5,
          className: combineClassNames(
            sdn.textLabel5?.className,
            textLabel5?.className,
          ),
        },
  )
  const textLabel6Props = applyRef(
    seldonRefs,
    textLabel6 === null
      ? null
      : {
          ...sdn.textLabel6,
          ...textLabel6,
          className: combineClassNames(
            sdn.textLabel6?.className,
            textLabel6?.className,
          ),
        },
  )
  const textLabel7Props = applyRef(
    seldonRefs,
    textLabel7 === null
      ? null
      : {
          ...sdn.textLabel7,
          ...textLabel7,
          className: combineClassNames(
            sdn.textLabel7?.className,
            textLabel7?.className,
          ),
        },
  )
  const textLabel8Props = applyRef(
    seldonRefs,
    textLabel8 === null
      ? null
      : {
          ...sdn.textLabel8,
          ...textLabel8,
          className: combineClassNames(
            sdn.textLabel8?.className,
            textLabel8?.className,
          ),
        },
  )
  const frame2Props = applyRef(
    seldonRefs,
    frame2 === null
      ? null
      : {
          ...sdn.frame2,
          ...frame2,
          className: combineClassNames(
            sdn.frame2?.className,
            frame2?.className,
          ),
        },
  )
  const container2Props = applyRef(
    seldonRefs,
    container2 === null
      ? null
      : {
          ...sdn.container2,
          ...container2,
          className: combineClassNames(
            sdn.container2?.className,
            container2?.className,
          ),
        },
  )
  const calendarDayMutedProps = applyRef(
    seldonRefs,
    calendarDayMuted === null
      ? null
      : {
          ...sdn.calendarDayMuted,
          ...calendarDayMuted,
          className: combineClassNames(
            sdn.calendarDayMuted?.className,
            calendarDayMuted?.className,
          ),
        },
  )
  const textLabel9Props = applyRef(
    seldonRefs,
    textLabel9 === null
      ? null
      : {
          ...sdn.textLabel9,
          ...textLabel9,
          className: combineClassNames(
            sdn.textLabel9?.className,
            textLabel9?.className,
          ),
        },
  )
  const calendarDaySelectedProps = applyRef(
    seldonRefs,
    calendarDaySelected === null
      ? null
      : {
          ...sdn.calendarDaySelected,
          ...calendarDaySelected,
          className: combineClassNames(
            sdn.calendarDaySelected?.className,
            calendarDaySelected?.className,
          ),
        },
  )
  const textLabel10Props = applyRef(
    seldonRefs,
    textLabel10 === null
      ? null
      : {
          ...sdn.textLabel10,
          ...textLabel10,
          className: combineClassNames(
            sdn.textLabel10?.className,
            textLabel10?.className,
          ),
        },
  )
  const textLabel11Props = applyRef(
    seldonRefs,
    textLabel11 === null
      ? null
      : {
          ...sdn.textLabel11,
          ...textLabel11,
          className: combineClassNames(
            sdn.textLabel11?.className,
            textLabel11?.className,
          ),
        },
  )
  const calendarDayProps = applyRef(
    seldonRefs,
    calendarDay === null
      ? null
      : {
          ...sdn.calendarDay,
          ...calendarDay,
          className: combineClassNames(
            sdn.calendarDay?.className,
            calendarDay?.className,
          ),
        },
  )
  const textLabel12Props = applyRef(
    seldonRefs,
    textLabel12 === null
      ? null
      : {
          ...sdn.textLabel12,
          ...textLabel12,
          className: combineClassNames(
            sdn.textLabel12?.className,
            textLabel12?.className,
          ),
        },
  )
  const calendarDay2Props = applyRef(
    seldonRefs,
    calendarDay2 === null
      ? null
      : {
          ...sdn.calendarDay2,
          ...calendarDay2,
          className: combineClassNames(
            sdn.calendarDay2?.className,
            calendarDay2?.className,
          ),
        },
  )
  const textLabel13Props = applyRef(
    seldonRefs,
    textLabel13 === null
      ? null
      : {
          ...sdn.textLabel13,
          ...textLabel13,
          className: combineClassNames(
            sdn.textLabel13?.className,
            textLabel13?.className,
          ),
        },
  )
  const calendarDay3Props = applyRef(
    seldonRefs,
    calendarDay3 === null
      ? null
      : {
          ...sdn.calendarDay3,
          ...calendarDay3,
          className: combineClassNames(
            sdn.calendarDay3?.className,
            calendarDay3?.className,
          ),
        },
  )
  const textLabel14Props = applyRef(
    seldonRefs,
    textLabel14 === null
      ? null
      : {
          ...sdn.textLabel14,
          ...textLabel14,
          className: combineClassNames(
            sdn.textLabel14?.className,
            textLabel14?.className,
          ),
        },
  )
  const calendarDay4Props = applyRef(
    seldonRefs,
    calendarDay4 === null
      ? null
      : {
          ...sdn.calendarDay4,
          ...calendarDay4,
          className: combineClassNames(
            sdn.calendarDay4?.className,
            calendarDay4?.className,
          ),
        },
  )
  const textLabel15Props = applyRef(
    seldonRefs,
    textLabel15 === null
      ? null
      : {
          ...sdn.textLabel15,
          ...textLabel15,
          className: combineClassNames(
            sdn.textLabel15?.className,
            textLabel15?.className,
          ),
        },
  )
  const calendarDayMuted2Props = applyRef(
    seldonRefs,
    calendarDayMuted2 === null
      ? null
      : {
          ...sdn.calendarDayMuted2,
          ...calendarDayMuted2,
          className: combineClassNames(
            sdn.calendarDayMuted2?.className,
            calendarDayMuted2?.className,
          ),
        },
  )
  const textLabel16Props = applyRef(
    seldonRefs,
    textLabel16 === null
      ? null
      : {
          ...sdn.textLabel16,
          ...textLabel16,
          className: combineClassNames(
            sdn.textLabel16?.className,
            textLabel16?.className,
          ),
        },
  )
  const container3Props = applyRef(
    seldonRefs,
    container3 === null
      ? null
      : {
          ...sdn.container3,
          ...container3,
          className: combineClassNames(
            sdn.container3?.className,
            container3?.className,
          ),
        },
  )
  const calendarDayMuted3Props = applyRef(
    seldonRefs,
    calendarDayMuted3 === null
      ? null
      : {
          ...sdn.calendarDayMuted3,
          ...calendarDayMuted3,
          className: combineClassNames(
            sdn.calendarDayMuted3?.className,
            calendarDayMuted3?.className,
          ),
        },
  )
  const textLabel17Props = applyRef(
    seldonRefs,
    textLabel17 === null
      ? null
      : {
          ...sdn.textLabel17,
          ...textLabel17,
          className: combineClassNames(
            sdn.textLabel17?.className,
            textLabel17?.className,
          ),
        },
  )
  const calendarDayMuted4Props = applyRef(
    seldonRefs,
    calendarDayMuted4 === null
      ? null
      : {
          ...sdn.calendarDayMuted4,
          ...calendarDayMuted4,
          className: combineClassNames(
            sdn.calendarDayMuted4?.className,
            calendarDayMuted4?.className,
          ),
        },
  )
  const textLabel18Props = applyRef(
    seldonRefs,
    textLabel18 === null
      ? null
      : {
          ...sdn.textLabel18,
          ...textLabel18,
          className: combineClassNames(
            sdn.textLabel18?.className,
            textLabel18?.className,
          ),
        },
  )
  const calendarDayMuted5Props = applyRef(
    seldonRefs,
    calendarDayMuted5 === null
      ? null
      : {
          ...sdn.calendarDayMuted5,
          ...calendarDayMuted5,
          className: combineClassNames(
            sdn.calendarDayMuted5?.className,
            calendarDayMuted5?.className,
          ),
        },
  )
  const textLabel19Props = applyRef(
    seldonRefs,
    textLabel19 === null
      ? null
      : {
          ...sdn.textLabel19,
          ...textLabel19,
          className: combineClassNames(
            sdn.textLabel19?.className,
            textLabel19?.className,
          ),
        },
  )
  const calendarDayMuted6Props = applyRef(
    seldonRefs,
    calendarDayMuted6 === null
      ? null
      : {
          ...sdn.calendarDayMuted6,
          ...calendarDayMuted6,
          className: combineClassNames(
            sdn.calendarDayMuted6?.className,
            calendarDayMuted6?.className,
          ),
        },
  )
  const textLabel20Props = applyRef(
    seldonRefs,
    textLabel20 === null
      ? null
      : {
          ...sdn.textLabel20,
          ...textLabel20,
          className: combineClassNames(
            sdn.textLabel20?.className,
            textLabel20?.className,
          ),
        },
  )
  const calendarDayMuted7Props = applyRef(
    seldonRefs,
    calendarDayMuted7 === null
      ? null
      : {
          ...sdn.calendarDayMuted7,
          ...calendarDayMuted7,
          className: combineClassNames(
            sdn.calendarDayMuted7?.className,
            calendarDayMuted7?.className,
          ),
        },
  )
  const textLabel21Props = applyRef(
    seldonRefs,
    textLabel21 === null
      ? null
      : {
          ...sdn.textLabel21,
          ...textLabel21,
          className: combineClassNames(
            sdn.textLabel21?.className,
            textLabel21?.className,
          ),
        },
  )
  const calendarDayMuted8Props = applyRef(
    seldonRefs,
    calendarDayMuted8 === null
      ? null
      : {
          ...sdn.calendarDayMuted8,
          ...calendarDayMuted8,
          className: combineClassNames(
            sdn.calendarDayMuted8?.className,
            calendarDayMuted8?.className,
          ),
        },
  )
  const textLabel22Props = applyRef(
    seldonRefs,
    textLabel22 === null
      ? null
      : {
          ...sdn.textLabel22,
          ...textLabel22,
          className: combineClassNames(
            sdn.textLabel22?.className,
            textLabel22?.className,
          ),
        },
  )
  const calendarDayMuted9Props = applyRef(
    seldonRefs,
    calendarDayMuted9 === null
      ? null
      : {
          ...sdn.calendarDayMuted9,
          ...calendarDayMuted9,
          className: combineClassNames(
            sdn.calendarDayMuted9?.className,
            calendarDayMuted9?.className,
          ),
        },
  )
  const textLabel23Props = applyRef(
    seldonRefs,
    textLabel23 === null
      ? null
      : {
          ...sdn.textLabel23,
          ...textLabel23,
          className: combineClassNames(
            sdn.textLabel23?.className,
            textLabel23?.className,
          ),
        },
  )
  const container4Props = applyRef(
    seldonRefs,
    container4 === null
      ? null
      : {
          ...sdn.container4,
          ...container4,
          className: combineClassNames(
            sdn.container4?.className,
            container4?.className,
          ),
        },
  )
  const calendarDayMuted10Props = applyRef(
    seldonRefs,
    calendarDayMuted10 === null
      ? null
      : {
          ...sdn.calendarDayMuted10,
          ...calendarDayMuted10,
          className: combineClassNames(
            sdn.calendarDayMuted10?.className,
            calendarDayMuted10?.className,
          ),
        },
  )
  const textLabel24Props = applyRef(
    seldonRefs,
    textLabel24 === null
      ? null
      : {
          ...sdn.textLabel24,
          ...textLabel24,
          className: combineClassNames(
            sdn.textLabel24?.className,
            textLabel24?.className,
          ),
        },
  )
  const calendarDayMuted11Props = applyRef(
    seldonRefs,
    calendarDayMuted11 === null
      ? null
      : {
          ...sdn.calendarDayMuted11,
          ...calendarDayMuted11,
          className: combineClassNames(
            sdn.calendarDayMuted11?.className,
            calendarDayMuted11?.className,
          ),
        },
  )
  const textLabel25Props = applyRef(
    seldonRefs,
    textLabel25 === null
      ? null
      : {
          ...sdn.textLabel25,
          ...textLabel25,
          className: combineClassNames(
            sdn.textLabel25?.className,
            textLabel25?.className,
          ),
        },
  )
  const calendarDayMuted12Props = applyRef(
    seldonRefs,
    calendarDayMuted12 === null
      ? null
      : {
          ...sdn.calendarDayMuted12,
          ...calendarDayMuted12,
          className: combineClassNames(
            sdn.calendarDayMuted12?.className,
            calendarDayMuted12?.className,
          ),
        },
  )
  const textLabel26Props = applyRef(
    seldonRefs,
    textLabel26 === null
      ? null
      : {
          ...sdn.textLabel26,
          ...textLabel26,
          className: combineClassNames(
            sdn.textLabel26?.className,
            textLabel26?.className,
          ),
        },
  )
  const calendarDayMuted13Props = applyRef(
    seldonRefs,
    calendarDayMuted13 === null
      ? null
      : {
          ...sdn.calendarDayMuted13,
          ...calendarDayMuted13,
          className: combineClassNames(
            sdn.calendarDayMuted13?.className,
            calendarDayMuted13?.className,
          ),
        },
  )
  const textLabel27Props = applyRef(
    seldonRefs,
    textLabel27 === null
      ? null
      : {
          ...sdn.textLabel27,
          ...textLabel27,
          className: combineClassNames(
            sdn.textLabel27?.className,
            textLabel27?.className,
          ),
        },
  )
  const calendarDayMuted14Props = applyRef(
    seldonRefs,
    calendarDayMuted14 === null
      ? null
      : {
          ...sdn.calendarDayMuted14,
          ...calendarDayMuted14,
          className: combineClassNames(
            sdn.calendarDayMuted14?.className,
            calendarDayMuted14?.className,
          ),
        },
  )
  const textLabel28Props = applyRef(
    seldonRefs,
    textLabel28 === null
      ? null
      : {
          ...sdn.textLabel28,
          ...textLabel28,
          className: combineClassNames(
            sdn.textLabel28?.className,
            textLabel28?.className,
          ),
        },
  )
  const calendarDayMuted15Props = applyRef(
    seldonRefs,
    calendarDayMuted15 === null
      ? null
      : {
          ...sdn.calendarDayMuted15,
          ...calendarDayMuted15,
          className: combineClassNames(
            sdn.calendarDayMuted15?.className,
            calendarDayMuted15?.className,
          ),
        },
  )
  const textLabel29Props = applyRef(
    seldonRefs,
    textLabel29 === null
      ? null
      : {
          ...sdn.textLabel29,
          ...textLabel29,
          className: combineClassNames(
            sdn.textLabel29?.className,
            textLabel29?.className,
          ),
        },
  )
  const calendarDayMuted16Props = applyRef(
    seldonRefs,
    calendarDayMuted16 === null
      ? null
      : {
          ...sdn.calendarDayMuted16,
          ...calendarDayMuted16,
          className: combineClassNames(
            sdn.calendarDayMuted16?.className,
            calendarDayMuted16?.className,
          ),
        },
  )
  const textLabel30Props = applyRef(
    seldonRefs,
    textLabel30 === null
      ? null
      : {
          ...sdn.textLabel30,
          ...textLabel30,
          className: combineClassNames(
            sdn.textLabel30?.className,
            textLabel30?.className,
          ),
        },
  )
  const container5Props = applyRef(
    seldonRefs,
    container5 === null
      ? null
      : {
          ...sdn.container5,
          ...container5,
          className: combineClassNames(
            sdn.container5?.className,
            container5?.className,
          ),
        },
  )
  const calendarDayMuted17Props = applyRef(
    seldonRefs,
    calendarDayMuted17 === null
      ? null
      : {
          ...sdn.calendarDayMuted17,
          ...calendarDayMuted17,
          className: combineClassNames(
            sdn.calendarDayMuted17?.className,
            calendarDayMuted17?.className,
          ),
        },
  )
  const textLabel31Props = applyRef(
    seldonRefs,
    textLabel31 === null
      ? null
      : {
          ...sdn.textLabel31,
          ...textLabel31,
          className: combineClassNames(
            sdn.textLabel31?.className,
            textLabel31?.className,
          ),
        },
  )
  const calendarDayMuted18Props = applyRef(
    seldonRefs,
    calendarDayMuted18 === null
      ? null
      : {
          ...sdn.calendarDayMuted18,
          ...calendarDayMuted18,
          className: combineClassNames(
            sdn.calendarDayMuted18?.className,
            calendarDayMuted18?.className,
          ),
        },
  )
  const textLabel32Props = applyRef(
    seldonRefs,
    textLabel32 === null
      ? null
      : {
          ...sdn.textLabel32,
          ...textLabel32,
          className: combineClassNames(
            sdn.textLabel32?.className,
            textLabel32?.className,
          ),
        },
  )
  const calendarDayMuted19Props = applyRef(
    seldonRefs,
    calendarDayMuted19 === null
      ? null
      : {
          ...sdn.calendarDayMuted19,
          ...calendarDayMuted19,
          className: combineClassNames(
            sdn.calendarDayMuted19?.className,
            calendarDayMuted19?.className,
          ),
        },
  )
  const textLabel33Props = applyRef(
    seldonRefs,
    textLabel33 === null
      ? null
      : {
          ...sdn.textLabel33,
          ...textLabel33,
          className: combineClassNames(
            sdn.textLabel33?.className,
            textLabel33?.className,
          ),
        },
  )
  const calendarDayMuted20Props = applyRef(
    seldonRefs,
    calendarDayMuted20 === null
      ? null
      : {
          ...sdn.calendarDayMuted20,
          ...calendarDayMuted20,
          className: combineClassNames(
            sdn.calendarDayMuted20?.className,
            calendarDayMuted20?.className,
          ),
        },
  )
  const textLabel34Props = applyRef(
    seldonRefs,
    textLabel34 === null
      ? null
      : {
          ...sdn.textLabel34,
          ...textLabel34,
          className: combineClassNames(
            sdn.textLabel34?.className,
            textLabel34?.className,
          ),
        },
  )
  const calendarDayMuted21Props = applyRef(
    seldonRefs,
    calendarDayMuted21 === null
      ? null
      : {
          ...sdn.calendarDayMuted21,
          ...calendarDayMuted21,
          className: combineClassNames(
            sdn.calendarDayMuted21?.className,
            calendarDayMuted21?.className,
          ),
        },
  )
  const textLabel35Props = applyRef(
    seldonRefs,
    textLabel35 === null
      ? null
      : {
          ...sdn.textLabel35,
          ...textLabel35,
          className: combineClassNames(
            sdn.textLabel35?.className,
            textLabel35?.className,
          ),
        },
  )
  const calendarDayMuted22Props = applyRef(
    seldonRefs,
    calendarDayMuted22 === null
      ? null
      : {
          ...sdn.calendarDayMuted22,
          ...calendarDayMuted22,
          className: combineClassNames(
            sdn.calendarDayMuted22?.className,
            calendarDayMuted22?.className,
          ),
        },
  )
  const textLabel36Props = applyRef(
    seldonRefs,
    textLabel36 === null
      ? null
      : {
          ...sdn.textLabel36,
          ...textLabel36,
          className: combineClassNames(
            sdn.textLabel36?.className,
            textLabel36?.className,
          ),
        },
  )
  const calendarDayMuted23Props = applyRef(
    seldonRefs,
    calendarDayMuted23 === null
      ? null
      : {
          ...sdn.calendarDayMuted23,
          ...calendarDayMuted23,
          className: combineClassNames(
            sdn.calendarDayMuted23?.className,
            calendarDayMuted23?.className,
          ),
        },
  )
  const textLabel37Props = applyRef(
    seldonRefs,
    textLabel37 === null
      ? null
      : {
          ...sdn.textLabel37,
          ...textLabel37,
          className: combineClassNames(
            sdn.textLabel37?.className,
            textLabel37?.className,
          ),
        },
  )
  const container6Props = applyRef(
    seldonRefs,
    container6 === null
      ? null
      : {
          ...sdn.container6,
          ...container6,
          className: combineClassNames(
            sdn.container6?.className,
            container6?.className,
          ),
        },
  )
  const calendarDayMuted24Props = applyRef(
    seldonRefs,
    calendarDayMuted24 === null
      ? null
      : {
          ...sdn.calendarDayMuted24,
          ...calendarDayMuted24,
          className: combineClassNames(
            sdn.calendarDayMuted24?.className,
            calendarDayMuted24?.className,
          ),
        },
  )
  const textLabel38Props = applyRef(
    seldonRefs,
    textLabel38 === null
      ? null
      : {
          ...sdn.textLabel38,
          ...textLabel38,
          className: combineClassNames(
            sdn.textLabel38?.className,
            textLabel38?.className,
          ),
        },
  )
  const calendarDayMuted25Props = applyRef(
    seldonRefs,
    calendarDayMuted25 === null
      ? null
      : {
          ...sdn.calendarDayMuted25,
          ...calendarDayMuted25,
          className: combineClassNames(
            sdn.calendarDayMuted25?.className,
            calendarDayMuted25?.className,
          ),
        },
  )
  const textLabel39Props = applyRef(
    seldonRefs,
    textLabel39 === null
      ? null
      : {
          ...sdn.textLabel39,
          ...textLabel39,
          className: combineClassNames(
            sdn.textLabel39?.className,
            textLabel39?.className,
          ),
        },
  )
  const calendarDay5Props = applyRef(
    seldonRefs,
    calendarDay5 === null
      ? null
      : {
          ...sdn.calendarDay5,
          ...calendarDay5,
          className: combineClassNames(
            sdn.calendarDay5?.className,
            calendarDay5?.className,
          ),
        },
  )
  const textLabel40Props = applyRef(
    seldonRefs,
    textLabel40 === null
      ? null
      : {
          ...sdn.textLabel40,
          ...textLabel40,
          className: combineClassNames(
            sdn.textLabel40?.className,
            textLabel40?.className,
          ),
        },
  )

  return (
    <Frame
      className={calendarEventMarkersClassName}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    >
      {children !== undefined ? (
        children
      ) : (
        <>
          <Frame {...frameProps}>
            {textLabel && textLabelProps && <TextLabel {...textLabelProps} />}
            {buttonIconic && buttonIconicProps && (
              <ButtonIconic {...buttonIconicProps} icon={iconProps} />
            )}
            {buttonIconic2 && buttonIconic2Props && (
              <ButtonIconic {...buttonIconic2Props} icon={icon2Props} />
            )}
          </Frame>
          <Frame {...containerProps}>
            {textLabel2 && textLabel2Props && (
              <TextLabel {...textLabel2Props} />
            )}
            {textLabel3 && textLabel3Props && (
              <TextLabel {...textLabel3Props} />
            )}
            {textLabel4 && textLabel4Props && (
              <TextLabel {...textLabel4Props} />
            )}
            {textLabel5 && textLabel5Props && (
              <TextLabel {...textLabel5Props} />
            )}
            {textLabel6 && textLabel6Props && (
              <TextLabel {...textLabel6Props} />
            )}
            {textLabel7 && textLabel7Props && (
              <TextLabel {...textLabel7Props} />
            )}
            {textLabel8 && textLabel8Props && (
              <TextLabel {...textLabel8Props} />
            )}
          </Frame>
          <Frame {...frame2Props}>
            <Frame {...container2Props}>
              {calendarDayMuted && calendarDayMutedProps && (
                <CalendarDayMuted {...calendarDayMutedProps}>
                  {textLabel9 && textLabel9Props && (
                    <TextLabel {...textLabel9Props} />
                  )}
                </CalendarDayMuted>
              )}
              {calendarDaySelected && calendarDaySelectedProps && (
                <CalendarDaySelected {...calendarDaySelectedProps}>
                  {textLabel10 && textLabel10Props && (
                    <TextLabel {...textLabel10Props} />
                  )}
                  {textLabel11 && textLabel11Props && (
                    <TextLabel {...textLabel11Props} />
                  )}
                </CalendarDaySelected>
              )}
              {calendarDay && calendarDayProps && (
                <CalendarDay {...calendarDayProps}>
                  {textLabel12 && textLabel12Props && (
                    <TextLabel {...textLabel12Props} />
                  )}
                </CalendarDay>
              )}
              {calendarDay2 && calendarDay2Props && (
                <CalendarDay {...calendarDay2Props}>
                  {textLabel13 && textLabel13Props && (
                    <TextLabel {...textLabel13Props} />
                  )}
                </CalendarDay>
              )}
              {calendarDay3 && calendarDay3Props && (
                <CalendarDay {...calendarDay3Props}>
                  {textLabel14 && textLabel14Props && (
                    <TextLabel {...textLabel14Props} />
                  )}
                </CalendarDay>
              )}
              {calendarDay4 && calendarDay4Props && (
                <CalendarDay {...calendarDay4Props}>
                  {textLabel15 && textLabel15Props && (
                    <TextLabel {...textLabel15Props} />
                  )}
                </CalendarDay>
              )}
              {calendarDayMuted2 && calendarDayMuted2Props && (
                <CalendarDayMuted {...calendarDayMuted2Props}>
                  {textLabel16 && textLabel16Props && (
                    <TextLabel {...textLabel16Props} />
                  )}
                </CalendarDayMuted>
              )}
            </Frame>
            <Frame {...container3Props}>
              {calendarDayMuted3 && calendarDayMuted3Props && (
                <CalendarDayMuted {...calendarDayMuted3Props}>
                  {textLabel17 && textLabel17Props && (
                    <TextLabel {...textLabel17Props} />
                  )}
                </CalendarDayMuted>
              )}
              {calendarDayMuted4 && calendarDayMuted4Props && (
                <CalendarDayMuted {...calendarDayMuted4Props}>
                  {textLabel18 && textLabel18Props && (
                    <TextLabel {...textLabel18Props} />
                  )}
                </CalendarDayMuted>
              )}
              {calendarDayMuted5 && calendarDayMuted5Props && (
                <CalendarDayMuted {...calendarDayMuted5Props}>
                  {textLabel19 && textLabel19Props && (
                    <TextLabel {...textLabel19Props} />
                  )}
                </CalendarDayMuted>
              )}
              {calendarDayMuted6 && calendarDayMuted6Props && (
                <CalendarDayMuted {...calendarDayMuted6Props}>
                  {textLabel20 && textLabel20Props && (
                    <TextLabel {...textLabel20Props} />
                  )}
                </CalendarDayMuted>
              )}
              {calendarDayMuted7 && calendarDayMuted7Props && (
                <CalendarDayMuted {...calendarDayMuted7Props}>
                  {textLabel21 && textLabel21Props && (
                    <TextLabel {...textLabel21Props} />
                  )}
                </CalendarDayMuted>
              )}
              {calendarDayMuted8 && calendarDayMuted8Props && (
                <CalendarDayMuted {...calendarDayMuted8Props}>
                  {textLabel22 && textLabel22Props && (
                    <TextLabel {...textLabel22Props} />
                  )}
                </CalendarDayMuted>
              )}
              {calendarDayMuted9 && calendarDayMuted9Props && (
                <CalendarDayMuted {...calendarDayMuted9Props}>
                  {textLabel23 && textLabel23Props && (
                    <TextLabel {...textLabel23Props} />
                  )}
                </CalendarDayMuted>
              )}
            </Frame>
            <Frame {...container4Props}>
              {calendarDayMuted10 && calendarDayMuted10Props && (
                <CalendarDayMuted {...calendarDayMuted10Props}>
                  {textLabel24 && textLabel24Props && (
                    <TextLabel {...textLabel24Props} />
                  )}
                </CalendarDayMuted>
              )}
              {calendarDayMuted11 && calendarDayMuted11Props && (
                <CalendarDayMuted {...calendarDayMuted11Props}>
                  {textLabel25 && textLabel25Props && (
                    <TextLabel {...textLabel25Props} />
                  )}
                </CalendarDayMuted>
              )}
              {calendarDayMuted12 && calendarDayMuted12Props && (
                <CalendarDayMuted {...calendarDayMuted12Props}>
                  {textLabel26 && textLabel26Props && (
                    <TextLabel {...textLabel26Props} />
                  )}
                </CalendarDayMuted>
              )}
              {calendarDayMuted13 && calendarDayMuted13Props && (
                <CalendarDayMuted {...calendarDayMuted13Props}>
                  {textLabel27 && textLabel27Props && (
                    <TextLabel {...textLabel27Props} />
                  )}
                </CalendarDayMuted>
              )}
              {calendarDayMuted14 && calendarDayMuted14Props && (
                <CalendarDayMuted {...calendarDayMuted14Props}>
                  {textLabel28 && textLabel28Props && (
                    <TextLabel {...textLabel28Props} />
                  )}
                </CalendarDayMuted>
              )}
              {calendarDayMuted15 && calendarDayMuted15Props && (
                <CalendarDayMuted {...calendarDayMuted15Props}>
                  {textLabel29 && textLabel29Props && (
                    <TextLabel {...textLabel29Props} />
                  )}
                </CalendarDayMuted>
              )}
              {calendarDayMuted16 && calendarDayMuted16Props && (
                <CalendarDayMuted {...calendarDayMuted16Props}>
                  {textLabel30 && textLabel30Props && (
                    <TextLabel {...textLabel30Props} />
                  )}
                </CalendarDayMuted>
              )}
            </Frame>
            <Frame {...container5Props}>
              {calendarDayMuted17 && calendarDayMuted17Props && (
                <CalendarDayMuted {...calendarDayMuted17Props}>
                  {textLabel31 && textLabel31Props && (
                    <TextLabel {...textLabel31Props} />
                  )}
                </CalendarDayMuted>
              )}
              {calendarDayMuted18 && calendarDayMuted18Props && (
                <CalendarDayMuted {...calendarDayMuted18Props}>
                  {textLabel32 && textLabel32Props && (
                    <TextLabel {...textLabel32Props} />
                  )}
                </CalendarDayMuted>
              )}
              {calendarDayMuted19 && calendarDayMuted19Props && (
                <CalendarDayMuted {...calendarDayMuted19Props}>
                  {textLabel33 && textLabel33Props && (
                    <TextLabel {...textLabel33Props} />
                  )}
                </CalendarDayMuted>
              )}
              {calendarDayMuted20 && calendarDayMuted20Props && (
                <CalendarDayMuted {...calendarDayMuted20Props}>
                  {textLabel34 && textLabel34Props && (
                    <TextLabel {...textLabel34Props} />
                  )}
                </CalendarDayMuted>
              )}
              {calendarDayMuted21 && calendarDayMuted21Props && (
                <CalendarDayMuted {...calendarDayMuted21Props}>
                  {textLabel35 && textLabel35Props && (
                    <TextLabel {...textLabel35Props} />
                  )}
                </CalendarDayMuted>
              )}
              {calendarDayMuted22 && calendarDayMuted22Props && (
                <CalendarDayMuted {...calendarDayMuted22Props}>
                  {textLabel36 && textLabel36Props && (
                    <TextLabel {...textLabel36Props} />
                  )}
                </CalendarDayMuted>
              )}
              {calendarDayMuted23 && calendarDayMuted23Props && (
                <CalendarDayMuted {...calendarDayMuted23Props}>
                  {textLabel37 && textLabel37Props && (
                    <TextLabel {...textLabel37Props} />
                  )}
                </CalendarDayMuted>
              )}
            </Frame>
            <Frame {...container6Props}>
              {calendarDayMuted24 && calendarDayMuted24Props && (
                <CalendarDayMuted {...calendarDayMuted24Props}>
                  {textLabel38 && textLabel38Props && (
                    <TextLabel {...textLabel38Props} />
                  )}
                </CalendarDayMuted>
              )}
              {calendarDayMuted25 && calendarDayMuted25Props && (
                <CalendarDayMuted {...calendarDayMuted25Props}>
                  {textLabel39 && textLabel39Props && (
                    <TextLabel {...textLabel39Props} />
                  )}
                </CalendarDayMuted>
              )}
              {calendarDay5 && calendarDay5Props && (
                <CalendarDay {...calendarDay5Props}>
                  {textLabel40 && textLabel40Props && (
                    <TextLabel {...textLabel40Props} />
                  )}
                </CalendarDay>
              )}
            </Frame>
          </Frame>
        </>
      )}
    </Frame>
  )
}

//
// Default property values
//
const sdn: CalendarEventMarkersProps = {
  "aria-hidden": "false",
  className: "sdn-calendar",
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--8xlb",
  },
  textLabel: {
    className: "sdn-text-label sdn-text-label--ulqg",
  },
  buttonIconic: {
    className: "sdn-button-iconic sdn-button-iconic--8tzd",
  },
  icon: {
    icon: "material-chevronLeft",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--fgqd",
  },
  buttonIconic2: {
    className: "sdn-button-iconic sdn-button-iconic--8tzd",
  },
  icon2: {
    icon: "material-chevronRight",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--fgqd",
  },
  container: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-container sdn-container--npgy",
  },
  textLabel2: {
    className: "sdn-text-label sdn-text-label--sxr5",
  },
  textLabel3: {
    className: "sdn-text-label sdn-text-label--sxr5",
  },
  textLabel4: {
    className: "sdn-text-label sdn-text-label--sxr5",
  },
  textLabel5: {
    className: "sdn-text-label sdn-text-label--sxr5",
  },
  textLabel6: {
    className: "sdn-text-label sdn-text-label--sxr5",
  },
  textLabel7: {
    className: "sdn-text-label sdn-text-label--sxr5",
  },
  textLabel8: {
    className: "sdn-text-label sdn-text-label--sxr5",
  },
  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--xyjz",
  },
  container2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-container sdn-container--npgy",
  },
  calendarDayMuted: {
    className: "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7",
  },
  textLabel9: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDaySelected: {
    className: "sdn-calendar-day-selected sdn-calendar-day-muted--tzv7",
  },
  textLabel10: {
    className: "sdn-text-label sdn-text-label--fye8",
  },
  textLabel11: {
    className: "sdn-text-label sdn-text-label--yw9b",
  },
  calendarDay: {
    className: "sdn-calendar-day sdn-calendar-day-muted--tzv7",
  },
  textLabel12: {
    className: "sdn-text-label sdn-text-label--bwn4",
  },
  calendarDay2: {
    className: "sdn-calendar-day sdn-calendar-day-muted--tzv7",
  },
  textLabel13: {
    className: "sdn-text-label sdn-text-label--bwn4",
  },
  calendarDay3: {
    className: "sdn-calendar-day sdn-calendar-day-muted--tzv7",
  },
  textLabel14: {
    className: "sdn-text-label sdn-text-label--bwn4",
  },
  calendarDay4: {
    className: "sdn-calendar-day sdn-calendar-day-muted--tzv7",
  },
  textLabel15: {
    className: "sdn-text-label sdn-text-label--bwn4",
  },
  calendarDayMuted2: {
    className: "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7",
  },
  textLabel16: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  container3: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-container sdn-container--npgy",
  },
  calendarDayMuted3: {
    className: "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7",
  },
  textLabel17: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayMuted4: {
    className: "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7",
  },
  textLabel18: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayMuted5: {
    className: "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7",
  },
  textLabel19: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayMuted6: {
    className: "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7",
  },
  textLabel20: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayMuted7: {
    className: "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7",
  },
  textLabel21: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayMuted8: {
    className: "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7",
  },
  textLabel22: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayMuted9: {
    className: "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7",
  },
  textLabel23: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  container4: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-container sdn-container--npgy",
  },
  calendarDayMuted10: {
    className: "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7",
  },
  textLabel24: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayMuted11: {
    className: "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7",
  },
  textLabel25: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayMuted12: {
    className: "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7",
  },
  textLabel26: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayMuted13: {
    className: "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7",
  },
  textLabel27: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayMuted14: {
    className: "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7",
  },
  textLabel28: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayMuted15: {
    className: "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7",
  },
  textLabel29: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayMuted16: {
    className: "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7",
  },
  textLabel30: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  container5: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-container sdn-container--npgy",
  },
  calendarDayMuted17: {
    className: "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7",
  },
  textLabel31: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayMuted18: {
    className: "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7",
  },
  textLabel32: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayMuted19: {
    className: "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7",
  },
  textLabel33: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayMuted20: {
    className: "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7",
  },
  textLabel34: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayMuted21: {
    className: "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7",
  },
  textLabel35: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayMuted22: {
    className: "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7",
  },
  textLabel36: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayMuted23: {
    className: "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7",
  },
  textLabel37: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  container6: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-container sdn-container--npgy",
  },
  calendarDayMuted24: {
    className: "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7",
  },
  textLabel38: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayMuted25: {
    className: "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7",
  },
  textLabel39: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay5: {
    className: "sdn-calendar-day sdn-calendar-day--i3zq",
  },
  textLabel40: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
}

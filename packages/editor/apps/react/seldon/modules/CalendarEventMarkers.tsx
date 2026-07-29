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
import { CalendarDayMuted, CalendarDayMutedProps } from "../elements/CalendarDayMuted"
import { CalendarDaySelected, CalendarDaySelectedProps } from "../elements/CalendarDaySelected"
import { Container, ContainerProps } from "../frames/Container"
import { Frame, FrameProps } from "../frames/Frame"
import { IconProps } from "../primitives/Icon"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface CalendarEventMarkersProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

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

//
// Default property values
//
const sdn: CalendarEventMarkersProps = {
  "aria-hidden": "false",
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--8xlb",
  },
  textLabel: {
    children: "SEPTEMBER 2024",
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
    children: "Sun",
    className: "sdn-text-label sdn-text-label--sxr5",
  },
  textLabel3: {
    children: "Mon",
    className: "sdn-text-label sdn-text-label--sxr5",
  },
  textLabel4: {
    children: "Tue",
    className: "sdn-text-label sdn-text-label--sxr5",
  },
  textLabel5: {
    children: "Wed",
    className: "sdn-text-label sdn-text-label--sxr5",
  },
  textLabel6: {
    children: "Thu",
    className: "sdn-text-label sdn-text-label--sxr5",
  },
  textLabel7: {
    children: "Fri",
    className: "sdn-text-label sdn-text-label--sxr5",
  },
  textLabel8: {
    children: "Sat",
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
    children: "1",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDaySelected: {
    className: "sdn-calendar-day-selected sdn-calendar-day-muted--tzv7",
  },
  textLabel10: {
    children: "2",
    className: "sdn-text-label sdn-text-label--fye8",
  },
  textLabel11: {
    children: "5",
    className: "sdn-text-label sdn-text-label--yw9b",
  },
  calendarDay: {
    className: "sdn-calendar-day sdn-calendar-day-muted--tzv7",
  },
  textLabel12: {
    children: "3",
    className: "sdn-text-label sdn-text-label--bwn4",
  },
  calendarDay2: {
    className: "sdn-calendar-day sdn-calendar-day-muted--tzv7",
  },
  textLabel13: {
    children: "4",
    className: "sdn-text-label sdn-text-label--bwn4",
  },
  calendarDay3: {
    className: "sdn-calendar-day sdn-calendar-day-muted--tzv7",
  },
  textLabel14: {
    children: "5",
    className: "sdn-text-label sdn-text-label--bwn4",
  },
  calendarDay4: {
    className: "sdn-calendar-day sdn-calendar-day-muted--tzv7",
  },
  textLabel15: {
    children: "6",
    className: "sdn-text-label sdn-text-label--bwn4",
  },
  calendarDayMuted2: {
    className: "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7",
  },
  textLabel16: {
    children: "7",
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
    children: "8",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayMuted4: {
    className: "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7",
  },
  textLabel18: {
    children: "9",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayMuted5: {
    className: "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7",
  },
  textLabel19: {
    children: "10",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayMuted6: {
    className: "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7",
  },
  textLabel20: {
    children: "11",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayMuted7: {
    className: "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7",
  },
  textLabel21: {
    children: "12",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayMuted8: {
    className: "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7",
  },
  textLabel22: {
    children: "13",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayMuted9: {
    className: "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7",
  },
  textLabel23: {
    children: "14",
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
    children: "15",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayMuted11: {
    className: "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7",
  },
  textLabel25: {
    children: "16",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayMuted12: {
    className: "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7",
  },
  textLabel26: {
    children: "17",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayMuted13: {
    className: "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7",
  },
  textLabel27: {
    children: "18",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayMuted14: {
    className: "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7",
  },
  textLabel28: {
    children: "19",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayMuted15: {
    className: "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7",
  },
  textLabel29: {
    children: "20",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayMuted16: {
    className: "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7",
  },
  textLabel30: {
    children: "21",
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
    children: "22",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayMuted18: {
    className: "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7",
  },
  textLabel32: {
    children: "23",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayMuted19: {
    className: "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7",
  },
  textLabel33: {
    children: "24",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayMuted20: {
    className: "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7",
  },
  textLabel34: {
    children: "25",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayMuted21: {
    className: "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7",
  },
  textLabel35: {
    children: "26",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayMuted22: {
    className: "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7",
  },
  textLabel36: {
    children: "27",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayMuted23: {
    className: "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7",
  },
  textLabel37: {
    children: "28",
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
    children: "29",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayMuted25: {
    className: "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7",
  },
  textLabel39: {
    children: "30",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay5: {
    className: "sdn-calendar-day sdn-calendar-day--i3zq",
  },
  textLabel40: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
}

/**
 * Calendar: CalendarEventMarkers
 * Level: Module
 * Intent: Month calendar with a navigable header, weekday labels, and a day grid. The default shows a single bordered month; variants cover a two-month range picker and a single month with event markers.
 * Tags: calendar, ui, month, date, navigation, selection, range, events
 * Type: Inline
 *
 * Structure:
 *   Frame                    frame
 *     TextLabel              textLabel
 *     ButtonIconic           buttonIconic
 *       Icon                 icon
 *     ButtonIconic           buttonIconic2
 *       Icon                 icon2
 *   Container                container
 *     TextLabel              textLabel2
 *     TextLabel              textLabel3
 *     TextLabel              textLabel4
 *     TextLabel              textLabel5
 *     TextLabel              textLabel6
 *     TextLabel              textLabel7
 *     TextLabel              textLabel8
 *   Frame                    frame2
 *     Container              container2
 *       CalendarDayMuted     calendarDayMuted
 *         TextLabel          textLabel9
 *       CalendarDaySelected  calendarDaySelected
 *         TextLabel          textLabel10
 *         TextLabel          textLabel11
 *       CalendarDay          calendarDay
 *         TextLabel          textLabel12
 *       CalendarDay          calendarDay2
 *         TextLabel          textLabel13
 *       CalendarDay          calendarDay3
 *         TextLabel          textLabel14
 *       CalendarDay          calendarDay4
 *         TextLabel          textLabel15
 *       CalendarDayMuted     calendarDayMuted2
 *         TextLabel          textLabel16
 *     Container              container3
 *       CalendarDayMuted     calendarDayMuted3
 *         TextLabel          textLabel17
 *       CalendarDayMuted     calendarDayMuted4
 *         TextLabel          textLabel18
 *       CalendarDayMuted     calendarDayMuted5
 *         TextLabel          textLabel19
 *       CalendarDayMuted     calendarDayMuted6
 *         TextLabel          textLabel20
 *       CalendarDayMuted     calendarDayMuted7
 *         TextLabel          textLabel21
 *       CalendarDayMuted     calendarDayMuted8
 *         TextLabel          textLabel22
 *       CalendarDayMuted     calendarDayMuted9
 *         TextLabel          textLabel23
 *     Container              container4
 *       CalendarDayMuted     calendarDayMuted10
 *         TextLabel          textLabel24
 *       CalendarDayMuted     calendarDayMuted11
 *         TextLabel          textLabel25
 *       CalendarDayMuted     calendarDayMuted12
 *         TextLabel          textLabel26
 *       CalendarDayMuted     calendarDayMuted13
 *         TextLabel          textLabel27
 *       CalendarDayMuted     calendarDayMuted14
 *         TextLabel          textLabel28
 *       CalendarDayMuted     calendarDayMuted15
 *         TextLabel          textLabel29
 *       CalendarDayMuted     calendarDayMuted16
 *         TextLabel          textLabel30
 *     Container              container5
 *       CalendarDayMuted     calendarDayMuted17
 *         TextLabel          textLabel31
 *       CalendarDayMuted     calendarDayMuted18
 *         TextLabel          textLabel32
 *       CalendarDayMuted     calendarDayMuted19
 *         TextLabel          textLabel33
 *       CalendarDayMuted     calendarDayMuted20
 *         TextLabel          textLabel34
 *       CalendarDayMuted     calendarDayMuted21
 *         TextLabel          textLabel35
 *       CalendarDayMuted     calendarDayMuted22
 *         TextLabel          textLabel36
 *       CalendarDayMuted     calendarDayMuted23
 *         TextLabel          textLabel37
 *     Container              container6
 *       CalendarDayMuted     calendarDayMuted24
 *         TextLabel          textLabel38
 *       CalendarDayMuted     calendarDayMuted25
 *         TextLabel          textLabel39
 *       CalendarDay          calendarDay5
 *         TextLabel          textLabel40
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
 */
export function CalendarEventMarkers({
  className = "",
  frame,
  textLabel,
  buttonIconic,
  icon,
  buttonIconic2,
  icon2,

  container,
  textLabel2,
  textLabel3,
  textLabel4,
  textLabel5,
  textLabel6,
  textLabel7,
  textLabel8,

  frame2,
  container2,
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
  container3,
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
  container4,
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
  container5,
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
  container6,
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
  const calendarEventMarkersClassName = combineClassNames("sdn-calendar", className)

  const frameProps = mergeSlot(sdn.frame, frame, seldonRefs)
  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)
  const buttonIconicProps = mergeOptionalSlot(sdn.buttonIconic, buttonIconic, seldonRefs)
  const iconProps = mergeSlot(sdn.icon, icon, seldonRefs)
  const buttonIconic2Props = mergeOptionalSlot(sdn.buttonIconic2, buttonIconic2, seldonRefs)
  const icon2Props = mergeSlot(sdn.icon2, icon2, seldonRefs)

  const containerProps = mergeSlot(sdn.container, container, seldonRefs)
  const textLabel2Props = mergeOptionalSlot(sdn.textLabel2, textLabel2, seldonRefs)
  const textLabel3Props = mergeOptionalSlot(sdn.textLabel3, textLabel3, seldonRefs)
  const textLabel4Props = mergeOptionalSlot(sdn.textLabel4, textLabel4, seldonRefs)
  const textLabel5Props = mergeOptionalSlot(sdn.textLabel5, textLabel5, seldonRefs)
  const textLabel6Props = mergeOptionalSlot(sdn.textLabel6, textLabel6, seldonRefs)
  const textLabel7Props = mergeOptionalSlot(sdn.textLabel7, textLabel7, seldonRefs)
  const textLabel8Props = mergeOptionalSlot(sdn.textLabel8, textLabel8, seldonRefs)

  const frame2Props = mergeSlot(sdn.frame2, frame2, seldonRefs)
  const container2Props = mergeSlot(sdn.container2, container2, seldonRefs)
  const calendarDayMutedProps = mergeOptionalSlot(
    sdn.calendarDayMuted,
    calendarDayMuted,
    seldonRefs,
  )
  const textLabel9Props = mergeOptionalSlot(sdn.textLabel9, textLabel9, seldonRefs)
  const calendarDaySelectedProps = mergeOptionalSlot(
    sdn.calendarDaySelected,
    calendarDaySelected,
    seldonRefs,
  )
  const textLabel10Props = mergeOptionalSlot(sdn.textLabel10, textLabel10, seldonRefs)
  const textLabel11Props = mergeOptionalSlot(sdn.textLabel11, textLabel11, seldonRefs)
  const calendarDayProps = mergeOptionalSlot(sdn.calendarDay, calendarDay, seldonRefs)
  const textLabel12Props = mergeOptionalSlot(sdn.textLabel12, textLabel12, seldonRefs)
  const calendarDay2Props = mergeOptionalSlot(sdn.calendarDay2, calendarDay2, seldonRefs)
  const textLabel13Props = mergeOptionalSlot(sdn.textLabel13, textLabel13, seldonRefs)
  const calendarDay3Props = mergeOptionalSlot(sdn.calendarDay3, calendarDay3, seldonRefs)
  const textLabel14Props = mergeOptionalSlot(sdn.textLabel14, textLabel14, seldonRefs)
  const calendarDay4Props = mergeOptionalSlot(sdn.calendarDay4, calendarDay4, seldonRefs)
  const textLabel15Props = mergeOptionalSlot(sdn.textLabel15, textLabel15, seldonRefs)
  const calendarDayMuted2Props = mergeOptionalSlot(
    sdn.calendarDayMuted2,
    calendarDayMuted2,
    seldonRefs,
  )
  const textLabel16Props = mergeOptionalSlot(sdn.textLabel16, textLabel16, seldonRefs)
  const container3Props = mergeSlot(sdn.container3, container3, seldonRefs)
  const calendarDayMuted3Props = mergeOptionalSlot(
    sdn.calendarDayMuted3,
    calendarDayMuted3,
    seldonRefs,
  )
  const textLabel17Props = mergeOptionalSlot(sdn.textLabel17, textLabel17, seldonRefs)
  const calendarDayMuted4Props = mergeOptionalSlot(
    sdn.calendarDayMuted4,
    calendarDayMuted4,
    seldonRefs,
  )
  const textLabel18Props = mergeOptionalSlot(sdn.textLabel18, textLabel18, seldonRefs)
  const calendarDayMuted5Props = mergeOptionalSlot(
    sdn.calendarDayMuted5,
    calendarDayMuted5,
    seldonRefs,
  )
  const textLabel19Props = mergeOptionalSlot(sdn.textLabel19, textLabel19, seldonRefs)
  const calendarDayMuted6Props = mergeOptionalSlot(
    sdn.calendarDayMuted6,
    calendarDayMuted6,
    seldonRefs,
  )
  const textLabel20Props = mergeOptionalSlot(sdn.textLabel20, textLabel20, seldonRefs)
  const calendarDayMuted7Props = mergeOptionalSlot(
    sdn.calendarDayMuted7,
    calendarDayMuted7,
    seldonRefs,
  )
  const textLabel21Props = mergeOptionalSlot(sdn.textLabel21, textLabel21, seldonRefs)
  const calendarDayMuted8Props = mergeOptionalSlot(
    sdn.calendarDayMuted8,
    calendarDayMuted8,
    seldonRefs,
  )
  const textLabel22Props = mergeOptionalSlot(sdn.textLabel22, textLabel22, seldonRefs)
  const calendarDayMuted9Props = mergeOptionalSlot(
    sdn.calendarDayMuted9,
    calendarDayMuted9,
    seldonRefs,
  )
  const textLabel23Props = mergeOptionalSlot(sdn.textLabel23, textLabel23, seldonRefs)
  const container4Props = mergeSlot(sdn.container4, container4, seldonRefs)
  const calendarDayMuted10Props = mergeOptionalSlot(
    sdn.calendarDayMuted10,
    calendarDayMuted10,
    seldonRefs,
  )
  const textLabel24Props = mergeOptionalSlot(sdn.textLabel24, textLabel24, seldonRefs)
  const calendarDayMuted11Props = mergeOptionalSlot(
    sdn.calendarDayMuted11,
    calendarDayMuted11,
    seldonRefs,
  )
  const textLabel25Props = mergeOptionalSlot(sdn.textLabel25, textLabel25, seldonRefs)
  const calendarDayMuted12Props = mergeOptionalSlot(
    sdn.calendarDayMuted12,
    calendarDayMuted12,
    seldonRefs,
  )
  const textLabel26Props = mergeOptionalSlot(sdn.textLabel26, textLabel26, seldonRefs)
  const calendarDayMuted13Props = mergeOptionalSlot(
    sdn.calendarDayMuted13,
    calendarDayMuted13,
    seldonRefs,
  )
  const textLabel27Props = mergeOptionalSlot(sdn.textLabel27, textLabel27, seldonRefs)
  const calendarDayMuted14Props = mergeOptionalSlot(
    sdn.calendarDayMuted14,
    calendarDayMuted14,
    seldonRefs,
  )
  const textLabel28Props = mergeOptionalSlot(sdn.textLabel28, textLabel28, seldonRefs)
  const calendarDayMuted15Props = mergeOptionalSlot(
    sdn.calendarDayMuted15,
    calendarDayMuted15,
    seldonRefs,
  )
  const textLabel29Props = mergeOptionalSlot(sdn.textLabel29, textLabel29, seldonRefs)
  const calendarDayMuted16Props = mergeOptionalSlot(
    sdn.calendarDayMuted16,
    calendarDayMuted16,
    seldonRefs,
  )
  const textLabel30Props = mergeOptionalSlot(sdn.textLabel30, textLabel30, seldonRefs)
  const container5Props = mergeSlot(sdn.container5, container5, seldonRefs)
  const calendarDayMuted17Props = mergeOptionalSlot(
    sdn.calendarDayMuted17,
    calendarDayMuted17,
    seldonRefs,
  )
  const textLabel31Props = mergeOptionalSlot(sdn.textLabel31, textLabel31, seldonRefs)
  const calendarDayMuted18Props = mergeOptionalSlot(
    sdn.calendarDayMuted18,
    calendarDayMuted18,
    seldonRefs,
  )
  const textLabel32Props = mergeOptionalSlot(sdn.textLabel32, textLabel32, seldonRefs)
  const calendarDayMuted19Props = mergeOptionalSlot(
    sdn.calendarDayMuted19,
    calendarDayMuted19,
    seldonRefs,
  )
  const textLabel33Props = mergeOptionalSlot(sdn.textLabel33, textLabel33, seldonRefs)
  const calendarDayMuted20Props = mergeOptionalSlot(
    sdn.calendarDayMuted20,
    calendarDayMuted20,
    seldonRefs,
  )
  const textLabel34Props = mergeOptionalSlot(sdn.textLabel34, textLabel34, seldonRefs)
  const calendarDayMuted21Props = mergeOptionalSlot(
    sdn.calendarDayMuted21,
    calendarDayMuted21,
    seldonRefs,
  )
  const textLabel35Props = mergeOptionalSlot(sdn.textLabel35, textLabel35, seldonRefs)
  const calendarDayMuted22Props = mergeOptionalSlot(
    sdn.calendarDayMuted22,
    calendarDayMuted22,
    seldonRefs,
  )
  const textLabel36Props = mergeOptionalSlot(sdn.textLabel36, textLabel36, seldonRefs)
  const calendarDayMuted23Props = mergeOptionalSlot(
    sdn.calendarDayMuted23,
    calendarDayMuted23,
    seldonRefs,
  )
  const textLabel37Props = mergeOptionalSlot(sdn.textLabel37, textLabel37, seldonRefs)
  const container6Props = mergeSlot(sdn.container6, container6, seldonRefs)
  const calendarDayMuted24Props = mergeOptionalSlot(
    sdn.calendarDayMuted24,
    calendarDayMuted24,
    seldonRefs,
  )
  const textLabel38Props = mergeOptionalSlot(sdn.textLabel38, textLabel38, seldonRefs)
  const calendarDayMuted25Props = mergeOptionalSlot(
    sdn.calendarDayMuted25,
    calendarDayMuted25,
    seldonRefs,
  )
  const textLabel39Props = mergeOptionalSlot(sdn.textLabel39, textLabel39, seldonRefs)
  const calendarDay5Props = mergeOptionalSlot(sdn.calendarDay5, calendarDay5, seldonRefs)
  const textLabel40Props = mergeOptionalSlot(sdn.textLabel40, textLabel40, seldonRefs)

  return (
    <Frame className={calendarEventMarkersClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
      {children !== undefined ? (
        children
      ) : (
        <>
          <Frame {...frameProps}>
            {textLabelProps !== null && <TextLabel {...textLabelProps} />}
            {buttonIconicProps !== null && <ButtonIconic {...buttonIconicProps} icon={iconProps} />}
            {buttonIconic2Props !== null && (
              <ButtonIconic {...buttonIconic2Props} icon={icon2Props} />
            )}
          </Frame>
          <Frame {...containerProps}>
            {textLabel2Props !== null && <TextLabel {...textLabel2Props} />}
            {textLabel3Props !== null && <TextLabel {...textLabel3Props} />}
            {textLabel4Props !== null && <TextLabel {...textLabel4Props} />}
            {textLabel5Props !== null && <TextLabel {...textLabel5Props} />}
            {textLabel6Props !== null && <TextLabel {...textLabel6Props} />}
            {textLabel7Props !== null && <TextLabel {...textLabel7Props} />}
            {textLabel8Props !== null && <TextLabel {...textLabel8Props} />}
          </Frame>
          <Frame {...frame2Props}>
            <Frame {...container2Props}>
              {calendarDayMutedProps !== null && (
                <CalendarDayMuted {...calendarDayMutedProps}>
                  {textLabel9Props !== null && <TextLabel {...textLabel9Props} />}
                </CalendarDayMuted>
              )}
              {calendarDaySelectedProps !== null && (
                <CalendarDaySelected {...calendarDaySelectedProps}>
                  {textLabel10Props !== null && <TextLabel {...textLabel10Props} />}
                  {textLabel11Props !== null && <TextLabel {...textLabel11Props} />}
                </CalendarDaySelected>
              )}
              {calendarDayProps !== null && (
                <CalendarDay {...calendarDayProps}>
                  {textLabel12Props !== null && <TextLabel {...textLabel12Props} />}
                </CalendarDay>
              )}
              {calendarDay2Props !== null && (
                <CalendarDay {...calendarDay2Props}>
                  {textLabel13Props !== null && <TextLabel {...textLabel13Props} />}
                </CalendarDay>
              )}
              {calendarDay3Props !== null && (
                <CalendarDay {...calendarDay3Props}>
                  {textLabel14Props !== null && <TextLabel {...textLabel14Props} />}
                </CalendarDay>
              )}
              {calendarDay4Props !== null && (
                <CalendarDay {...calendarDay4Props}>
                  {textLabel15Props !== null && <TextLabel {...textLabel15Props} />}
                </CalendarDay>
              )}
              {calendarDayMuted2Props !== null && (
                <CalendarDayMuted {...calendarDayMuted2Props}>
                  {textLabel16Props !== null && <TextLabel {...textLabel16Props} />}
                </CalendarDayMuted>
              )}
            </Frame>
            <Frame {...container3Props}>
              {calendarDayMuted3Props !== null && (
                <CalendarDayMuted {...calendarDayMuted3Props}>
                  {textLabel17Props !== null && <TextLabel {...textLabel17Props} />}
                </CalendarDayMuted>
              )}
              {calendarDayMuted4Props !== null && (
                <CalendarDayMuted {...calendarDayMuted4Props}>
                  {textLabel18Props !== null && <TextLabel {...textLabel18Props} />}
                </CalendarDayMuted>
              )}
              {calendarDayMuted5Props !== null && (
                <CalendarDayMuted {...calendarDayMuted5Props}>
                  {textLabel19Props !== null && <TextLabel {...textLabel19Props} />}
                </CalendarDayMuted>
              )}
              {calendarDayMuted6Props !== null && (
                <CalendarDayMuted {...calendarDayMuted6Props}>
                  {textLabel20Props !== null && <TextLabel {...textLabel20Props} />}
                </CalendarDayMuted>
              )}
              {calendarDayMuted7Props !== null && (
                <CalendarDayMuted {...calendarDayMuted7Props}>
                  {textLabel21Props !== null && <TextLabel {...textLabel21Props} />}
                </CalendarDayMuted>
              )}
              {calendarDayMuted8Props !== null && (
                <CalendarDayMuted {...calendarDayMuted8Props}>
                  {textLabel22Props !== null && <TextLabel {...textLabel22Props} />}
                </CalendarDayMuted>
              )}
              {calendarDayMuted9Props !== null && (
                <CalendarDayMuted {...calendarDayMuted9Props}>
                  {textLabel23Props !== null && <TextLabel {...textLabel23Props} />}
                </CalendarDayMuted>
              )}
            </Frame>
            <Frame {...container4Props}>
              {calendarDayMuted10Props !== null && (
                <CalendarDayMuted {...calendarDayMuted10Props}>
                  {textLabel24Props !== null && <TextLabel {...textLabel24Props} />}
                </CalendarDayMuted>
              )}
              {calendarDayMuted11Props !== null && (
                <CalendarDayMuted {...calendarDayMuted11Props}>
                  {textLabel25Props !== null && <TextLabel {...textLabel25Props} />}
                </CalendarDayMuted>
              )}
              {calendarDayMuted12Props !== null && (
                <CalendarDayMuted {...calendarDayMuted12Props}>
                  {textLabel26Props !== null && <TextLabel {...textLabel26Props} />}
                </CalendarDayMuted>
              )}
              {calendarDayMuted13Props !== null && (
                <CalendarDayMuted {...calendarDayMuted13Props}>
                  {textLabel27Props !== null && <TextLabel {...textLabel27Props} />}
                </CalendarDayMuted>
              )}
              {calendarDayMuted14Props !== null && (
                <CalendarDayMuted {...calendarDayMuted14Props}>
                  {textLabel28Props !== null && <TextLabel {...textLabel28Props} />}
                </CalendarDayMuted>
              )}
              {calendarDayMuted15Props !== null && (
                <CalendarDayMuted {...calendarDayMuted15Props}>
                  {textLabel29Props !== null && <TextLabel {...textLabel29Props} />}
                </CalendarDayMuted>
              )}
              {calendarDayMuted16Props !== null && (
                <CalendarDayMuted {...calendarDayMuted16Props}>
                  {textLabel30Props !== null && <TextLabel {...textLabel30Props} />}
                </CalendarDayMuted>
              )}
            </Frame>
            <Frame {...container5Props}>
              {calendarDayMuted17Props !== null && (
                <CalendarDayMuted {...calendarDayMuted17Props}>
                  {textLabel31Props !== null && <TextLabel {...textLabel31Props} />}
                </CalendarDayMuted>
              )}
              {calendarDayMuted18Props !== null && (
                <CalendarDayMuted {...calendarDayMuted18Props}>
                  {textLabel32Props !== null && <TextLabel {...textLabel32Props} />}
                </CalendarDayMuted>
              )}
              {calendarDayMuted19Props !== null && (
                <CalendarDayMuted {...calendarDayMuted19Props}>
                  {textLabel33Props !== null && <TextLabel {...textLabel33Props} />}
                </CalendarDayMuted>
              )}
              {calendarDayMuted20Props !== null && (
                <CalendarDayMuted {...calendarDayMuted20Props}>
                  {textLabel34Props !== null && <TextLabel {...textLabel34Props} />}
                </CalendarDayMuted>
              )}
              {calendarDayMuted21Props !== null && (
                <CalendarDayMuted {...calendarDayMuted21Props}>
                  {textLabel35Props !== null && <TextLabel {...textLabel35Props} />}
                </CalendarDayMuted>
              )}
              {calendarDayMuted22Props !== null && (
                <CalendarDayMuted {...calendarDayMuted22Props}>
                  {textLabel36Props !== null && <TextLabel {...textLabel36Props} />}
                </CalendarDayMuted>
              )}
              {calendarDayMuted23Props !== null && (
                <CalendarDayMuted {...calendarDayMuted23Props}>
                  {textLabel37Props !== null && <TextLabel {...textLabel37Props} />}
                </CalendarDayMuted>
              )}
            </Frame>
            <Frame {...container6Props}>
              {calendarDayMuted24Props !== null && (
                <CalendarDayMuted {...calendarDayMuted24Props}>
                  {textLabel38Props !== null && <TextLabel {...textLabel38Props} />}
                </CalendarDayMuted>
              )}
              {calendarDayMuted25Props !== null && (
                <CalendarDayMuted {...calendarDayMuted25Props}>
                  {textLabel39Props !== null && <TextLabel {...textLabel39Props} />}
                </CalendarDayMuted>
              )}
              {calendarDay5Props !== null && (
                <CalendarDay {...calendarDay5Props}>
                  {textLabel40Props !== null && <TextLabel {...textLabel40Props} />}
                </CalendarDay>
              )}
            </Frame>
          </Frame>
        </>
      )}
    </Frame>
  )
}

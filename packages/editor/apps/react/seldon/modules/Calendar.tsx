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
import { CalendarDayGridCell, CalendarDayGridCellProps } from "../elements/CalendarDayGridCell"
import { CalendarDaySelected, CalendarDaySelectedProps } from "../elements/CalendarDaySelected"
import { CalendarDayToday, CalendarDayTodayProps } from "../elements/CalendarDayToday"
import { Container, ContainerProps } from "../frames/Container"
import { Frame, FrameProps } from "../frames/Frame"
import { IconProps } from "../primitives/Icon"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { TextTitle, TextTitleProps } from "../primitives/TextTitle"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface CalendarProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  frame?: FrameProps | null
  buttonIconic?: ButtonIconicProps | null
  icon?: IconProps | null
  buttonIconic2?: ButtonIconicProps | null
  icon2?: IconProps | null
  textTitle?: TextTitleProps | null
  buttonIconic3?: ButtonIconicProps | null
  icon3?: IconProps | null
  buttonIconic4?: ButtonIconicProps | null
  icon4?: IconProps | null

  container?: ContainerProps | null
  textLabel?: TextLabelProps | null
  textLabel2?: TextLabelProps | null
  textLabel3?: TextLabelProps | null
  textLabel4?: TextLabelProps | null
  textLabel5?: TextLabelProps | null
  textLabel6?: TextLabelProps | null
  textLabel7?: TextLabelProps | null

  frame2?: FrameProps | null
  container2?: ContainerProps | null
  calendarDay?: CalendarDayProps | null
  textLabel8?: TextLabelProps | null
  calendarDayGridCell?: CalendarDayGridCellProps | null
  textLabel9?: TextLabelProps | null
  calendarDayGridCell2?: CalendarDayGridCellProps | null
  textLabel10?: TextLabelProps | null
  container3?: ContainerProps | null
  calendarDayGridCell3?: CalendarDayGridCellProps | null
  textLabel11?: TextLabelProps | null
  calendarDayGridCell4?: CalendarDayGridCellProps | null
  textLabel12?: TextLabelProps | null
  calendarDayGridCell5?: CalendarDayGridCellProps | null
  textLabel13?: TextLabelProps | null
  calendarDayGridCell6?: CalendarDayGridCellProps | null
  textLabel14?: TextLabelProps | null
  calendarDayGridCell7?: CalendarDayGridCellProps | null
  textLabel15?: TextLabelProps | null
  calendarDayGridCell8?: CalendarDayGridCellProps | null
  textLabel16?: TextLabelProps | null
  calendarDayGridCell9?: CalendarDayGridCellProps | null
  textLabel17?: TextLabelProps | null
  container4?: ContainerProps | null
  calendarDayGridCell10?: CalendarDayGridCellProps | null
  textLabel18?: TextLabelProps | null
  calendarDayGridCell11?: CalendarDayGridCellProps | null
  textLabel19?: TextLabelProps | null
  calendarDayGridCell12?: CalendarDayGridCellProps | null
  textLabel20?: TextLabelProps | null
  calendarDayGridCell13?: CalendarDayGridCellProps | null
  textLabel21?: TextLabelProps | null
  calendarDayGridCell14?: CalendarDayGridCellProps | null
  textLabel22?: TextLabelProps | null
  calendarDayGridCell15?: CalendarDayGridCellProps | null
  textLabel23?: TextLabelProps | null
  calendarDayGridCell16?: CalendarDayGridCellProps | null
  textLabel24?: TextLabelProps | null
  container5?: ContainerProps | null
  calendarDayGridCell17?: CalendarDayGridCellProps | null
  textLabel25?: TextLabelProps | null
  calendarDayToday?: CalendarDayTodayProps | null
  textLabel26?: TextLabelProps | null
  calendarDayGridCell18?: CalendarDayGridCellProps | null
  textLabel27?: TextLabelProps | null
  calendarDaySelected?: CalendarDaySelectedProps | null
  textLabel28?: TextLabelProps | null
  calendarDayGridCell19?: CalendarDayGridCellProps | null
  textLabel29?: TextLabelProps | null
  calendarDayGridCell20?: CalendarDayGridCellProps | null
  textLabel30?: TextLabelProps | null
  calendarDayGridCell21?: CalendarDayGridCellProps | null
  textLabel31?: TextLabelProps | null
  container6?: ContainerProps | null
  calendarDayGridCell22?: CalendarDayGridCellProps | null
  textLabel32?: TextLabelProps | null
  calendarDayGridCell23?: CalendarDayGridCellProps | null
  textLabel33?: TextLabelProps | null
  calendarDayGridCell24?: CalendarDayGridCellProps | null
  textLabel34?: TextLabelProps | null
  calendarDayGridCell25?: CalendarDayGridCellProps | null
  textLabel35?: TextLabelProps | null
  calendarDayGridCell26?: CalendarDayGridCellProps | null
  textLabel36?: TextLabelProps | null
  calendarDayGridCell27?: CalendarDayGridCellProps | null
  textLabel37?: TextLabelProps | null
  calendarDayGridCell28?: CalendarDayGridCellProps | null
  textLabel38?: TextLabelProps | null
  container7?: ContainerProps | null
  calendarDayGridCell29?: CalendarDayGridCellProps | null
  textLabel39?: TextLabelProps | null
  calendarDay2?: CalendarDayProps | null
  textLabel40?: TextLabelProps | null
}

//
// Default property values
//
const sdn: CalendarProps = {
  "aria-hidden": "false",
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--8xlb",
  },
  buttonIconic: {
    className: "sdn-button-iconic sdn-button-iconic--8tzd",
  },
  icon: {
    icon: "material-chevronDoubleLeft",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--nlt7",
  },
  buttonIconic2: {
    className: "sdn-button-iconic sdn-button-iconic--8tzd",
  },
  icon2: {
    icon: "material-chevronLeft",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--nlt7",
  },
  textTitle: {
    className: "sdn-text-title sdn-text-title--blaq",
  },
  buttonIconic3: {
    className: "sdn-button-iconic sdn-button-iconic--8tzd",
  },
  icon3: {
    icon: "material-chevronRight",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--nlt7",
  },
  buttonIconic4: {
    className: "sdn-button-iconic sdn-button-iconic--8tzd",
  },
  icon4: {
    icon: "material-chevronDoubleRight",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--nlt7",
  },

  container: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-container sdn-container--npgy",
  },
  textLabel: {
    className: "sdn-text-label sdn-text-label--sxr5",
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

  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--hskv",
  },
  container2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-container sdn-container--edpm",
  },
  calendarDay: {
    className: "sdn-calendar-day sdn-calendar-day--i3zq",
  },
  textLabel8: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCell: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel9: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCell2: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel10: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  container3: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-container sdn-container--edpm",
  },
  calendarDayGridCell3: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel11: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCell4: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel12: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCell5: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel13: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCell6: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel14: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCell7: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel15: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCell8: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel16: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCell9: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel17: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  container4: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-container sdn-container--edpm",
  },
  calendarDayGridCell10: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel18: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCell11: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel19: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCell12: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel20: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCell13: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel21: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCell14: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel22: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCell15: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel23: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCell16: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel24: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  container5: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-container sdn-container--edpm",
  },
  calendarDayGridCell17: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel25: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayToday: {
    className: "sdn-calendar-day-today sdn-calendar-day-grid-cell--iysx",
  },
  textLabel26: {
    className: "sdn-text-label sdn-text-label--bwn4",
  },
  calendarDayGridCell18: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel27: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDaySelected: {
    className: "sdn-calendar-day-selected sdn-calendar-day-grid-cell--iysx",
  },
  textLabel28: {
    className: "sdn-text-label sdn-text-label--fye8",
  },
  calendarDayGridCell19: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel29: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCell20: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel30: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCell21: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel31: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  container6: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-container sdn-container--edpm",
  },
  calendarDayGridCell22: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel32: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCell23: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel33: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCell24: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel34: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCell25: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel35: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCell26: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel36: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCell27: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel37: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCell28: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel38: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  container7: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-container sdn-container--edpm",
  },
  calendarDayGridCell29: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel39: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay2: {
    className: "sdn-calendar-day sdn-calendar-day--2hoh",
  },
  textLabel40: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
}

/**
 * Calendar: Calendar
 * Level: Module
 * Intent: Month calendar with a navigable header, weekday labels, and a day grid. The default shows a single bordered month; variants cover a two-month range picker and a single month with event markers.
 * Tags: calendar, ui, month, date, navigation, selection, range, events
 * Type: Inline
 *
 * Structure:
 *   Frame                    frame
 *     ButtonIconic           buttonIconic
 *       Icon                 icon
 *     ButtonIconic           buttonIconic2
 *       Icon                 icon2
 *     TextTitle              textTitle
 *     ButtonIconic           buttonIconic3
 *       Icon                 icon3
 *     ButtonIconic           buttonIconic4
 *       Icon                 icon4
 *   Container                container
 *     TextLabel              textLabel
 *     TextLabel              textLabel2
 *     TextLabel              textLabel3
 *     TextLabel              textLabel4
 *     TextLabel              textLabel5
 *     TextLabel              textLabel6
 *     TextLabel              textLabel7
 *   Frame                    frame2
 *     Container              container2
 *       CalendarDay          calendarDay
 *         TextLabel          textLabel8
 *       CalendarDayGridCell  calendarDayGridCell
 *         TextLabel          textLabel9
 *       CalendarDayGridCell  calendarDayGridCell2
 *         TextLabel          textLabel10
 *     Container              container3
 *       CalendarDayGridCell  calendarDayGridCell3
 *         TextLabel          textLabel11
 *       CalendarDayGridCell  calendarDayGridCell4
 *         TextLabel          textLabel12
 *       CalendarDayGridCell  calendarDayGridCell5
 *         TextLabel          textLabel13
 *       CalendarDayGridCell  calendarDayGridCell6
 *         TextLabel          textLabel14
 *       CalendarDayGridCell  calendarDayGridCell7
 *         TextLabel          textLabel15
 *       CalendarDayGridCell  calendarDayGridCell8
 *         TextLabel          textLabel16
 *       CalendarDayGridCell  calendarDayGridCell9
 *         TextLabel          textLabel17
 *     Container              container4
 *       CalendarDayGridCell  calendarDayGridCell10
 *         TextLabel          textLabel18
 *       CalendarDayGridCell  calendarDayGridCell11
 *         TextLabel          textLabel19
 *       CalendarDayGridCell  calendarDayGridCell12
 *         TextLabel          textLabel20
 *       CalendarDayGridCell  calendarDayGridCell13
 *         TextLabel          textLabel21
 *       CalendarDayGridCell  calendarDayGridCell14
 *         TextLabel          textLabel22
 *       CalendarDayGridCell  calendarDayGridCell15
 *         TextLabel          textLabel23
 *       CalendarDayGridCell  calendarDayGridCell16
 *         TextLabel          textLabel24
 *     Container              container5
 *       CalendarDayGridCell  calendarDayGridCell17
 *         TextLabel          textLabel25
 *       CalendarDayToday     calendarDayToday
 *         TextLabel          textLabel26
 *       CalendarDayGridCell  calendarDayGridCell18
 *         TextLabel          textLabel27
 *       CalendarDaySelected  calendarDaySelected
 *         TextLabel          textLabel28
 *       CalendarDayGridCell  calendarDayGridCell19
 *         TextLabel          textLabel29
 *       CalendarDayGridCell  calendarDayGridCell20
 *         TextLabel          textLabel30
 *       CalendarDayGridCell  calendarDayGridCell21
 *         TextLabel          textLabel31
 *     Container              container6
 *       CalendarDayGridCell  calendarDayGridCell22
 *         TextLabel          textLabel32
 *       CalendarDayGridCell  calendarDayGridCell23
 *         TextLabel          textLabel33
 *       CalendarDayGridCell  calendarDayGridCell24
 *         TextLabel          textLabel34
 *       CalendarDayGridCell  calendarDayGridCell25
 *         TextLabel          textLabel35
 *       CalendarDayGridCell  calendarDayGridCell26
 *         TextLabel          textLabel36
 *       CalendarDayGridCell  calendarDayGridCell27
 *         TextLabel          textLabel37
 *       CalendarDayGridCell  calendarDayGridCell28
 *         TextLabel          textLabel38
 *     Container              container7
 *       CalendarDayGridCell  calendarDayGridCell29
 *         TextLabel          textLabel39
 *       CalendarDay          calendarDay2
 *         TextLabel          textLabel40
 *
 * @example
 * ```tsx
 * <Calendar
 *   aria-hidden="false"
 *   frame="{}"
 *   buttonIconic={() => {}}
 *   icon="material-star"
 *   buttonIconic2={() => {}}
 *   textTitle="Product Title"
 *   buttonIconic3={() => {}}
 *   buttonIconic4={() => {}}
 *   container="{}"
 *   textLabel="{}"
 *   textLabel2="{}"
 *   textLabel3="{}"
 *   textLabel4="{}"
 *   textLabel5="{}"
 *   textLabel6="{}"
 *   textLabel7="{}"
 *   frame2="{}"
 *   calendarDay="{}"
 *   calendarDayGridCell2="{}"
 *   calendarDayGridCell3="{}"
 *   container2="{}"
 *   calendarDayGridCell="{}"
 *   calendarDayGridCell4="{}"
 *   calendarDayGridCell5="{}"
 *   calendarDayGridCell6="{}"
 *   calendarDayGridCell7="{}"
 *   container3="{}"
 *   container4="{}"
 *   calendarDayToday2="{}"
 *   calendarDaySelected4="{}"
 *   container5="{}"
 *   container6="{}"
 *   calendarDay2="{}"
 * />
 * ```
 */
export function Calendar({
  className = "",
  frame,
  buttonIconic,
  icon,
  buttonIconic2,
  icon2,
  textTitle,
  buttonIconic3,
  icon3,
  buttonIconic4,
  icon4,

  container,
  textLabel,
  textLabel2,
  textLabel3,
  textLabel4,
  textLabel5,
  textLabel6,
  textLabel7,

  frame2,
  container2,
  calendarDay,
  textLabel8,
  calendarDayGridCell,
  textLabel9,
  calendarDayGridCell2,
  textLabel10,
  container3,
  calendarDayGridCell3,
  textLabel11,
  calendarDayGridCell4,
  textLabel12,
  calendarDayGridCell5,
  textLabel13,
  calendarDayGridCell6,
  textLabel14,
  calendarDayGridCell7,
  textLabel15,
  calendarDayGridCell8,
  textLabel16,
  calendarDayGridCell9,
  textLabel17,
  container4,
  calendarDayGridCell10,
  textLabel18,
  calendarDayGridCell11,
  textLabel19,
  calendarDayGridCell12,
  textLabel20,
  calendarDayGridCell13,
  textLabel21,
  calendarDayGridCell14,
  textLabel22,
  calendarDayGridCell15,
  textLabel23,
  calendarDayGridCell16,
  textLabel24,
  container5,
  calendarDayGridCell17,
  textLabel25,
  calendarDayToday,
  textLabel26,
  calendarDayGridCell18,
  textLabel27,
  calendarDaySelected,
  textLabel28,
  calendarDayGridCell19,
  textLabel29,
  calendarDayGridCell20,
  textLabel30,
  calendarDayGridCell21,
  textLabel31,
  container6,
  calendarDayGridCell22,
  textLabel32,
  calendarDayGridCell23,
  textLabel33,
  calendarDayGridCell24,
  textLabel34,
  calendarDayGridCell25,
  textLabel35,
  calendarDayGridCell26,
  textLabel36,
  calendarDayGridCell27,
  textLabel37,
  calendarDayGridCell28,
  textLabel38,
  container7,
  calendarDayGridCell29,
  textLabel39,
  calendarDay2,
  textLabel40,

  children,
  seldonRefs,
  ...props
}: CalendarProps) {
  const calendarClassName = combineClassNames("sdn-calendar", className)

  const frameProps = mergeSlot(sdn.frame, frame, seldonRefs)
  const buttonIconicProps = mergeOptionalSlot(sdn.buttonIconic, buttonIconic, seldonRefs)
  const iconProps = mergeSlot(sdn.icon, icon, seldonRefs)
  const buttonIconic2Props = mergeOptionalSlot(sdn.buttonIconic2, buttonIconic2, seldonRefs)
  const icon2Props = mergeSlot(sdn.icon2, icon2, seldonRefs)
  const textTitleProps = mergeOptionalSlot(sdn.textTitle, textTitle, seldonRefs)
  const buttonIconic3Props = mergeOptionalSlot(sdn.buttonIconic3, buttonIconic3, seldonRefs)
  const icon3Props = mergeSlot(sdn.icon3, icon3, seldonRefs)
  const buttonIconic4Props = mergeOptionalSlot(sdn.buttonIconic4, buttonIconic4, seldonRefs)
  const icon4Props = mergeSlot(sdn.icon4, icon4, seldonRefs)

  const containerProps = mergeSlot(sdn.container, container, seldonRefs)
  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)
  const textLabel2Props = mergeOptionalSlot(sdn.textLabel2, textLabel2, seldonRefs)
  const textLabel3Props = mergeOptionalSlot(sdn.textLabel3, textLabel3, seldonRefs)
  const textLabel4Props = mergeOptionalSlot(sdn.textLabel4, textLabel4, seldonRefs)
  const textLabel5Props = mergeOptionalSlot(sdn.textLabel5, textLabel5, seldonRefs)
  const textLabel6Props = mergeOptionalSlot(sdn.textLabel6, textLabel6, seldonRefs)
  const textLabel7Props = mergeOptionalSlot(sdn.textLabel7, textLabel7, seldonRefs)

  const frame2Props = mergeSlot(sdn.frame2, frame2, seldonRefs)
  const container2Props = mergeSlot(sdn.container2, container2, seldonRefs)
  const calendarDayProps = mergeOptionalSlot(sdn.calendarDay, calendarDay, seldonRefs)
  const textLabel8Props = mergeOptionalSlot(sdn.textLabel8, textLabel8, seldonRefs)
  const calendarDayGridCellProps = mergeOptionalSlot(
    sdn.calendarDayGridCell,
    calendarDayGridCell,
    seldonRefs,
  )
  const textLabel9Props = mergeOptionalSlot(sdn.textLabel9, textLabel9, seldonRefs)
  const calendarDayGridCell2Props = mergeOptionalSlot(
    sdn.calendarDayGridCell2,
    calendarDayGridCell2,
    seldonRefs,
  )
  const textLabel10Props = mergeOptionalSlot(sdn.textLabel10, textLabel10, seldonRefs)
  const container3Props = mergeSlot(sdn.container3, container3, seldonRefs)
  const calendarDayGridCell3Props = mergeOptionalSlot(
    sdn.calendarDayGridCell3,
    calendarDayGridCell3,
    seldonRefs,
  )
  const textLabel11Props = mergeOptionalSlot(sdn.textLabel11, textLabel11, seldonRefs)
  const calendarDayGridCell4Props = mergeOptionalSlot(
    sdn.calendarDayGridCell4,
    calendarDayGridCell4,
    seldonRefs,
  )
  const textLabel12Props = mergeOptionalSlot(sdn.textLabel12, textLabel12, seldonRefs)
  const calendarDayGridCell5Props = mergeOptionalSlot(
    sdn.calendarDayGridCell5,
    calendarDayGridCell5,
    seldonRefs,
  )
  const textLabel13Props = mergeOptionalSlot(sdn.textLabel13, textLabel13, seldonRefs)
  const calendarDayGridCell6Props = mergeOptionalSlot(
    sdn.calendarDayGridCell6,
    calendarDayGridCell6,
    seldonRefs,
  )
  const textLabel14Props = mergeOptionalSlot(sdn.textLabel14, textLabel14, seldonRefs)
  const calendarDayGridCell7Props = mergeOptionalSlot(
    sdn.calendarDayGridCell7,
    calendarDayGridCell7,
    seldonRefs,
  )
  const textLabel15Props = mergeOptionalSlot(sdn.textLabel15, textLabel15, seldonRefs)
  const calendarDayGridCell8Props = mergeOptionalSlot(
    sdn.calendarDayGridCell8,
    calendarDayGridCell8,
    seldonRefs,
  )
  const textLabel16Props = mergeOptionalSlot(sdn.textLabel16, textLabel16, seldonRefs)
  const calendarDayGridCell9Props = mergeOptionalSlot(
    sdn.calendarDayGridCell9,
    calendarDayGridCell9,
    seldonRefs,
  )
  const textLabel17Props = mergeOptionalSlot(sdn.textLabel17, textLabel17, seldonRefs)
  const container4Props = mergeSlot(sdn.container4, container4, seldonRefs)
  const calendarDayGridCell10Props = mergeOptionalSlot(
    sdn.calendarDayGridCell10,
    calendarDayGridCell10,
    seldonRefs,
  )
  const textLabel18Props = mergeOptionalSlot(sdn.textLabel18, textLabel18, seldonRefs)
  const calendarDayGridCell11Props = mergeOptionalSlot(
    sdn.calendarDayGridCell11,
    calendarDayGridCell11,
    seldonRefs,
  )
  const textLabel19Props = mergeOptionalSlot(sdn.textLabel19, textLabel19, seldonRefs)
  const calendarDayGridCell12Props = mergeOptionalSlot(
    sdn.calendarDayGridCell12,
    calendarDayGridCell12,
    seldonRefs,
  )
  const textLabel20Props = mergeOptionalSlot(sdn.textLabel20, textLabel20, seldonRefs)
  const calendarDayGridCell13Props = mergeOptionalSlot(
    sdn.calendarDayGridCell13,
    calendarDayGridCell13,
    seldonRefs,
  )
  const textLabel21Props = mergeOptionalSlot(sdn.textLabel21, textLabel21, seldonRefs)
  const calendarDayGridCell14Props = mergeOptionalSlot(
    sdn.calendarDayGridCell14,
    calendarDayGridCell14,
    seldonRefs,
  )
  const textLabel22Props = mergeOptionalSlot(sdn.textLabel22, textLabel22, seldonRefs)
  const calendarDayGridCell15Props = mergeOptionalSlot(
    sdn.calendarDayGridCell15,
    calendarDayGridCell15,
    seldonRefs,
  )
  const textLabel23Props = mergeOptionalSlot(sdn.textLabel23, textLabel23, seldonRefs)
  const calendarDayGridCell16Props = mergeOptionalSlot(
    sdn.calendarDayGridCell16,
    calendarDayGridCell16,
    seldonRefs,
  )
  const textLabel24Props = mergeOptionalSlot(sdn.textLabel24, textLabel24, seldonRefs)
  const container5Props = mergeSlot(sdn.container5, container5, seldonRefs)
  const calendarDayGridCell17Props = mergeOptionalSlot(
    sdn.calendarDayGridCell17,
    calendarDayGridCell17,
    seldonRefs,
  )
  const textLabel25Props = mergeOptionalSlot(sdn.textLabel25, textLabel25, seldonRefs)
  const calendarDayTodayProps = mergeOptionalSlot(
    sdn.calendarDayToday,
    calendarDayToday,
    seldonRefs,
  )
  const textLabel26Props = mergeOptionalSlot(sdn.textLabel26, textLabel26, seldonRefs)
  const calendarDayGridCell18Props = mergeOptionalSlot(
    sdn.calendarDayGridCell18,
    calendarDayGridCell18,
    seldonRefs,
  )
  const textLabel27Props = mergeOptionalSlot(sdn.textLabel27, textLabel27, seldonRefs)
  const calendarDaySelectedProps = mergeOptionalSlot(
    sdn.calendarDaySelected,
    calendarDaySelected,
    seldonRefs,
  )
  const textLabel28Props = mergeOptionalSlot(sdn.textLabel28, textLabel28, seldonRefs)
  const calendarDayGridCell19Props = mergeOptionalSlot(
    sdn.calendarDayGridCell19,
    calendarDayGridCell19,
    seldonRefs,
  )
  const textLabel29Props = mergeOptionalSlot(sdn.textLabel29, textLabel29, seldonRefs)
  const calendarDayGridCell20Props = mergeOptionalSlot(
    sdn.calendarDayGridCell20,
    calendarDayGridCell20,
    seldonRefs,
  )
  const textLabel30Props = mergeOptionalSlot(sdn.textLabel30, textLabel30, seldonRefs)
  const calendarDayGridCell21Props = mergeOptionalSlot(
    sdn.calendarDayGridCell21,
    calendarDayGridCell21,
    seldonRefs,
  )
  const textLabel31Props = mergeOptionalSlot(sdn.textLabel31, textLabel31, seldonRefs)
  const container6Props = mergeSlot(sdn.container6, container6, seldonRefs)
  const calendarDayGridCell22Props = mergeOptionalSlot(
    sdn.calendarDayGridCell22,
    calendarDayGridCell22,
    seldonRefs,
  )
  const textLabel32Props = mergeOptionalSlot(sdn.textLabel32, textLabel32, seldonRefs)
  const calendarDayGridCell23Props = mergeOptionalSlot(
    sdn.calendarDayGridCell23,
    calendarDayGridCell23,
    seldonRefs,
  )
  const textLabel33Props = mergeOptionalSlot(sdn.textLabel33, textLabel33, seldonRefs)
  const calendarDayGridCell24Props = mergeOptionalSlot(
    sdn.calendarDayGridCell24,
    calendarDayGridCell24,
    seldonRefs,
  )
  const textLabel34Props = mergeOptionalSlot(sdn.textLabel34, textLabel34, seldonRefs)
  const calendarDayGridCell25Props = mergeOptionalSlot(
    sdn.calendarDayGridCell25,
    calendarDayGridCell25,
    seldonRefs,
  )
  const textLabel35Props = mergeOptionalSlot(sdn.textLabel35, textLabel35, seldonRefs)
  const calendarDayGridCell26Props = mergeOptionalSlot(
    sdn.calendarDayGridCell26,
    calendarDayGridCell26,
    seldonRefs,
  )
  const textLabel36Props = mergeOptionalSlot(sdn.textLabel36, textLabel36, seldonRefs)
  const calendarDayGridCell27Props = mergeOptionalSlot(
    sdn.calendarDayGridCell27,
    calendarDayGridCell27,
    seldonRefs,
  )
  const textLabel37Props = mergeOptionalSlot(sdn.textLabel37, textLabel37, seldonRefs)
  const calendarDayGridCell28Props = mergeOptionalSlot(
    sdn.calendarDayGridCell28,
    calendarDayGridCell28,
    seldonRefs,
  )
  const textLabel38Props = mergeOptionalSlot(sdn.textLabel38, textLabel38, seldonRefs)
  const container7Props = mergeSlot(sdn.container7, container7, seldonRefs)
  const calendarDayGridCell29Props = mergeOptionalSlot(
    sdn.calendarDayGridCell29,
    calendarDayGridCell29,
    seldonRefs,
  )
  const textLabel39Props = mergeOptionalSlot(sdn.textLabel39, textLabel39, seldonRefs)
  const calendarDay2Props = mergeOptionalSlot(sdn.calendarDay2, calendarDay2, seldonRefs)
  const textLabel40Props = mergeOptionalSlot(sdn.textLabel40, textLabel40, seldonRefs)

  return (
    <Frame className={calendarClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
      {children !== undefined ? (
        children
      ) : (
        <>
          <Frame {...frameProps}>
            {buttonIconicProps !== null && <ButtonIconic {...buttonIconicProps} icon={iconProps} />}
            {buttonIconic2Props !== null && (
              <ButtonIconic {...buttonIconic2Props} icon={icon2Props} />
            )}
            {textTitleProps !== null && <TextTitle {...textTitleProps} />}
            {buttonIconic3Props !== null && (
              <ButtonIconic {...buttonIconic3Props} icon={icon3Props} />
            )}
            {buttonIconic4Props !== null && (
              <ButtonIconic {...buttonIconic4Props} icon={icon4Props} />
            )}
          </Frame>
          <Frame {...containerProps}>
            {textLabelProps !== null && <TextLabel {...textLabelProps} />}
            {textLabel2Props !== null && <TextLabel {...textLabel2Props} />}
            {textLabel3Props !== null && <TextLabel {...textLabel3Props} />}
            {textLabel4Props !== null && <TextLabel {...textLabel4Props} />}
            {textLabel5Props !== null && <TextLabel {...textLabel5Props} />}
            {textLabel6Props !== null && <TextLabel {...textLabel6Props} />}
            {textLabel7Props !== null && <TextLabel {...textLabel7Props} />}
          </Frame>
          <Frame {...frame2Props}>
            <Frame {...container2Props}>
              {calendarDayProps !== null && (
                <CalendarDay {...calendarDayProps}>
                  {textLabel8Props !== null && <TextLabel {...textLabel8Props} />}
                </CalendarDay>
              )}
              {calendarDayGridCellProps !== null && (
                <CalendarDayGridCell {...calendarDayGridCellProps}>
                  {textLabel9Props !== null && <TextLabel {...textLabel9Props} />}
                </CalendarDayGridCell>
              )}
              {calendarDayGridCell2Props !== null && (
                <CalendarDayGridCell {...calendarDayGridCell2Props}>
                  {textLabel10Props !== null && <TextLabel {...textLabel10Props} />}
                </CalendarDayGridCell>
              )}
            </Frame>
            <Frame {...container3Props}>
              {calendarDayGridCell3Props !== null && (
                <CalendarDayGridCell {...calendarDayGridCell3Props}>
                  {textLabel11Props !== null && <TextLabel {...textLabel11Props} />}
                </CalendarDayGridCell>
              )}
              {calendarDayGridCell4Props !== null && (
                <CalendarDayGridCell {...calendarDayGridCell4Props}>
                  {textLabel12Props !== null && <TextLabel {...textLabel12Props} />}
                </CalendarDayGridCell>
              )}
              {calendarDayGridCell5Props !== null && (
                <CalendarDayGridCell {...calendarDayGridCell5Props}>
                  {textLabel13Props !== null && <TextLabel {...textLabel13Props} />}
                </CalendarDayGridCell>
              )}
              {calendarDayGridCell6Props !== null && (
                <CalendarDayGridCell {...calendarDayGridCell6Props}>
                  {textLabel14Props !== null && <TextLabel {...textLabel14Props} />}
                </CalendarDayGridCell>
              )}
              {calendarDayGridCell7Props !== null && (
                <CalendarDayGridCell {...calendarDayGridCell7Props}>
                  {textLabel15Props !== null && <TextLabel {...textLabel15Props} />}
                </CalendarDayGridCell>
              )}
              {calendarDayGridCell8Props !== null && (
                <CalendarDayGridCell {...calendarDayGridCell8Props}>
                  {textLabel16Props !== null && <TextLabel {...textLabel16Props} />}
                </CalendarDayGridCell>
              )}
              {calendarDayGridCell9Props !== null && (
                <CalendarDayGridCell {...calendarDayGridCell9Props}>
                  {textLabel17Props !== null && <TextLabel {...textLabel17Props} />}
                </CalendarDayGridCell>
              )}
            </Frame>
            <Frame {...container4Props}>
              {calendarDayGridCell10Props !== null && (
                <CalendarDayGridCell {...calendarDayGridCell10Props}>
                  {textLabel18Props !== null && <TextLabel {...textLabel18Props} />}
                </CalendarDayGridCell>
              )}
              {calendarDayGridCell11Props !== null && (
                <CalendarDayGridCell {...calendarDayGridCell11Props}>
                  {textLabel19Props !== null && <TextLabel {...textLabel19Props} />}
                </CalendarDayGridCell>
              )}
              {calendarDayGridCell12Props !== null && (
                <CalendarDayGridCell {...calendarDayGridCell12Props}>
                  {textLabel20Props !== null && <TextLabel {...textLabel20Props} />}
                </CalendarDayGridCell>
              )}
              {calendarDayGridCell13Props !== null && (
                <CalendarDayGridCell {...calendarDayGridCell13Props}>
                  {textLabel21Props !== null && <TextLabel {...textLabel21Props} />}
                </CalendarDayGridCell>
              )}
              {calendarDayGridCell14Props !== null && (
                <CalendarDayGridCell {...calendarDayGridCell14Props}>
                  {textLabel22Props !== null && <TextLabel {...textLabel22Props} />}
                </CalendarDayGridCell>
              )}
              {calendarDayGridCell15Props !== null && (
                <CalendarDayGridCell {...calendarDayGridCell15Props}>
                  {textLabel23Props !== null && <TextLabel {...textLabel23Props} />}
                </CalendarDayGridCell>
              )}
              {calendarDayGridCell16Props !== null && (
                <CalendarDayGridCell {...calendarDayGridCell16Props}>
                  {textLabel24Props !== null && <TextLabel {...textLabel24Props} />}
                </CalendarDayGridCell>
              )}
            </Frame>
            <Frame {...container5Props}>
              {calendarDayGridCell17Props !== null && (
                <CalendarDayGridCell {...calendarDayGridCell17Props}>
                  {textLabel25Props !== null && <TextLabel {...textLabel25Props} />}
                </CalendarDayGridCell>
              )}
              {calendarDayTodayProps !== null && (
                <CalendarDayToday {...calendarDayTodayProps}>
                  {textLabel26Props !== null && <TextLabel {...textLabel26Props} />}
                </CalendarDayToday>
              )}
              {calendarDayGridCell18Props !== null && (
                <CalendarDayGridCell {...calendarDayGridCell18Props}>
                  {textLabel27Props !== null && <TextLabel {...textLabel27Props} />}
                </CalendarDayGridCell>
              )}
              {calendarDaySelectedProps !== null && (
                <CalendarDaySelected {...calendarDaySelectedProps}>
                  {textLabel28Props !== null && <TextLabel {...textLabel28Props} />}
                </CalendarDaySelected>
              )}
              {calendarDayGridCell19Props !== null && (
                <CalendarDayGridCell {...calendarDayGridCell19Props}>
                  {textLabel29Props !== null && <TextLabel {...textLabel29Props} />}
                </CalendarDayGridCell>
              )}
              {calendarDayGridCell20Props !== null && (
                <CalendarDayGridCell {...calendarDayGridCell20Props}>
                  {textLabel30Props !== null && <TextLabel {...textLabel30Props} />}
                </CalendarDayGridCell>
              )}
              {calendarDayGridCell21Props !== null && (
                <CalendarDayGridCell {...calendarDayGridCell21Props}>
                  {textLabel31Props !== null && <TextLabel {...textLabel31Props} />}
                </CalendarDayGridCell>
              )}
            </Frame>
            <Frame {...container6Props}>
              {calendarDayGridCell22Props !== null && (
                <CalendarDayGridCell {...calendarDayGridCell22Props}>
                  {textLabel32Props !== null && <TextLabel {...textLabel32Props} />}
                </CalendarDayGridCell>
              )}
              {calendarDayGridCell23Props !== null && (
                <CalendarDayGridCell {...calendarDayGridCell23Props}>
                  {textLabel33Props !== null && <TextLabel {...textLabel33Props} />}
                </CalendarDayGridCell>
              )}
              {calendarDayGridCell24Props !== null && (
                <CalendarDayGridCell {...calendarDayGridCell24Props}>
                  {textLabel34Props !== null && <TextLabel {...textLabel34Props} />}
                </CalendarDayGridCell>
              )}
              {calendarDayGridCell25Props !== null && (
                <CalendarDayGridCell {...calendarDayGridCell25Props}>
                  {textLabel35Props !== null && <TextLabel {...textLabel35Props} />}
                </CalendarDayGridCell>
              )}
              {calendarDayGridCell26Props !== null && (
                <CalendarDayGridCell {...calendarDayGridCell26Props}>
                  {textLabel36Props !== null && <TextLabel {...textLabel36Props} />}
                </CalendarDayGridCell>
              )}
              {calendarDayGridCell27Props !== null && (
                <CalendarDayGridCell {...calendarDayGridCell27Props}>
                  {textLabel37Props !== null && <TextLabel {...textLabel37Props} />}
                </CalendarDayGridCell>
              )}
              {calendarDayGridCell28Props !== null && (
                <CalendarDayGridCell {...calendarDayGridCell28Props}>
                  {textLabel38Props !== null && <TextLabel {...textLabel38Props} />}
                </CalendarDayGridCell>
              )}
            </Frame>
            <Frame {...container7Props}>
              {calendarDayGridCell29Props !== null && (
                <CalendarDayGridCell {...calendarDayGridCell29Props}>
                  {textLabel39Props !== null && <TextLabel {...textLabel39Props} />}
                </CalendarDayGridCell>
              )}
              {calendarDay2Props !== null && (
                <CalendarDay {...calendarDay2Props}>
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

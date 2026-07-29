/***** * * This code was generated using Seldon (https://github.com/SeldonDigital/seldon) * *
License: https://github.com/SeldonDigital/seldon/blob/main/LICENSE.md * Do not redistribute or
sublicense without permission. * * You may not use this software, or any derivative works of it, in
whole or in part, * for the purposes of training, fine-tuning, or otherwise improving (directly or
indirectly) * any machine learning or artificial intelligence system without written permission. *
*****/

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
 * ```vue
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
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"

import ButtonIconic from "../elements/ButtonIconic.vue"
import CalendarDay from "../elements/CalendarDay.vue"
import CalendarDayGridCell from "../elements/CalendarDayGridCell.vue"
import CalendarDaySelected from "../elements/CalendarDaySelected.vue"
import CalendarDayToday from "../elements/CalendarDayToday.vue"
import Frame from "../frames/Frame.vue"
import TextLabel from "../primitives/TextLabel.vue"
import TextTitle from "../primitives/TextTitle.vue"
import { combineClassNames, mergeOptionalSlot, mergeSlot } from "../utils/class-names"

const props = defineProps<{
  className?: string
  frame?: Record<string, unknown> | null
  buttonIconic?: Record<string, unknown> | null
  icon?: Record<string, unknown> | null
  buttonIconic2?: Record<string, unknown> | null
  icon2?: Record<string, unknown> | null
  textTitle?: Record<string, unknown> | null
  buttonIconic3?: Record<string, unknown> | null
  icon3?: Record<string, unknown> | null
  buttonIconic4?: Record<string, unknown> | null
  icon4?: Record<string, unknown> | null
  container?: Record<string, unknown> | null
  textLabel?: Record<string, unknown> | null
  textLabel2?: Record<string, unknown> | null
  textLabel3?: Record<string, unknown> | null
  textLabel4?: Record<string, unknown> | null
  textLabel5?: Record<string, unknown> | null
  textLabel6?: Record<string, unknown> | null
  textLabel7?: Record<string, unknown> | null
  frame2?: Record<string, unknown> | null
  container2?: Record<string, unknown> | null
  calendarDay?: Record<string, unknown> | null
  textLabel8?: Record<string, unknown> | null
  calendarDayGridCell?: Record<string, unknown> | null
  textLabel9?: Record<string, unknown> | null
  calendarDayGridCell2?: Record<string, unknown> | null
  textLabel10?: Record<string, unknown> | null
  container3?: Record<string, unknown> | null
  calendarDayGridCell3?: Record<string, unknown> | null
  textLabel11?: Record<string, unknown> | null
  calendarDayGridCell4?: Record<string, unknown> | null
  textLabel12?: Record<string, unknown> | null
  calendarDayGridCell5?: Record<string, unknown> | null
  textLabel13?: Record<string, unknown> | null
  calendarDayGridCell6?: Record<string, unknown> | null
  textLabel14?: Record<string, unknown> | null
  calendarDayGridCell7?: Record<string, unknown> | null
  textLabel15?: Record<string, unknown> | null
  calendarDayGridCell8?: Record<string, unknown> | null
  textLabel16?: Record<string, unknown> | null
  calendarDayGridCell9?: Record<string, unknown> | null
  textLabel17?: Record<string, unknown> | null
  container4?: Record<string, unknown> | null
  calendarDayGridCell10?: Record<string, unknown> | null
  textLabel18?: Record<string, unknown> | null
  calendarDayGridCell11?: Record<string, unknown> | null
  textLabel19?: Record<string, unknown> | null
  calendarDayGridCell12?: Record<string, unknown> | null
  textLabel20?: Record<string, unknown> | null
  calendarDayGridCell13?: Record<string, unknown> | null
  textLabel21?: Record<string, unknown> | null
  calendarDayGridCell14?: Record<string, unknown> | null
  textLabel22?: Record<string, unknown> | null
  calendarDayGridCell15?: Record<string, unknown> | null
  textLabel23?: Record<string, unknown> | null
  calendarDayGridCell16?: Record<string, unknown> | null
  textLabel24?: Record<string, unknown> | null
  container5?: Record<string, unknown> | null
  calendarDayGridCell17?: Record<string, unknown> | null
  textLabel25?: Record<string, unknown> | null
  calendarDayToday?: Record<string, unknown> | null
  textLabel26?: Record<string, unknown> | null
  calendarDayGridCell18?: Record<string, unknown> | null
  textLabel27?: Record<string, unknown> | null
  calendarDaySelected?: Record<string, unknown> | null
  textLabel28?: Record<string, unknown> | null
  calendarDayGridCell19?: Record<string, unknown> | null
  textLabel29?: Record<string, unknown> | null
  calendarDayGridCell20?: Record<string, unknown> | null
  textLabel30?: Record<string, unknown> | null
  calendarDayGridCell21?: Record<string, unknown> | null
  textLabel31?: Record<string, unknown> | null
  container6?: Record<string, unknown> | null
  calendarDayGridCell22?: Record<string, unknown> | null
  textLabel32?: Record<string, unknown> | null
  calendarDayGridCell23?: Record<string, unknown> | null
  textLabel33?: Record<string, unknown> | null
  calendarDayGridCell24?: Record<string, unknown> | null
  textLabel34?: Record<string, unknown> | null
  calendarDayGridCell25?: Record<string, unknown> | null
  textLabel35?: Record<string, unknown> | null
  calendarDayGridCell26?: Record<string, unknown> | null
  textLabel36?: Record<string, unknown> | null
  calendarDayGridCell27?: Record<string, unknown> | null
  textLabel37?: Record<string, unknown> | null
  calendarDayGridCell28?: Record<string, unknown> | null
  textLabel38?: Record<string, unknown> | null
  container7?: Record<string, unknown> | null
  calendarDayGridCell29?: Record<string, unknown> | null
  textLabel39?: Record<string, unknown> | null
  calendarDay2?: Record<string, unknown> | null
  textLabel40?: Record<string, unknown> | null
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
    children: "August 2025",
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
    children: "Su",
    className: "sdn-text-label sdn-text-label--sxr5",
  },
  textLabel2: {
    children: "Mo",
    className: "sdn-text-label sdn-text-label--sxr5",
  },
  textLabel3: {
    children: "Tu",
    className: "sdn-text-label sdn-text-label--sxr5",
  },
  textLabel4: {
    children: "We",
    className: "sdn-text-label sdn-text-label--sxr5",
  },
  textLabel5: {
    children: "Th",
    className: "sdn-text-label sdn-text-label--sxr5",
  },
  textLabel6: {
    children: "Fr",
    className: "sdn-text-label sdn-text-label--sxr5",
  },
  textLabel7: {
    children: "Sa",
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
    children: "1",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCell2: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel10: {
    children: "2",
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
    children: "3",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCell4: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel12: {
    children: "4",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCell5: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel13: {
    children: "5",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCell6: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel14: {
    children: "6",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCell7: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel15: {
    children: "7",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCell8: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel16: {
    children: "8",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCell9: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel17: {
    children: "9",
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
    children: "10",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCell11: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel19: {
    children: "11",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCell12: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel20: {
    children: "12",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCell13: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel21: {
    children: "13",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCell14: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel22: {
    children: "14",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCell15: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel23: {
    children: "15",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCell16: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel24: {
    children: "16",
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
    children: "17",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayToday: {
    className: "sdn-calendar-day-today sdn-calendar-day-grid-cell--iysx",
  },
  textLabel26: {
    children: "18",
    className: "sdn-text-label sdn-text-label--bwn4",
  },
  calendarDayGridCell18: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel27: {
    children: "19",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDaySelected: {
    className: "sdn-calendar-day-selected sdn-calendar-day-grid-cell--iysx",
  },
  textLabel28: {
    children: "20",
    className: "sdn-text-label sdn-text-label--fye8",
  },
  calendarDayGridCell19: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel29: {
    children: "21",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCell20: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel30: {
    children: "22",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCell21: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel31: {
    children: "23",
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
    children: "24",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCell23: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel33: {
    children: "25",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCell24: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel34: {
    children: "26",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCell25: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel35: {
    children: "27",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCell26: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel36: {
    children: "28",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCell27: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel37: {
    children: "29",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCell28: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel38: {
    children: "30",
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
    children: "31",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay2: {
    className: "sdn-calendar-day sdn-calendar-day--2hoh",
  },
  textLabel40: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
}

const rootClassName = computed(() => combineClassNames("sdn-calendar", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const frameProps = computed(() => mergeSlot(sdn.frame, props.frame, props.seldonRefs))
const buttonIconicProps = computed(() =>
  mergeOptionalSlot(sdn.buttonIconic, props.buttonIconic, props.seldonRefs),
)
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon, props.seldonRefs))
const buttonIconic2Props = computed(() =>
  mergeOptionalSlot(sdn.buttonIconic2, props.buttonIconic2, props.seldonRefs),
)
const icon2Props = computed(() => mergeSlot(sdn.icon2, props.icon2, props.seldonRefs))
const textTitleProps = computed(() =>
  mergeOptionalSlot(sdn.textTitle, props.textTitle, props.seldonRefs),
)
const buttonIconic3Props = computed(() =>
  mergeOptionalSlot(sdn.buttonIconic3, props.buttonIconic3, props.seldonRefs),
)
const icon3Props = computed(() => mergeSlot(sdn.icon3, props.icon3, props.seldonRefs))
const buttonIconic4Props = computed(() =>
  mergeOptionalSlot(sdn.buttonIconic4, props.buttonIconic4, props.seldonRefs),
)
const icon4Props = computed(() => mergeSlot(sdn.icon4, props.icon4, props.seldonRefs))
const containerProps = computed(() => mergeSlot(sdn.container, props.container, props.seldonRefs))
const textLabelProps = computed(() =>
  mergeOptionalSlot(sdn.textLabel, props.textLabel, props.seldonRefs),
)
const textLabel2Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel2, props.textLabel2, props.seldonRefs),
)
const textLabel3Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel3, props.textLabel3, props.seldonRefs),
)
const textLabel4Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel4, props.textLabel4, props.seldonRefs),
)
const textLabel5Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel5, props.textLabel5, props.seldonRefs),
)
const textLabel6Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel6, props.textLabel6, props.seldonRefs),
)
const textLabel7Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel7, props.textLabel7, props.seldonRefs),
)
const frame2Props = computed(() => mergeSlot(sdn.frame2, props.frame2, props.seldonRefs))
const container2Props = computed(() =>
  mergeSlot(sdn.container2, props.container2, props.seldonRefs),
)
const calendarDayProps = computed(() =>
  mergeOptionalSlot(sdn.calendarDay, props.calendarDay, props.seldonRefs),
)
const textLabel8Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel8, props.textLabel8, props.seldonRefs),
)
const calendarDayGridCellProps = computed(() =>
  mergeOptionalSlot(sdn.calendarDayGridCell, props.calendarDayGridCell, props.seldonRefs),
)
const textLabel9Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel9, props.textLabel9, props.seldonRefs),
)
const calendarDayGridCell2Props = computed(() =>
  mergeOptionalSlot(sdn.calendarDayGridCell2, props.calendarDayGridCell2, props.seldonRefs),
)
const textLabel10Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel10, props.textLabel10, props.seldonRefs),
)
const container3Props = computed(() =>
  mergeSlot(sdn.container3, props.container3, props.seldonRefs),
)
const calendarDayGridCell3Props = computed(() =>
  mergeOptionalSlot(sdn.calendarDayGridCell3, props.calendarDayGridCell3, props.seldonRefs),
)
const textLabel11Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel11, props.textLabel11, props.seldonRefs),
)
const calendarDayGridCell4Props = computed(() =>
  mergeOptionalSlot(sdn.calendarDayGridCell4, props.calendarDayGridCell4, props.seldonRefs),
)
const textLabel12Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel12, props.textLabel12, props.seldonRefs),
)
const calendarDayGridCell5Props = computed(() =>
  mergeOptionalSlot(sdn.calendarDayGridCell5, props.calendarDayGridCell5, props.seldonRefs),
)
const textLabel13Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel13, props.textLabel13, props.seldonRefs),
)
const calendarDayGridCell6Props = computed(() =>
  mergeOptionalSlot(sdn.calendarDayGridCell6, props.calendarDayGridCell6, props.seldonRefs),
)
const textLabel14Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel14, props.textLabel14, props.seldonRefs),
)
const calendarDayGridCell7Props = computed(() =>
  mergeOptionalSlot(sdn.calendarDayGridCell7, props.calendarDayGridCell7, props.seldonRefs),
)
const textLabel15Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel15, props.textLabel15, props.seldonRefs),
)
const calendarDayGridCell8Props = computed(() =>
  mergeOptionalSlot(sdn.calendarDayGridCell8, props.calendarDayGridCell8, props.seldonRefs),
)
const textLabel16Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel16, props.textLabel16, props.seldonRefs),
)
const calendarDayGridCell9Props = computed(() =>
  mergeOptionalSlot(sdn.calendarDayGridCell9, props.calendarDayGridCell9, props.seldonRefs),
)
const textLabel17Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel17, props.textLabel17, props.seldonRefs),
)
const container4Props = computed(() =>
  mergeSlot(sdn.container4, props.container4, props.seldonRefs),
)
const calendarDayGridCell10Props = computed(() =>
  mergeOptionalSlot(sdn.calendarDayGridCell10, props.calendarDayGridCell10, props.seldonRefs),
)
const textLabel18Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel18, props.textLabel18, props.seldonRefs),
)
const calendarDayGridCell11Props = computed(() =>
  mergeOptionalSlot(sdn.calendarDayGridCell11, props.calendarDayGridCell11, props.seldonRefs),
)
const textLabel19Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel19, props.textLabel19, props.seldonRefs),
)
const calendarDayGridCell12Props = computed(() =>
  mergeOptionalSlot(sdn.calendarDayGridCell12, props.calendarDayGridCell12, props.seldonRefs),
)
const textLabel20Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel20, props.textLabel20, props.seldonRefs),
)
const calendarDayGridCell13Props = computed(() =>
  mergeOptionalSlot(sdn.calendarDayGridCell13, props.calendarDayGridCell13, props.seldonRefs),
)
const textLabel21Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel21, props.textLabel21, props.seldonRefs),
)
const calendarDayGridCell14Props = computed(() =>
  mergeOptionalSlot(sdn.calendarDayGridCell14, props.calendarDayGridCell14, props.seldonRefs),
)
const textLabel22Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel22, props.textLabel22, props.seldonRefs),
)
const calendarDayGridCell15Props = computed(() =>
  mergeOptionalSlot(sdn.calendarDayGridCell15, props.calendarDayGridCell15, props.seldonRefs),
)
const textLabel23Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel23, props.textLabel23, props.seldonRefs),
)
const calendarDayGridCell16Props = computed(() =>
  mergeOptionalSlot(sdn.calendarDayGridCell16, props.calendarDayGridCell16, props.seldonRefs),
)
const textLabel24Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel24, props.textLabel24, props.seldonRefs),
)
const container5Props = computed(() =>
  mergeSlot(sdn.container5, props.container5, props.seldonRefs),
)
const calendarDayGridCell17Props = computed(() =>
  mergeOptionalSlot(sdn.calendarDayGridCell17, props.calendarDayGridCell17, props.seldonRefs),
)
const textLabel25Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel25, props.textLabel25, props.seldonRefs),
)
const calendarDayTodayProps = computed(() =>
  mergeOptionalSlot(sdn.calendarDayToday, props.calendarDayToday, props.seldonRefs),
)
const textLabel26Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel26, props.textLabel26, props.seldonRefs),
)
const calendarDayGridCell18Props = computed(() =>
  mergeOptionalSlot(sdn.calendarDayGridCell18, props.calendarDayGridCell18, props.seldonRefs),
)
const textLabel27Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel27, props.textLabel27, props.seldonRefs),
)
const calendarDaySelectedProps = computed(() =>
  mergeOptionalSlot(sdn.calendarDaySelected, props.calendarDaySelected, props.seldonRefs),
)
const textLabel28Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel28, props.textLabel28, props.seldonRefs),
)
const calendarDayGridCell19Props = computed(() =>
  mergeOptionalSlot(sdn.calendarDayGridCell19, props.calendarDayGridCell19, props.seldonRefs),
)
const textLabel29Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel29, props.textLabel29, props.seldonRefs),
)
const calendarDayGridCell20Props = computed(() =>
  mergeOptionalSlot(sdn.calendarDayGridCell20, props.calendarDayGridCell20, props.seldonRefs),
)
const textLabel30Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel30, props.textLabel30, props.seldonRefs),
)
const calendarDayGridCell21Props = computed(() =>
  mergeOptionalSlot(sdn.calendarDayGridCell21, props.calendarDayGridCell21, props.seldonRefs),
)
const textLabel31Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel31, props.textLabel31, props.seldonRefs),
)
const container6Props = computed(() =>
  mergeSlot(sdn.container6, props.container6, props.seldonRefs),
)
const calendarDayGridCell22Props = computed(() =>
  mergeOptionalSlot(sdn.calendarDayGridCell22, props.calendarDayGridCell22, props.seldonRefs),
)
const textLabel32Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel32, props.textLabel32, props.seldonRefs),
)
const calendarDayGridCell23Props = computed(() =>
  mergeOptionalSlot(sdn.calendarDayGridCell23, props.calendarDayGridCell23, props.seldonRefs),
)
const textLabel33Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel33, props.textLabel33, props.seldonRefs),
)
const calendarDayGridCell24Props = computed(() =>
  mergeOptionalSlot(sdn.calendarDayGridCell24, props.calendarDayGridCell24, props.seldonRefs),
)
const textLabel34Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel34, props.textLabel34, props.seldonRefs),
)
const calendarDayGridCell25Props = computed(() =>
  mergeOptionalSlot(sdn.calendarDayGridCell25, props.calendarDayGridCell25, props.seldonRefs),
)
const textLabel35Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel35, props.textLabel35, props.seldonRefs),
)
const calendarDayGridCell26Props = computed(() =>
  mergeOptionalSlot(sdn.calendarDayGridCell26, props.calendarDayGridCell26, props.seldonRefs),
)
const textLabel36Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel36, props.textLabel36, props.seldonRefs),
)
const calendarDayGridCell27Props = computed(() =>
  mergeOptionalSlot(sdn.calendarDayGridCell27, props.calendarDayGridCell27, props.seldonRefs),
)
const textLabel37Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel37, props.textLabel37, props.seldonRefs),
)
const calendarDayGridCell28Props = computed(() =>
  mergeOptionalSlot(sdn.calendarDayGridCell28, props.calendarDayGridCell28, props.seldonRefs),
)
const textLabel38Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel38, props.textLabel38, props.seldonRefs),
)
const container7Props = computed(() =>
  mergeSlot(sdn.container7, props.container7, props.seldonRefs),
)
const calendarDayGridCell29Props = computed(() =>
  mergeOptionalSlot(sdn.calendarDayGridCell29, props.calendarDayGridCell29, props.seldonRefs),
)
const textLabel39Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel39, props.textLabel39, props.seldonRefs),
)
const calendarDay2Props = computed(() =>
  mergeOptionalSlot(sdn.calendarDay2, props.calendarDay2, props.seldonRefs),
)
const textLabel40Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel40, props.textLabel40, props.seldonRefs),
)
</script>

<template>
  <div :class="rootClassName" v-bind="rootAttrs">
    <slot>
      <Frame v-bind="frameProps">
        <ButtonIconic
          v-if="buttonIconicProps !== null"
          v-bind="buttonIconicProps"
          :icon="iconProps"
        />
        <ButtonIconic
          v-if="buttonIconic2Props !== null"
          v-bind="buttonIconic2Props"
          :icon="icon2Props"
        />
        <TextTitle v-if="textTitleProps !== null" v-bind="textTitleProps" />
        <ButtonIconic
          v-if="buttonIconic3Props !== null"
          v-bind="buttonIconic3Props"
          :icon="icon3Props"
        />
        <ButtonIconic
          v-if="buttonIconic4Props !== null"
          v-bind="buttonIconic4Props"
          :icon="icon4Props"
        />
      </Frame>
      <Frame v-bind="containerProps">
        <TextLabel v-if="textLabelProps !== null" v-bind="textLabelProps" />
        <TextLabel v-if="textLabel2Props !== null" v-bind="textLabel2Props" />
        <TextLabel v-if="textLabel3Props !== null" v-bind="textLabel3Props" />
        <TextLabel v-if="textLabel4Props !== null" v-bind="textLabel4Props" />
        <TextLabel v-if="textLabel5Props !== null" v-bind="textLabel5Props" />
        <TextLabel v-if="textLabel6Props !== null" v-bind="textLabel6Props" />
        <TextLabel v-if="textLabel7Props !== null" v-bind="textLabel7Props" />
      </Frame>
      <Frame v-bind="frame2Props">
        <Frame v-bind="container2Props" v-if="container2Props !== null">
          <CalendarDay v-if="calendarDayProps !== null" v-bind="calendarDayProps">
            <TextLabel v-if="textLabel8Props !== null" v-bind="textLabel8Props" />
          </CalendarDay>
          <CalendarDayGridCell
            v-if="calendarDayGridCellProps !== null"
            v-bind="calendarDayGridCellProps"
          >
            <TextLabel v-if="textLabel9Props !== null" v-bind="textLabel9Props" />
          </CalendarDayGridCell>
          <CalendarDayGridCell
            v-if="calendarDayGridCell2Props !== null"
            v-bind="calendarDayGridCell2Props"
          >
            <TextLabel v-if="textLabel10Props !== null" v-bind="textLabel10Props" />
          </CalendarDayGridCell>
        </Frame>
        <Frame v-bind="container3Props" v-if="container3Props !== null">
          <CalendarDayGridCell
            v-if="calendarDayGridCell3Props !== null"
            v-bind="calendarDayGridCell3Props"
          >
            <TextLabel v-if="textLabel11Props !== null" v-bind="textLabel11Props" />
          </CalendarDayGridCell>
          <CalendarDayGridCell
            v-if="calendarDayGridCell4Props !== null"
            v-bind="calendarDayGridCell4Props"
          >
            <TextLabel v-if="textLabel12Props !== null" v-bind="textLabel12Props" />
          </CalendarDayGridCell>
          <CalendarDayGridCell
            v-if="calendarDayGridCell5Props !== null"
            v-bind="calendarDayGridCell5Props"
          >
            <TextLabel v-if="textLabel13Props !== null" v-bind="textLabel13Props" />
          </CalendarDayGridCell>
          <CalendarDayGridCell
            v-if="calendarDayGridCell6Props !== null"
            v-bind="calendarDayGridCell6Props"
          >
            <TextLabel v-if="textLabel14Props !== null" v-bind="textLabel14Props" />
          </CalendarDayGridCell>
          <CalendarDayGridCell
            v-if="calendarDayGridCell7Props !== null"
            v-bind="calendarDayGridCell7Props"
          >
            <TextLabel v-if="textLabel15Props !== null" v-bind="textLabel15Props" />
          </CalendarDayGridCell>
          <CalendarDayGridCell
            v-if="calendarDayGridCell8Props !== null"
            v-bind="calendarDayGridCell8Props"
          >
            <TextLabel v-if="textLabel16Props !== null" v-bind="textLabel16Props" />
          </CalendarDayGridCell>
          <CalendarDayGridCell
            v-if="calendarDayGridCell9Props !== null"
            v-bind="calendarDayGridCell9Props"
          >
            <TextLabel v-if="textLabel17Props !== null" v-bind="textLabel17Props" />
          </CalendarDayGridCell>
        </Frame>
        <Frame v-bind="container4Props" v-if="container4Props !== null">
          <CalendarDayGridCell
            v-if="calendarDayGridCell10Props !== null"
            v-bind="calendarDayGridCell10Props"
          >
            <TextLabel v-if="textLabel18Props !== null" v-bind="textLabel18Props" />
          </CalendarDayGridCell>
          <CalendarDayGridCell
            v-if="calendarDayGridCell11Props !== null"
            v-bind="calendarDayGridCell11Props"
          >
            <TextLabel v-if="textLabel19Props !== null" v-bind="textLabel19Props" />
          </CalendarDayGridCell>
          <CalendarDayGridCell
            v-if="calendarDayGridCell12Props !== null"
            v-bind="calendarDayGridCell12Props"
          >
            <TextLabel v-if="textLabel20Props !== null" v-bind="textLabel20Props" />
          </CalendarDayGridCell>
          <CalendarDayGridCell
            v-if="calendarDayGridCell13Props !== null"
            v-bind="calendarDayGridCell13Props"
          >
            <TextLabel v-if="textLabel21Props !== null" v-bind="textLabel21Props" />
          </CalendarDayGridCell>
          <CalendarDayGridCell
            v-if="calendarDayGridCell14Props !== null"
            v-bind="calendarDayGridCell14Props"
          >
            <TextLabel v-if="textLabel22Props !== null" v-bind="textLabel22Props" />
          </CalendarDayGridCell>
          <CalendarDayGridCell
            v-if="calendarDayGridCell15Props !== null"
            v-bind="calendarDayGridCell15Props"
          >
            <TextLabel v-if="textLabel23Props !== null" v-bind="textLabel23Props" />
          </CalendarDayGridCell>
          <CalendarDayGridCell
            v-if="calendarDayGridCell16Props !== null"
            v-bind="calendarDayGridCell16Props"
          >
            <TextLabel v-if="textLabel24Props !== null" v-bind="textLabel24Props" />
          </CalendarDayGridCell>
        </Frame>
        <Frame v-bind="container5Props" v-if="container5Props !== null">
          <CalendarDayGridCell
            v-if="calendarDayGridCell17Props !== null"
            v-bind="calendarDayGridCell17Props"
          >
            <TextLabel v-if="textLabel25Props !== null" v-bind="textLabel25Props" />
          </CalendarDayGridCell>
          <CalendarDayToday v-if="calendarDayTodayProps !== null" v-bind="calendarDayTodayProps">
            <TextLabel v-if="textLabel26Props !== null" v-bind="textLabel26Props" />
          </CalendarDayToday>
          <CalendarDayGridCell
            v-if="calendarDayGridCell18Props !== null"
            v-bind="calendarDayGridCell18Props"
          >
            <TextLabel v-if="textLabel27Props !== null" v-bind="textLabel27Props" />
          </CalendarDayGridCell>
          <CalendarDaySelected
            v-if="calendarDaySelectedProps !== null"
            v-bind="calendarDaySelectedProps"
          >
            <TextLabel v-if="textLabel28Props !== null" v-bind="textLabel28Props" />
          </CalendarDaySelected>
          <CalendarDayGridCell
            v-if="calendarDayGridCell19Props !== null"
            v-bind="calendarDayGridCell19Props"
          >
            <TextLabel v-if="textLabel29Props !== null" v-bind="textLabel29Props" />
          </CalendarDayGridCell>
          <CalendarDayGridCell
            v-if="calendarDayGridCell20Props !== null"
            v-bind="calendarDayGridCell20Props"
          >
            <TextLabel v-if="textLabel30Props !== null" v-bind="textLabel30Props" />
          </CalendarDayGridCell>
          <CalendarDayGridCell
            v-if="calendarDayGridCell21Props !== null"
            v-bind="calendarDayGridCell21Props"
          >
            <TextLabel v-if="textLabel31Props !== null" v-bind="textLabel31Props" />
          </CalendarDayGridCell>
        </Frame>
        <Frame v-bind="container6Props" v-if="container6Props !== null">
          <CalendarDayGridCell
            v-if="calendarDayGridCell22Props !== null"
            v-bind="calendarDayGridCell22Props"
          >
            <TextLabel v-if="textLabel32Props !== null" v-bind="textLabel32Props" />
          </CalendarDayGridCell>
          <CalendarDayGridCell
            v-if="calendarDayGridCell23Props !== null"
            v-bind="calendarDayGridCell23Props"
          >
            <TextLabel v-if="textLabel33Props !== null" v-bind="textLabel33Props" />
          </CalendarDayGridCell>
          <CalendarDayGridCell
            v-if="calendarDayGridCell24Props !== null"
            v-bind="calendarDayGridCell24Props"
          >
            <TextLabel v-if="textLabel34Props !== null" v-bind="textLabel34Props" />
          </CalendarDayGridCell>
          <CalendarDayGridCell
            v-if="calendarDayGridCell25Props !== null"
            v-bind="calendarDayGridCell25Props"
          >
            <TextLabel v-if="textLabel35Props !== null" v-bind="textLabel35Props" />
          </CalendarDayGridCell>
          <CalendarDayGridCell
            v-if="calendarDayGridCell26Props !== null"
            v-bind="calendarDayGridCell26Props"
          >
            <TextLabel v-if="textLabel36Props !== null" v-bind="textLabel36Props" />
          </CalendarDayGridCell>
          <CalendarDayGridCell
            v-if="calendarDayGridCell27Props !== null"
            v-bind="calendarDayGridCell27Props"
          >
            <TextLabel v-if="textLabel37Props !== null" v-bind="textLabel37Props" />
          </CalendarDayGridCell>
          <CalendarDayGridCell
            v-if="calendarDayGridCell28Props !== null"
            v-bind="calendarDayGridCell28Props"
          >
            <TextLabel v-if="textLabel38Props !== null" v-bind="textLabel38Props" />
          </CalendarDayGridCell>
        </Frame>
        <Frame v-bind="container7Props" v-if="container7Props !== null">
          <CalendarDayGridCell
            v-if="calendarDayGridCell29Props !== null"
            v-bind="calendarDayGridCell29Props"
          >
            <TextLabel v-if="textLabel39Props !== null" v-bind="textLabel39Props" />
          </CalendarDayGridCell>
          <CalendarDay v-if="calendarDay2Props !== null" v-bind="calendarDay2Props">
            <TextLabel v-if="textLabel40Props !== null" v-bind="textLabel40Props" />
          </CalendarDay>
        </Frame>
      </Frame>
    </slot>
  </div>
</template>

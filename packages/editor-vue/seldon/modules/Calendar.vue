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

/*****
 * Calendar: Calendar
 * Level: Module
 * Intent: Month calendar with a navigable header, weekday labels, and a day grid. The default shows a single bordered month; variants cover a two-month range picker and a single month with event markers.
 * Tags: calendar, ui, month, date, navigation, selection, range, events
 * Type: Inline
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
 *****/
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames, mergeSlot } from "../utils/class-names"
import Frame from "../frames/Frame.vue"
import ButtonIconic from "../elements/ButtonIconic.vue"
import CalendarDay from "../elements/CalendarDay.vue"
import CalendarDayGridCell from "../elements/CalendarDayGridCell.vue"
import CalendarDaySelected from "../elements/CalendarDaySelected.vue"
import CalendarDayToday from "../elements/CalendarDayToday.vue"
import TextLabel from "../primitives/TextLabel.vue"
import TextTitle from "../primitives/TextTitle.vue"

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
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "aria-hidden": "false",
  "className": "sdn-calendar",
  "frame": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--8xlb"
  },
  "buttonIconic": {
    "className": "sdn-button-iconic sdn-button-iconic--8tzd"
  },
  "icon": {
    "icon": "material-chevronDoubleLeft",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--nlt7"
  },
  "buttonIconic2": {
    "className": "sdn-button-iconic sdn-button-iconic--8tzd"
  },
  "icon2": {
    "icon": "material-chevronLeft",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--nlt7"
  },
  "textTitle": {
    "className": "sdn-text-title sdn-text-title--blaq"
  },
  "buttonIconic3": {
    "className": "sdn-button-iconic sdn-button-iconic--8tzd"
  },
  "icon3": {
    "icon": "material-chevronRight",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--nlt7"
  },
  "buttonIconic4": {
    "className": "sdn-button-iconic sdn-button-iconic--8tzd"
  },
  "icon4": {
    "icon": "material-chevronDoubleRight",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--nlt7"
  },
  "container": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-container sdn-container--npgy"
  },
  "textLabel": {
    "className": "sdn-text-label sdn-text-label--sxr5"
  },
  "textLabel2": {
    "className": "sdn-text-label sdn-text-label--sxr5"
  },
  "textLabel3": {
    "className": "sdn-text-label sdn-text-label--sxr5"
  },
  "textLabel4": {
    "className": "sdn-text-label sdn-text-label--sxr5"
  },
  "textLabel5": {
    "className": "sdn-text-label sdn-text-label--sxr5"
  },
  "textLabel6": {
    "className": "sdn-text-label sdn-text-label--sxr5"
  },
  "textLabel7": {
    "className": "sdn-text-label sdn-text-label--sxr5"
  },
  "frame2": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--hskv"
  },
  "container2": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-container sdn-container--edpm"
  },
  "calendarDay": {
    "className": "sdn-calendar-day sdn-calendar-day--i3zq"
  },
  "textLabel8": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayGridCell": {
    "className": "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel9": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayGridCell2": {
    "className": "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel10": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "container3": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-container sdn-container--edpm"
  },
  "calendarDayGridCell3": {
    "className": "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel11": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayGridCell4": {
    "className": "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel12": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayGridCell5": {
    "className": "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel13": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayGridCell6": {
    "className": "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel14": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayGridCell7": {
    "className": "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel15": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayGridCell8": {
    "className": "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel16": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayGridCell9": {
    "className": "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel17": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "container4": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-container sdn-container--edpm"
  },
  "calendarDayGridCell10": {
    "className": "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel18": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayGridCell11": {
    "className": "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel19": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayGridCell12": {
    "className": "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel20": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayGridCell13": {
    "className": "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel21": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayGridCell14": {
    "className": "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel22": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayGridCell15": {
    "className": "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel23": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayGridCell16": {
    "className": "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel24": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "container5": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-container sdn-container--edpm"
  },
  "calendarDayGridCell17": {
    "className": "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel25": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayToday": {
    "className": "sdn-calendar-day-today sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel26": {
    "className": "sdn-text-label sdn-text-label--bwn4"
  },
  "calendarDayGridCell18": {
    "className": "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel27": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDaySelected": {
    "className": "sdn-calendar-day-selected sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel28": {
    "className": "sdn-text-label sdn-text-label--fye8"
  },
  "calendarDayGridCell19": {
    "className": "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel29": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayGridCell20": {
    "className": "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel30": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayGridCell21": {
    "className": "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel31": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "container6": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-container sdn-container--edpm"
  },
  "calendarDayGridCell22": {
    "className": "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel32": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayGridCell23": {
    "className": "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel33": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayGridCell24": {
    "className": "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel34": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayGridCell25": {
    "className": "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel35": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayGridCell26": {
    "className": "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel36": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayGridCell27": {
    "className": "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel37": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayGridCell28": {
    "className": "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel38": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "container7": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-container sdn-container--edpm"
  },
  "calendarDayGridCell29": {
    "className": "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel39": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay2": {
    "className": "sdn-calendar-day sdn-calendar-day--2hoh"
  },
  "textLabel40": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-calendar", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const frameProps = computed(() => mergeSlot(sdn.frame, props.frame))
const buttonIconicProps = computed(() => mergeSlot(sdn.buttonIconic, props.buttonIconic))
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon))
const buttonIconic2Props = computed(() => mergeSlot(sdn.buttonIconic2, props.buttonIconic2))
const icon2Props = computed(() => mergeSlot(sdn.icon2, props.icon2))
const textTitleProps = computed(() => mergeSlot(sdn.textTitle, props.textTitle))
const buttonIconic3Props = computed(() => mergeSlot(sdn.buttonIconic3, props.buttonIconic3))
const icon3Props = computed(() => mergeSlot(sdn.icon3, props.icon3))
const buttonIconic4Props = computed(() => mergeSlot(sdn.buttonIconic4, props.buttonIconic4))
const icon4Props = computed(() => mergeSlot(sdn.icon4, props.icon4))
const containerProps = computed(() => mergeSlot(sdn.container, props.container))
const textLabelProps = computed(() => mergeSlot(sdn.textLabel, props.textLabel))
const textLabel2Props = computed(() => mergeSlot(sdn.textLabel2, props.textLabel2))
const textLabel3Props = computed(() => mergeSlot(sdn.textLabel3, props.textLabel3))
const textLabel4Props = computed(() => mergeSlot(sdn.textLabel4, props.textLabel4))
const textLabel5Props = computed(() => mergeSlot(sdn.textLabel5, props.textLabel5))
const textLabel6Props = computed(() => mergeSlot(sdn.textLabel6, props.textLabel6))
const textLabel7Props = computed(() => mergeSlot(sdn.textLabel7, props.textLabel7))
const frame2Props = computed(() => mergeSlot(sdn.frame2, props.frame2))
const container2Props = computed(() => mergeSlot(sdn.container2, props.container2))
const calendarDayProps = computed(() => mergeSlot(sdn.calendarDay, props.calendarDay))
const textLabel8Props = computed(() => mergeSlot(sdn.textLabel8, props.textLabel8))
const calendarDayGridCellProps = computed(() => mergeSlot(sdn.calendarDayGridCell, props.calendarDayGridCell))
const textLabel9Props = computed(() => mergeSlot(sdn.textLabel9, props.textLabel9))
const calendarDayGridCell2Props = computed(() => mergeSlot(sdn.calendarDayGridCell2, props.calendarDayGridCell2))
const textLabel10Props = computed(() => mergeSlot(sdn.textLabel10, props.textLabel10))
const container3Props = computed(() => mergeSlot(sdn.container3, props.container3))
const calendarDayGridCell3Props = computed(() => mergeSlot(sdn.calendarDayGridCell3, props.calendarDayGridCell3))
const textLabel11Props = computed(() => mergeSlot(sdn.textLabel11, props.textLabel11))
const calendarDayGridCell4Props = computed(() => mergeSlot(sdn.calendarDayGridCell4, props.calendarDayGridCell4))
const textLabel12Props = computed(() => mergeSlot(sdn.textLabel12, props.textLabel12))
const calendarDayGridCell5Props = computed(() => mergeSlot(sdn.calendarDayGridCell5, props.calendarDayGridCell5))
const textLabel13Props = computed(() => mergeSlot(sdn.textLabel13, props.textLabel13))
const calendarDayGridCell6Props = computed(() => mergeSlot(sdn.calendarDayGridCell6, props.calendarDayGridCell6))
const textLabel14Props = computed(() => mergeSlot(sdn.textLabel14, props.textLabel14))
const calendarDayGridCell7Props = computed(() => mergeSlot(sdn.calendarDayGridCell7, props.calendarDayGridCell7))
const textLabel15Props = computed(() => mergeSlot(sdn.textLabel15, props.textLabel15))
const calendarDayGridCell8Props = computed(() => mergeSlot(sdn.calendarDayGridCell8, props.calendarDayGridCell8))
const textLabel16Props = computed(() => mergeSlot(sdn.textLabel16, props.textLabel16))
const calendarDayGridCell9Props = computed(() => mergeSlot(sdn.calendarDayGridCell9, props.calendarDayGridCell9))
const textLabel17Props = computed(() => mergeSlot(sdn.textLabel17, props.textLabel17))
const container4Props = computed(() => mergeSlot(sdn.container4, props.container4))
const calendarDayGridCell10Props = computed(() => mergeSlot(sdn.calendarDayGridCell10, props.calendarDayGridCell10))
const textLabel18Props = computed(() => mergeSlot(sdn.textLabel18, props.textLabel18))
const calendarDayGridCell11Props = computed(() => mergeSlot(sdn.calendarDayGridCell11, props.calendarDayGridCell11))
const textLabel19Props = computed(() => mergeSlot(sdn.textLabel19, props.textLabel19))
const calendarDayGridCell12Props = computed(() => mergeSlot(sdn.calendarDayGridCell12, props.calendarDayGridCell12))
const textLabel20Props = computed(() => mergeSlot(sdn.textLabel20, props.textLabel20))
const calendarDayGridCell13Props = computed(() => mergeSlot(sdn.calendarDayGridCell13, props.calendarDayGridCell13))
const textLabel21Props = computed(() => mergeSlot(sdn.textLabel21, props.textLabel21))
const calendarDayGridCell14Props = computed(() => mergeSlot(sdn.calendarDayGridCell14, props.calendarDayGridCell14))
const textLabel22Props = computed(() => mergeSlot(sdn.textLabel22, props.textLabel22))
const calendarDayGridCell15Props = computed(() => mergeSlot(sdn.calendarDayGridCell15, props.calendarDayGridCell15))
const textLabel23Props = computed(() => mergeSlot(sdn.textLabel23, props.textLabel23))
const calendarDayGridCell16Props = computed(() => mergeSlot(sdn.calendarDayGridCell16, props.calendarDayGridCell16))
const textLabel24Props = computed(() => mergeSlot(sdn.textLabel24, props.textLabel24))
const container5Props = computed(() => mergeSlot(sdn.container5, props.container5))
const calendarDayGridCell17Props = computed(() => mergeSlot(sdn.calendarDayGridCell17, props.calendarDayGridCell17))
const textLabel25Props = computed(() => mergeSlot(sdn.textLabel25, props.textLabel25))
const calendarDayTodayProps = computed(() => mergeSlot(sdn.calendarDayToday, props.calendarDayToday))
const textLabel26Props = computed(() => mergeSlot(sdn.textLabel26, props.textLabel26))
const calendarDayGridCell18Props = computed(() => mergeSlot(sdn.calendarDayGridCell18, props.calendarDayGridCell18))
const textLabel27Props = computed(() => mergeSlot(sdn.textLabel27, props.textLabel27))
const calendarDaySelectedProps = computed(() => mergeSlot(sdn.calendarDaySelected, props.calendarDaySelected))
const textLabel28Props = computed(() => mergeSlot(sdn.textLabel28, props.textLabel28))
const calendarDayGridCell19Props = computed(() => mergeSlot(sdn.calendarDayGridCell19, props.calendarDayGridCell19))
const textLabel29Props = computed(() => mergeSlot(sdn.textLabel29, props.textLabel29))
const calendarDayGridCell20Props = computed(() => mergeSlot(sdn.calendarDayGridCell20, props.calendarDayGridCell20))
const textLabel30Props = computed(() => mergeSlot(sdn.textLabel30, props.textLabel30))
const calendarDayGridCell21Props = computed(() => mergeSlot(sdn.calendarDayGridCell21, props.calendarDayGridCell21))
const textLabel31Props = computed(() => mergeSlot(sdn.textLabel31, props.textLabel31))
const container6Props = computed(() => mergeSlot(sdn.container6, props.container6))
const calendarDayGridCell22Props = computed(() => mergeSlot(sdn.calendarDayGridCell22, props.calendarDayGridCell22))
const textLabel32Props = computed(() => mergeSlot(sdn.textLabel32, props.textLabel32))
const calendarDayGridCell23Props = computed(() => mergeSlot(sdn.calendarDayGridCell23, props.calendarDayGridCell23))
const textLabel33Props = computed(() => mergeSlot(sdn.textLabel33, props.textLabel33))
const calendarDayGridCell24Props = computed(() => mergeSlot(sdn.calendarDayGridCell24, props.calendarDayGridCell24))
const textLabel34Props = computed(() => mergeSlot(sdn.textLabel34, props.textLabel34))
const calendarDayGridCell25Props = computed(() => mergeSlot(sdn.calendarDayGridCell25, props.calendarDayGridCell25))
const textLabel35Props = computed(() => mergeSlot(sdn.textLabel35, props.textLabel35))
const calendarDayGridCell26Props = computed(() => mergeSlot(sdn.calendarDayGridCell26, props.calendarDayGridCell26))
const textLabel36Props = computed(() => mergeSlot(sdn.textLabel36, props.textLabel36))
const calendarDayGridCell27Props = computed(() => mergeSlot(sdn.calendarDayGridCell27, props.calendarDayGridCell27))
const textLabel37Props = computed(() => mergeSlot(sdn.textLabel37, props.textLabel37))
const calendarDayGridCell28Props = computed(() => mergeSlot(sdn.calendarDayGridCell28, props.calendarDayGridCell28))
const textLabel38Props = computed(() => mergeSlot(sdn.textLabel38, props.textLabel38))
const container7Props = computed(() => mergeSlot(sdn.container7, props.container7))
const calendarDayGridCell29Props = computed(() => mergeSlot(sdn.calendarDayGridCell29, props.calendarDayGridCell29))
const textLabel39Props = computed(() => mergeSlot(sdn.textLabel39, props.textLabel39))
const calendarDay2Props = computed(() => mergeSlot(sdn.calendarDay2, props.calendarDay2))
const textLabel40Props = computed(() => mergeSlot(sdn.textLabel40, props.textLabel40))
</script>

<template>
    <div :class="rootClassName" v-bind="rootAttrs">
      <slot>
        <Frame v-bind="frameProps">
          <ButtonIconic v-if="buttonIconic && buttonIconicProps" v-bind="buttonIconicProps" :icon="iconProps" />
          <ButtonIconic v-if="buttonIconic2 && buttonIconic2Props" v-bind="buttonIconic2Props" :icon="icon2Props" />
          <TextTitle v-if="textTitle && textTitleProps" v-bind="textTitleProps" />
          <ButtonIconic v-if="buttonIconic3 && buttonIconic3Props" v-bind="buttonIconic3Props" :icon="icon3Props" />
          <ButtonIconic v-if="buttonIconic4 && buttonIconic4Props" v-bind="buttonIconic4Props" :icon="icon4Props" />
        </Frame>
        <Frame v-bind="containerProps">
          <TextLabel v-if="textLabel && textLabelProps" v-bind="textLabelProps" />
          <TextLabel v-if="textLabel2 && textLabel2Props" v-bind="textLabel2Props" />
          <TextLabel v-if="textLabel3 && textLabel3Props" v-bind="textLabel3Props" />
          <TextLabel v-if="textLabel4 && textLabel4Props" v-bind="textLabel4Props" />
          <TextLabel v-if="textLabel5 && textLabel5Props" v-bind="textLabel5Props" />
          <TextLabel v-if="textLabel6 && textLabel6Props" v-bind="textLabel6Props" />
          <TextLabel v-if="textLabel7 && textLabel7Props" v-bind="textLabel7Props" />
        </Frame>
        <Frame v-bind="frame2Props">
          <Frame v-bind="container2Props" v-if="container2">
            <CalendarDay v-if="calendarDay && calendarDayProps" v-bind="calendarDayProps">
              <TextLabel v-if="textLabel8 && textLabel8Props" v-bind="textLabel8Props" />
            </CalendarDay>
            <CalendarDayGridCell v-if="calendarDayGridCell && calendarDayGridCellProps" v-bind="calendarDayGridCellProps">
              <TextLabel v-if="textLabel9 && textLabel9Props" v-bind="textLabel9Props" />
            </CalendarDayGridCell>
            <CalendarDayGridCell v-if="calendarDayGridCell2 && calendarDayGridCell2Props" v-bind="calendarDayGridCell2Props">
              <TextLabel v-if="textLabel10 && textLabel10Props" v-bind="textLabel10Props" />
            </CalendarDayGridCell>
          </Frame>
          <Frame v-bind="container3Props" v-if="container3">
            <CalendarDayGridCell v-if="calendarDayGridCell3 && calendarDayGridCell3Props" v-bind="calendarDayGridCell3Props">
              <TextLabel v-if="textLabel11 && textLabel11Props" v-bind="textLabel11Props" />
            </CalendarDayGridCell>
            <CalendarDayGridCell v-if="calendarDayGridCell4 && calendarDayGridCell4Props" v-bind="calendarDayGridCell4Props">
              <TextLabel v-if="textLabel12 && textLabel12Props" v-bind="textLabel12Props" />
            </CalendarDayGridCell>
            <CalendarDayGridCell v-if="calendarDayGridCell5 && calendarDayGridCell5Props" v-bind="calendarDayGridCell5Props">
              <TextLabel v-if="textLabel13 && textLabel13Props" v-bind="textLabel13Props" />
            </CalendarDayGridCell>
            <CalendarDayGridCell v-if="calendarDayGridCell6 && calendarDayGridCell6Props" v-bind="calendarDayGridCell6Props">
              <TextLabel v-if="textLabel14 && textLabel14Props" v-bind="textLabel14Props" />
            </CalendarDayGridCell>
            <CalendarDayGridCell v-if="calendarDayGridCell7 && calendarDayGridCell7Props" v-bind="calendarDayGridCell7Props">
              <TextLabel v-if="textLabel15 && textLabel15Props" v-bind="textLabel15Props" />
            </CalendarDayGridCell>
            <CalendarDayGridCell v-if="calendarDayGridCell8 && calendarDayGridCell8Props" v-bind="calendarDayGridCell8Props">
              <TextLabel v-if="textLabel16 && textLabel16Props" v-bind="textLabel16Props" />
            </CalendarDayGridCell>
            <CalendarDayGridCell v-if="calendarDayGridCell9 && calendarDayGridCell9Props" v-bind="calendarDayGridCell9Props">
              <TextLabel v-if="textLabel17 && textLabel17Props" v-bind="textLabel17Props" />
            </CalendarDayGridCell>
          </Frame>
          <Frame v-bind="container4Props" v-if="container4">
            <CalendarDayGridCell v-if="calendarDayGridCell10 && calendarDayGridCell10Props" v-bind="calendarDayGridCell10Props">
              <TextLabel v-if="textLabel18 && textLabel18Props" v-bind="textLabel18Props" />
            </CalendarDayGridCell>
            <CalendarDayGridCell v-if="calendarDayGridCell11 && calendarDayGridCell11Props" v-bind="calendarDayGridCell11Props">
              <TextLabel v-if="textLabel19 && textLabel19Props" v-bind="textLabel19Props" />
            </CalendarDayGridCell>
            <CalendarDayGridCell v-if="calendarDayGridCell12 && calendarDayGridCell12Props" v-bind="calendarDayGridCell12Props">
              <TextLabel v-if="textLabel20 && textLabel20Props" v-bind="textLabel20Props" />
            </CalendarDayGridCell>
            <CalendarDayGridCell v-if="calendarDayGridCell13 && calendarDayGridCell13Props" v-bind="calendarDayGridCell13Props">
              <TextLabel v-if="textLabel21 && textLabel21Props" v-bind="textLabel21Props" />
            </CalendarDayGridCell>
            <CalendarDayGridCell v-if="calendarDayGridCell14 && calendarDayGridCell14Props" v-bind="calendarDayGridCell14Props">
              <TextLabel v-if="textLabel22 && textLabel22Props" v-bind="textLabel22Props" />
            </CalendarDayGridCell>
            <CalendarDayGridCell v-if="calendarDayGridCell15 && calendarDayGridCell15Props" v-bind="calendarDayGridCell15Props">
              <TextLabel v-if="textLabel23 && textLabel23Props" v-bind="textLabel23Props" />
            </CalendarDayGridCell>
            <CalendarDayGridCell v-if="calendarDayGridCell16 && calendarDayGridCell16Props" v-bind="calendarDayGridCell16Props">
              <TextLabel v-if="textLabel24 && textLabel24Props" v-bind="textLabel24Props" />
            </CalendarDayGridCell>
          </Frame>
          <Frame v-bind="container5Props" v-if="container5">
            <CalendarDayGridCell v-if="calendarDayGridCell17 && calendarDayGridCell17Props" v-bind="calendarDayGridCell17Props">
              <TextLabel v-if="textLabel25 && textLabel25Props" v-bind="textLabel25Props" />
            </CalendarDayGridCell>
            <CalendarDayToday v-if="calendarDayToday && calendarDayTodayProps" v-bind="calendarDayTodayProps">
              <TextLabel v-if="textLabel26 && textLabel26Props" v-bind="textLabel26Props" />
            </CalendarDayToday>
            <CalendarDayGridCell v-if="calendarDayGridCell18 && calendarDayGridCell18Props" v-bind="calendarDayGridCell18Props">
              <TextLabel v-if="textLabel27 && textLabel27Props" v-bind="textLabel27Props" />
            </CalendarDayGridCell>
            <CalendarDaySelected v-if="calendarDaySelected && calendarDaySelectedProps" v-bind="calendarDaySelectedProps">
              <TextLabel v-if="textLabel28 && textLabel28Props" v-bind="textLabel28Props" />
            </CalendarDaySelected>
            <CalendarDayGridCell v-if="calendarDayGridCell19 && calendarDayGridCell19Props" v-bind="calendarDayGridCell19Props">
              <TextLabel v-if="textLabel29 && textLabel29Props" v-bind="textLabel29Props" />
            </CalendarDayGridCell>
            <CalendarDayGridCell v-if="calendarDayGridCell20 && calendarDayGridCell20Props" v-bind="calendarDayGridCell20Props">
              <TextLabel v-if="textLabel30 && textLabel30Props" v-bind="textLabel30Props" />
            </CalendarDayGridCell>
            <CalendarDayGridCell v-if="calendarDayGridCell21 && calendarDayGridCell21Props" v-bind="calendarDayGridCell21Props">
              <TextLabel v-if="textLabel31 && textLabel31Props" v-bind="textLabel31Props" />
            </CalendarDayGridCell>
          </Frame>
          <Frame v-bind="container6Props" v-if="container6">
            <CalendarDayGridCell v-if="calendarDayGridCell22 && calendarDayGridCell22Props" v-bind="calendarDayGridCell22Props">
              <TextLabel v-if="textLabel32 && textLabel32Props" v-bind="textLabel32Props" />
            </CalendarDayGridCell>
            <CalendarDayGridCell v-if="calendarDayGridCell23 && calendarDayGridCell23Props" v-bind="calendarDayGridCell23Props">
              <TextLabel v-if="textLabel33 && textLabel33Props" v-bind="textLabel33Props" />
            </CalendarDayGridCell>
            <CalendarDayGridCell v-if="calendarDayGridCell24 && calendarDayGridCell24Props" v-bind="calendarDayGridCell24Props">
              <TextLabel v-if="textLabel34 && textLabel34Props" v-bind="textLabel34Props" />
            </CalendarDayGridCell>
            <CalendarDayGridCell v-if="calendarDayGridCell25 && calendarDayGridCell25Props" v-bind="calendarDayGridCell25Props">
              <TextLabel v-if="textLabel35 && textLabel35Props" v-bind="textLabel35Props" />
            </CalendarDayGridCell>
            <CalendarDayGridCell v-if="calendarDayGridCell26 && calendarDayGridCell26Props" v-bind="calendarDayGridCell26Props">
              <TextLabel v-if="textLabel36 && textLabel36Props" v-bind="textLabel36Props" />
            </CalendarDayGridCell>
            <CalendarDayGridCell v-if="calendarDayGridCell27 && calendarDayGridCell27Props" v-bind="calendarDayGridCell27Props">
              <TextLabel v-if="textLabel37 && textLabel37Props" v-bind="textLabel37Props" />
            </CalendarDayGridCell>
            <CalendarDayGridCell v-if="calendarDayGridCell28 && calendarDayGridCell28Props" v-bind="calendarDayGridCell28Props">
              <TextLabel v-if="textLabel38 && textLabel38Props" v-bind="textLabel38Props" />
            </CalendarDayGridCell>
          </Frame>
          <Frame v-bind="container7Props" v-if="container7">
            <CalendarDayGridCell v-if="calendarDayGridCell29 && calendarDayGridCell29Props" v-bind="calendarDayGridCell29Props">
              <TextLabel v-if="textLabel39 && textLabel39Props" v-bind="textLabel39Props" />
            </CalendarDayGridCell>
            <CalendarDay v-if="calendarDay2 && calendarDay2Props" v-bind="calendarDay2Props">
              <TextLabel v-if="textLabel40 && textLabel40Props" v-bind="textLabel40Props" />
            </CalendarDay>
          </Frame>
        </Frame>
      </slot>
    </div>
</template>

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
 * ```vue
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
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames, mergeSlot, mergeOptionalSlot } from "../utils/class-names"
import Frame from "../frames/Frame.vue"
import ButtonIconic from "../elements/ButtonIconic.vue"
import CalendarDay from "../elements/CalendarDay.vue"
import CalendarDayMuted from "../elements/CalendarDayMuted.vue"
import CalendarDaySelected from "../elements/CalendarDaySelected.vue"
import TextLabel from "../primitives/TextLabel.vue"

const props = defineProps<{
  className?: string
  frame?: Record<string, unknown> | null
  textLabel?: Record<string, unknown> | null
  buttonIconic?: Record<string, unknown> | null
  icon?: Record<string, unknown> | null
  buttonIconic2?: Record<string, unknown> | null
  icon2?: Record<string, unknown> | null
  container?: Record<string, unknown> | null
  textLabel2?: Record<string, unknown> | null
  textLabel3?: Record<string, unknown> | null
  textLabel4?: Record<string, unknown> | null
  textLabel5?: Record<string, unknown> | null
  textLabel6?: Record<string, unknown> | null
  textLabel7?: Record<string, unknown> | null
  textLabel8?: Record<string, unknown> | null
  frame2?: Record<string, unknown> | null
  container2?: Record<string, unknown> | null
  calendarDayMuted?: Record<string, unknown> | null
  textLabel9?: Record<string, unknown> | null
  calendarDaySelected?: Record<string, unknown> | null
  textLabel10?: Record<string, unknown> | null
  textLabel11?: Record<string, unknown> | null
  calendarDay?: Record<string, unknown> | null
  textLabel12?: Record<string, unknown> | null
  calendarDay2?: Record<string, unknown> | null
  textLabel13?: Record<string, unknown> | null
  calendarDay3?: Record<string, unknown> | null
  textLabel14?: Record<string, unknown> | null
  calendarDay4?: Record<string, unknown> | null
  textLabel15?: Record<string, unknown> | null
  calendarDayMuted2?: Record<string, unknown> | null
  textLabel16?: Record<string, unknown> | null
  container3?: Record<string, unknown> | null
  calendarDayMuted3?: Record<string, unknown> | null
  textLabel17?: Record<string, unknown> | null
  calendarDayMuted4?: Record<string, unknown> | null
  textLabel18?: Record<string, unknown> | null
  calendarDayMuted5?: Record<string, unknown> | null
  textLabel19?: Record<string, unknown> | null
  calendarDayMuted6?: Record<string, unknown> | null
  textLabel20?: Record<string, unknown> | null
  calendarDayMuted7?: Record<string, unknown> | null
  textLabel21?: Record<string, unknown> | null
  calendarDayMuted8?: Record<string, unknown> | null
  textLabel22?: Record<string, unknown> | null
  calendarDayMuted9?: Record<string, unknown> | null
  textLabel23?: Record<string, unknown> | null
  container4?: Record<string, unknown> | null
  calendarDayMuted10?: Record<string, unknown> | null
  textLabel24?: Record<string, unknown> | null
  calendarDayMuted11?: Record<string, unknown> | null
  textLabel25?: Record<string, unknown> | null
  calendarDayMuted12?: Record<string, unknown> | null
  textLabel26?: Record<string, unknown> | null
  calendarDayMuted13?: Record<string, unknown> | null
  textLabel27?: Record<string, unknown> | null
  calendarDayMuted14?: Record<string, unknown> | null
  textLabel28?: Record<string, unknown> | null
  calendarDayMuted15?: Record<string, unknown> | null
  textLabel29?: Record<string, unknown> | null
  calendarDayMuted16?: Record<string, unknown> | null
  textLabel30?: Record<string, unknown> | null
  container5?: Record<string, unknown> | null
  calendarDayMuted17?: Record<string, unknown> | null
  textLabel31?: Record<string, unknown> | null
  calendarDayMuted18?: Record<string, unknown> | null
  textLabel32?: Record<string, unknown> | null
  calendarDayMuted19?: Record<string, unknown> | null
  textLabel33?: Record<string, unknown> | null
  calendarDayMuted20?: Record<string, unknown> | null
  textLabel34?: Record<string, unknown> | null
  calendarDayMuted21?: Record<string, unknown> | null
  textLabel35?: Record<string, unknown> | null
  calendarDayMuted22?: Record<string, unknown> | null
  textLabel36?: Record<string, unknown> | null
  calendarDayMuted23?: Record<string, unknown> | null
  textLabel37?: Record<string, unknown> | null
  container6?: Record<string, unknown> | null
  calendarDayMuted24?: Record<string, unknown> | null
  textLabel38?: Record<string, unknown> | null
  calendarDayMuted25?: Record<string, unknown> | null
  textLabel39?: Record<string, unknown> | null
  calendarDay5?: Record<string, unknown> | null
  textLabel40?: Record<string, unknown> | null
  seldonRefs?: Record<string, Record<string, unknown>>
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "aria-hidden": "false",
  "frame": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--8xlb"
  },
  "textLabel": {
    "className": "sdn-text-label sdn-text-label--ulqg"
  },
  "buttonIconic": {
    "className": "sdn-button-iconic sdn-button-iconic--8tzd"
  },
  "icon": {
    "icon": "material-chevronLeft",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--fgqd"
  },
  "buttonIconic2": {
    "className": "sdn-button-iconic sdn-button-iconic--8tzd"
  },
  "icon2": {
    "icon": "material-chevronRight",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--fgqd"
  },
  "container": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-container sdn-container--npgy"
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
  "textLabel8": {
    "className": "sdn-text-label sdn-text-label--sxr5"
  },
  "frame2": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--xyjz"
  },
  "container2": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-container sdn-container--npgy"
  },
  "calendarDayMuted": {
    "className": "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7"
  },
  "textLabel9": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDaySelected": {
    "className": "sdn-calendar-day-selected sdn-calendar-day-muted--tzv7"
  },
  "textLabel10": {
    "className": "sdn-text-label sdn-text-label--fye8"
  },
  "textLabel11": {
    "className": "sdn-text-label sdn-text-label--yw9b"
  },
  "calendarDay": {
    "className": "sdn-calendar-day sdn-calendar-day-muted--tzv7"
  },
  "textLabel12": {
    "className": "sdn-text-label sdn-text-label--bwn4"
  },
  "calendarDay2": {
    "className": "sdn-calendar-day sdn-calendar-day-muted--tzv7"
  },
  "textLabel13": {
    "className": "sdn-text-label sdn-text-label--bwn4"
  },
  "calendarDay3": {
    "className": "sdn-calendar-day sdn-calendar-day-muted--tzv7"
  },
  "textLabel14": {
    "className": "sdn-text-label sdn-text-label--bwn4"
  },
  "calendarDay4": {
    "className": "sdn-calendar-day sdn-calendar-day-muted--tzv7"
  },
  "textLabel15": {
    "className": "sdn-text-label sdn-text-label--bwn4"
  },
  "calendarDayMuted2": {
    "className": "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7"
  },
  "textLabel16": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "container3": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-container sdn-container--npgy"
  },
  "calendarDayMuted3": {
    "className": "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7"
  },
  "textLabel17": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayMuted4": {
    "className": "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7"
  },
  "textLabel18": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayMuted5": {
    "className": "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7"
  },
  "textLabel19": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayMuted6": {
    "className": "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7"
  },
  "textLabel20": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayMuted7": {
    "className": "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7"
  },
  "textLabel21": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayMuted8": {
    "className": "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7"
  },
  "textLabel22": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayMuted9": {
    "className": "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7"
  },
  "textLabel23": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "container4": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-container sdn-container--npgy"
  },
  "calendarDayMuted10": {
    "className": "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7"
  },
  "textLabel24": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayMuted11": {
    "className": "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7"
  },
  "textLabel25": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayMuted12": {
    "className": "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7"
  },
  "textLabel26": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayMuted13": {
    "className": "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7"
  },
  "textLabel27": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayMuted14": {
    "className": "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7"
  },
  "textLabel28": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayMuted15": {
    "className": "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7"
  },
  "textLabel29": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayMuted16": {
    "className": "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7"
  },
  "textLabel30": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "container5": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-container sdn-container--npgy"
  },
  "calendarDayMuted17": {
    "className": "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7"
  },
  "textLabel31": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayMuted18": {
    "className": "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7"
  },
  "textLabel32": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayMuted19": {
    "className": "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7"
  },
  "textLabel33": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayMuted20": {
    "className": "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7"
  },
  "textLabel34": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayMuted21": {
    "className": "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7"
  },
  "textLabel35": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayMuted22": {
    "className": "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7"
  },
  "textLabel36": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayMuted23": {
    "className": "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7"
  },
  "textLabel37": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "container6": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-container sdn-container--npgy"
  },
  "calendarDayMuted24": {
    "className": "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7"
  },
  "textLabel38": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayMuted25": {
    "className": "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7"
  },
  "textLabel39": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay5": {
    "className": "sdn-calendar-day sdn-calendar-day--i3zq"
  },
  "textLabel40": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-calendar", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const frameProps = computed(() => mergeSlot(sdn.frame, props.frame, props.seldonRefs))
const textLabelProps = computed(() => mergeOptionalSlot(sdn.textLabel, props.textLabel, props.seldonRefs))
const buttonIconicProps = computed(() => mergeOptionalSlot(sdn.buttonIconic, props.buttonIconic, props.seldonRefs))
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon, props.seldonRefs))
const buttonIconic2Props = computed(() => mergeOptionalSlot(sdn.buttonIconic2, props.buttonIconic2, props.seldonRefs))
const icon2Props = computed(() => mergeSlot(sdn.icon2, props.icon2, props.seldonRefs))
const containerProps = computed(() => mergeSlot(sdn.container, props.container, props.seldonRefs))
const textLabel2Props = computed(() => mergeOptionalSlot(sdn.textLabel2, props.textLabel2, props.seldonRefs))
const textLabel3Props = computed(() => mergeOptionalSlot(sdn.textLabel3, props.textLabel3, props.seldonRefs))
const textLabel4Props = computed(() => mergeOptionalSlot(sdn.textLabel4, props.textLabel4, props.seldonRefs))
const textLabel5Props = computed(() => mergeOptionalSlot(sdn.textLabel5, props.textLabel5, props.seldonRefs))
const textLabel6Props = computed(() => mergeOptionalSlot(sdn.textLabel6, props.textLabel6, props.seldonRefs))
const textLabel7Props = computed(() => mergeOptionalSlot(sdn.textLabel7, props.textLabel7, props.seldonRefs))
const textLabel8Props = computed(() => mergeOptionalSlot(sdn.textLabel8, props.textLabel8, props.seldonRefs))
const frame2Props = computed(() => mergeSlot(sdn.frame2, props.frame2, props.seldonRefs))
const container2Props = computed(() => mergeSlot(sdn.container2, props.container2, props.seldonRefs))
const calendarDayMutedProps = computed(() => mergeOptionalSlot(sdn.calendarDayMuted, props.calendarDayMuted, props.seldonRefs))
const textLabel9Props = computed(() => mergeOptionalSlot(sdn.textLabel9, props.textLabel9, props.seldonRefs))
const calendarDaySelectedProps = computed(() => mergeOptionalSlot(sdn.calendarDaySelected, props.calendarDaySelected, props.seldonRefs))
const textLabel10Props = computed(() => mergeOptionalSlot(sdn.textLabel10, props.textLabel10, props.seldonRefs))
const textLabel11Props = computed(() => mergeOptionalSlot(sdn.textLabel11, props.textLabel11, props.seldonRefs))
const calendarDayProps = computed(() => mergeOptionalSlot(sdn.calendarDay, props.calendarDay, props.seldonRefs))
const textLabel12Props = computed(() => mergeOptionalSlot(sdn.textLabel12, props.textLabel12, props.seldonRefs))
const calendarDay2Props = computed(() => mergeOptionalSlot(sdn.calendarDay2, props.calendarDay2, props.seldonRefs))
const textLabel13Props = computed(() => mergeOptionalSlot(sdn.textLabel13, props.textLabel13, props.seldonRefs))
const calendarDay3Props = computed(() => mergeOptionalSlot(sdn.calendarDay3, props.calendarDay3, props.seldonRefs))
const textLabel14Props = computed(() => mergeOptionalSlot(sdn.textLabel14, props.textLabel14, props.seldonRefs))
const calendarDay4Props = computed(() => mergeOptionalSlot(sdn.calendarDay4, props.calendarDay4, props.seldonRefs))
const textLabel15Props = computed(() => mergeOptionalSlot(sdn.textLabel15, props.textLabel15, props.seldonRefs))
const calendarDayMuted2Props = computed(() => mergeOptionalSlot(sdn.calendarDayMuted2, props.calendarDayMuted2, props.seldonRefs))
const textLabel16Props = computed(() => mergeOptionalSlot(sdn.textLabel16, props.textLabel16, props.seldonRefs))
const container3Props = computed(() => mergeSlot(sdn.container3, props.container3, props.seldonRefs))
const calendarDayMuted3Props = computed(() => mergeOptionalSlot(sdn.calendarDayMuted3, props.calendarDayMuted3, props.seldonRefs))
const textLabel17Props = computed(() => mergeOptionalSlot(sdn.textLabel17, props.textLabel17, props.seldonRefs))
const calendarDayMuted4Props = computed(() => mergeOptionalSlot(sdn.calendarDayMuted4, props.calendarDayMuted4, props.seldonRefs))
const textLabel18Props = computed(() => mergeOptionalSlot(sdn.textLabel18, props.textLabel18, props.seldonRefs))
const calendarDayMuted5Props = computed(() => mergeOptionalSlot(sdn.calendarDayMuted5, props.calendarDayMuted5, props.seldonRefs))
const textLabel19Props = computed(() => mergeOptionalSlot(sdn.textLabel19, props.textLabel19, props.seldonRefs))
const calendarDayMuted6Props = computed(() => mergeOptionalSlot(sdn.calendarDayMuted6, props.calendarDayMuted6, props.seldonRefs))
const textLabel20Props = computed(() => mergeOptionalSlot(sdn.textLabel20, props.textLabel20, props.seldonRefs))
const calendarDayMuted7Props = computed(() => mergeOptionalSlot(sdn.calendarDayMuted7, props.calendarDayMuted7, props.seldonRefs))
const textLabel21Props = computed(() => mergeOptionalSlot(sdn.textLabel21, props.textLabel21, props.seldonRefs))
const calendarDayMuted8Props = computed(() => mergeOptionalSlot(sdn.calendarDayMuted8, props.calendarDayMuted8, props.seldonRefs))
const textLabel22Props = computed(() => mergeOptionalSlot(sdn.textLabel22, props.textLabel22, props.seldonRefs))
const calendarDayMuted9Props = computed(() => mergeOptionalSlot(sdn.calendarDayMuted9, props.calendarDayMuted9, props.seldonRefs))
const textLabel23Props = computed(() => mergeOptionalSlot(sdn.textLabel23, props.textLabel23, props.seldonRefs))
const container4Props = computed(() => mergeSlot(sdn.container4, props.container4, props.seldonRefs))
const calendarDayMuted10Props = computed(() => mergeOptionalSlot(sdn.calendarDayMuted10, props.calendarDayMuted10, props.seldonRefs))
const textLabel24Props = computed(() => mergeOptionalSlot(sdn.textLabel24, props.textLabel24, props.seldonRefs))
const calendarDayMuted11Props = computed(() => mergeOptionalSlot(sdn.calendarDayMuted11, props.calendarDayMuted11, props.seldonRefs))
const textLabel25Props = computed(() => mergeOptionalSlot(sdn.textLabel25, props.textLabel25, props.seldonRefs))
const calendarDayMuted12Props = computed(() => mergeOptionalSlot(sdn.calendarDayMuted12, props.calendarDayMuted12, props.seldonRefs))
const textLabel26Props = computed(() => mergeOptionalSlot(sdn.textLabel26, props.textLabel26, props.seldonRefs))
const calendarDayMuted13Props = computed(() => mergeOptionalSlot(sdn.calendarDayMuted13, props.calendarDayMuted13, props.seldonRefs))
const textLabel27Props = computed(() => mergeOptionalSlot(sdn.textLabel27, props.textLabel27, props.seldonRefs))
const calendarDayMuted14Props = computed(() => mergeOptionalSlot(sdn.calendarDayMuted14, props.calendarDayMuted14, props.seldonRefs))
const textLabel28Props = computed(() => mergeOptionalSlot(sdn.textLabel28, props.textLabel28, props.seldonRefs))
const calendarDayMuted15Props = computed(() => mergeOptionalSlot(sdn.calendarDayMuted15, props.calendarDayMuted15, props.seldonRefs))
const textLabel29Props = computed(() => mergeOptionalSlot(sdn.textLabel29, props.textLabel29, props.seldonRefs))
const calendarDayMuted16Props = computed(() => mergeOptionalSlot(sdn.calendarDayMuted16, props.calendarDayMuted16, props.seldonRefs))
const textLabel30Props = computed(() => mergeOptionalSlot(sdn.textLabel30, props.textLabel30, props.seldonRefs))
const container5Props = computed(() => mergeSlot(sdn.container5, props.container5, props.seldonRefs))
const calendarDayMuted17Props = computed(() => mergeOptionalSlot(sdn.calendarDayMuted17, props.calendarDayMuted17, props.seldonRefs))
const textLabel31Props = computed(() => mergeOptionalSlot(sdn.textLabel31, props.textLabel31, props.seldonRefs))
const calendarDayMuted18Props = computed(() => mergeOptionalSlot(sdn.calendarDayMuted18, props.calendarDayMuted18, props.seldonRefs))
const textLabel32Props = computed(() => mergeOptionalSlot(sdn.textLabel32, props.textLabel32, props.seldonRefs))
const calendarDayMuted19Props = computed(() => mergeOptionalSlot(sdn.calendarDayMuted19, props.calendarDayMuted19, props.seldonRefs))
const textLabel33Props = computed(() => mergeOptionalSlot(sdn.textLabel33, props.textLabel33, props.seldonRefs))
const calendarDayMuted20Props = computed(() => mergeOptionalSlot(sdn.calendarDayMuted20, props.calendarDayMuted20, props.seldonRefs))
const textLabel34Props = computed(() => mergeOptionalSlot(sdn.textLabel34, props.textLabel34, props.seldonRefs))
const calendarDayMuted21Props = computed(() => mergeOptionalSlot(sdn.calendarDayMuted21, props.calendarDayMuted21, props.seldonRefs))
const textLabel35Props = computed(() => mergeOptionalSlot(sdn.textLabel35, props.textLabel35, props.seldonRefs))
const calendarDayMuted22Props = computed(() => mergeOptionalSlot(sdn.calendarDayMuted22, props.calendarDayMuted22, props.seldonRefs))
const textLabel36Props = computed(() => mergeOptionalSlot(sdn.textLabel36, props.textLabel36, props.seldonRefs))
const calendarDayMuted23Props = computed(() => mergeOptionalSlot(sdn.calendarDayMuted23, props.calendarDayMuted23, props.seldonRefs))
const textLabel37Props = computed(() => mergeOptionalSlot(sdn.textLabel37, props.textLabel37, props.seldonRefs))
const container6Props = computed(() => mergeSlot(sdn.container6, props.container6, props.seldonRefs))
const calendarDayMuted24Props = computed(() => mergeOptionalSlot(sdn.calendarDayMuted24, props.calendarDayMuted24, props.seldonRefs))
const textLabel38Props = computed(() => mergeOptionalSlot(sdn.textLabel38, props.textLabel38, props.seldonRefs))
const calendarDayMuted25Props = computed(() => mergeOptionalSlot(sdn.calendarDayMuted25, props.calendarDayMuted25, props.seldonRefs))
const textLabel39Props = computed(() => mergeOptionalSlot(sdn.textLabel39, props.textLabel39, props.seldonRefs))
const calendarDay5Props = computed(() => mergeOptionalSlot(sdn.calendarDay5, props.calendarDay5, props.seldonRefs))
const textLabel40Props = computed(() => mergeOptionalSlot(sdn.textLabel40, props.textLabel40, props.seldonRefs))
</script>

<template>
    <div :class="rootClassName" v-bind="rootAttrs">
      <slot>
        <Frame v-bind="frameProps">
          <TextLabel v-if="textLabelProps !== null" v-bind="textLabelProps" />
          <ButtonIconic v-if="buttonIconicProps !== null" v-bind="buttonIconicProps" :icon="iconProps" />
          <ButtonIconic v-if="buttonIconic2Props !== null" v-bind="buttonIconic2Props" :icon="icon2Props" />
        </Frame>
        <Frame v-bind="containerProps">
          <TextLabel v-if="textLabel2Props !== null" v-bind="textLabel2Props" />
          <TextLabel v-if="textLabel3Props !== null" v-bind="textLabel3Props" />
          <TextLabel v-if="textLabel4Props !== null" v-bind="textLabel4Props" />
          <TextLabel v-if="textLabel5Props !== null" v-bind="textLabel5Props" />
          <TextLabel v-if="textLabel6Props !== null" v-bind="textLabel6Props" />
          <TextLabel v-if="textLabel7Props !== null" v-bind="textLabel7Props" />
          <TextLabel v-if="textLabel8Props !== null" v-bind="textLabel8Props" />
        </Frame>
        <Frame v-bind="frame2Props">
          <Frame v-bind="container2Props" v-if="container2Props !== null">
            <CalendarDayMuted v-if="calendarDayMutedProps !== null" v-bind="calendarDayMutedProps">
              <TextLabel v-if="textLabel9Props !== null" v-bind="textLabel9Props" />
            </CalendarDayMuted>
            <CalendarDaySelected v-if="calendarDaySelectedProps !== null" v-bind="calendarDaySelectedProps">
              <TextLabel v-if="textLabel10Props !== null" v-bind="textLabel10Props" />
              <TextLabel v-if="textLabel11Props !== null" v-bind="textLabel11Props" />
            </CalendarDaySelected>
            <CalendarDay v-if="calendarDayProps !== null" v-bind="calendarDayProps">
              <TextLabel v-if="textLabel12Props !== null" v-bind="textLabel12Props" />
            </CalendarDay>
            <CalendarDay v-if="calendarDay2Props !== null" v-bind="calendarDay2Props">
              <TextLabel v-if="textLabel13Props !== null" v-bind="textLabel13Props" />
            </CalendarDay>
            <CalendarDay v-if="calendarDay3Props !== null" v-bind="calendarDay3Props">
              <TextLabel v-if="textLabel14Props !== null" v-bind="textLabel14Props" />
            </CalendarDay>
            <CalendarDay v-if="calendarDay4Props !== null" v-bind="calendarDay4Props">
              <TextLabel v-if="textLabel15Props !== null" v-bind="textLabel15Props" />
            </CalendarDay>
            <CalendarDayMuted v-if="calendarDayMuted2Props !== null" v-bind="calendarDayMuted2Props">
              <TextLabel v-if="textLabel16Props !== null" v-bind="textLabel16Props" />
            </CalendarDayMuted>
          </Frame>
          <Frame v-bind="container3Props" v-if="container3Props !== null">
            <CalendarDayMuted v-if="calendarDayMuted3Props !== null" v-bind="calendarDayMuted3Props">
              <TextLabel v-if="textLabel17Props !== null" v-bind="textLabel17Props" />
            </CalendarDayMuted>
            <CalendarDayMuted v-if="calendarDayMuted4Props !== null" v-bind="calendarDayMuted4Props">
              <TextLabel v-if="textLabel18Props !== null" v-bind="textLabel18Props" />
            </CalendarDayMuted>
            <CalendarDayMuted v-if="calendarDayMuted5Props !== null" v-bind="calendarDayMuted5Props">
              <TextLabel v-if="textLabel19Props !== null" v-bind="textLabel19Props" />
            </CalendarDayMuted>
            <CalendarDayMuted v-if="calendarDayMuted6Props !== null" v-bind="calendarDayMuted6Props">
              <TextLabel v-if="textLabel20Props !== null" v-bind="textLabel20Props" />
            </CalendarDayMuted>
            <CalendarDayMuted v-if="calendarDayMuted7Props !== null" v-bind="calendarDayMuted7Props">
              <TextLabel v-if="textLabel21Props !== null" v-bind="textLabel21Props" />
            </CalendarDayMuted>
            <CalendarDayMuted v-if="calendarDayMuted8Props !== null" v-bind="calendarDayMuted8Props">
              <TextLabel v-if="textLabel22Props !== null" v-bind="textLabel22Props" />
            </CalendarDayMuted>
            <CalendarDayMuted v-if="calendarDayMuted9Props !== null" v-bind="calendarDayMuted9Props">
              <TextLabel v-if="textLabel23Props !== null" v-bind="textLabel23Props" />
            </CalendarDayMuted>
          </Frame>
          <Frame v-bind="container4Props" v-if="container4Props !== null">
            <CalendarDayMuted v-if="calendarDayMuted10Props !== null" v-bind="calendarDayMuted10Props">
              <TextLabel v-if="textLabel24Props !== null" v-bind="textLabel24Props" />
            </CalendarDayMuted>
            <CalendarDayMuted v-if="calendarDayMuted11Props !== null" v-bind="calendarDayMuted11Props">
              <TextLabel v-if="textLabel25Props !== null" v-bind="textLabel25Props" />
            </CalendarDayMuted>
            <CalendarDayMuted v-if="calendarDayMuted12Props !== null" v-bind="calendarDayMuted12Props">
              <TextLabel v-if="textLabel26Props !== null" v-bind="textLabel26Props" />
            </CalendarDayMuted>
            <CalendarDayMuted v-if="calendarDayMuted13Props !== null" v-bind="calendarDayMuted13Props">
              <TextLabel v-if="textLabel27Props !== null" v-bind="textLabel27Props" />
            </CalendarDayMuted>
            <CalendarDayMuted v-if="calendarDayMuted14Props !== null" v-bind="calendarDayMuted14Props">
              <TextLabel v-if="textLabel28Props !== null" v-bind="textLabel28Props" />
            </CalendarDayMuted>
            <CalendarDayMuted v-if="calendarDayMuted15Props !== null" v-bind="calendarDayMuted15Props">
              <TextLabel v-if="textLabel29Props !== null" v-bind="textLabel29Props" />
            </CalendarDayMuted>
            <CalendarDayMuted v-if="calendarDayMuted16Props !== null" v-bind="calendarDayMuted16Props">
              <TextLabel v-if="textLabel30Props !== null" v-bind="textLabel30Props" />
            </CalendarDayMuted>
          </Frame>
          <Frame v-bind="container5Props" v-if="container5Props !== null">
            <CalendarDayMuted v-if="calendarDayMuted17Props !== null" v-bind="calendarDayMuted17Props">
              <TextLabel v-if="textLabel31Props !== null" v-bind="textLabel31Props" />
            </CalendarDayMuted>
            <CalendarDayMuted v-if="calendarDayMuted18Props !== null" v-bind="calendarDayMuted18Props">
              <TextLabel v-if="textLabel32Props !== null" v-bind="textLabel32Props" />
            </CalendarDayMuted>
            <CalendarDayMuted v-if="calendarDayMuted19Props !== null" v-bind="calendarDayMuted19Props">
              <TextLabel v-if="textLabel33Props !== null" v-bind="textLabel33Props" />
            </CalendarDayMuted>
            <CalendarDayMuted v-if="calendarDayMuted20Props !== null" v-bind="calendarDayMuted20Props">
              <TextLabel v-if="textLabel34Props !== null" v-bind="textLabel34Props" />
            </CalendarDayMuted>
            <CalendarDayMuted v-if="calendarDayMuted21Props !== null" v-bind="calendarDayMuted21Props">
              <TextLabel v-if="textLabel35Props !== null" v-bind="textLabel35Props" />
            </CalendarDayMuted>
            <CalendarDayMuted v-if="calendarDayMuted22Props !== null" v-bind="calendarDayMuted22Props">
              <TextLabel v-if="textLabel36Props !== null" v-bind="textLabel36Props" />
            </CalendarDayMuted>
            <CalendarDayMuted v-if="calendarDayMuted23Props !== null" v-bind="calendarDayMuted23Props">
              <TextLabel v-if="textLabel37Props !== null" v-bind="textLabel37Props" />
            </CalendarDayMuted>
          </Frame>
          <Frame v-bind="container6Props" v-if="container6Props !== null">
            <CalendarDayMuted v-if="calendarDayMuted24Props !== null" v-bind="calendarDayMuted24Props">
              <TextLabel v-if="textLabel38Props !== null" v-bind="textLabel38Props" />
            </CalendarDayMuted>
            <CalendarDayMuted v-if="calendarDayMuted25Props !== null" v-bind="calendarDayMuted25Props">
              <TextLabel v-if="textLabel39Props !== null" v-bind="textLabel39Props" />
            </CalendarDayMuted>
            <CalendarDay v-if="calendarDay5Props !== null" v-bind="calendarDay5Props">
              <TextLabel v-if="textLabel40Props !== null" v-bind="textLabel40Props" />
            </CalendarDay>
          </Frame>
        </Frame>
      </slot>
    </div>
</template>

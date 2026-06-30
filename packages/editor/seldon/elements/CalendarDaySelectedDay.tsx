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
import { Frame } from "../frames/Frame"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { applyRef } from "../utils/apply-ref"
import { combineClassNames } from "../utils/class-name"

export interface CalendarDaySelectedDayProps extends HTMLAttributes<HTMLElement> {
  className?: string
  "data-seldon-ref"?: string
  seldonRefs?: Record<string, Record<string, unknown>>
  wrapperElement?:
    | "div"
    | "section"
    | "article"
    | "aside"
    | "main"
    | "nav"
    | "header"
    | "footer"
    | "ul"
    | "ol"
    | "li"
    | "form"
    | "fieldset"
    | "figure"
    | "menu"
    | "blockquote"
    | "table"
    | "thead"
    | "tbody"
    | "tfoot"
    | "tr"
  textLabel?: TextLabelProps | null
}

/*****
 * Calendar Day: CalendarDaySelectedDay
 * Level: Element
 * Intent: A single day cell for a calendar grid. The default renders a plain number; variants cover muted out-of-month days, the selected day, and the current day.
 * Tags: calendar, day, date, cell, ui, grid
 * Type: Custom
 *
 * @example
 * ```tsx
 * <CalendarDaySelectedDay
 *   wrapperElement="div"
 *   aria-hidden="false"
 *   aria-selected="true"
 * />
 * ```
 *****/
export function CalendarDaySelectedDay({
  className = "",
  wrapperElement = sdn.wrapperElement,
  textLabel,
  children,
  seldonRefs,
  ...props
}: CalendarDaySelectedDayProps) {
  const calendarDaySelectedDayClassName = combineClassNames(
    "sdn-calendar-day-selected-day",
    className,
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

  return (
    <Frame
      className={calendarDaySelectedDayClassName}
      aria-hidden={sdn["aria-hidden"]}
      aria-selected={sdn["aria-selected"]}
      {...props}
    >
      {children !== undefined ? (
        children
      ) : (
        <>{textLabel && textLabelProps && <TextLabel {...textLabelProps} />}</>
      )}
    </Frame>
  )
}

//
// Default property values
//
const sdn: CalendarDaySelectedDayProps = {
  wrapperElement: "div",
  "aria-hidden": "false",
  "aria-selected": "true",
  className: "sdn-calendar-day-selected-day sdn-calendar-day",
  textLabel: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
}

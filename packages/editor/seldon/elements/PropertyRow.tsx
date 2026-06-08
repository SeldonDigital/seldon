/*****
 *
 * This code was generated using Seldon (https://seldon.app)
 *
 * Licensed under the Terms of Use: https://seldon.digital/terms-of-service
 * Do not redistribute or sublicense without permission.
 *
 * You may not use this software, or any derivative works of it,
 * in whole or in part, for the purposes of training, fine-tuning,
 * or otherwise improving (directly or indirectly) any machine learning
 * or artificial intelligence system.
 *
 *****/
import { HTMLAttributes } from "react"
import { HTMLDiv } from "../native-react/HTML.Div"
import { combineClassNames } from "../utils/class-name"

export interface PropertyRowProps extends HTMLAttributes<HTMLDivElement> {
  className?: string
  children?: React.ReactNode
  label?: string
  isSubProperty?: boolean
  isDimmed?: boolean
}

/**
 * Property Row
 *
 * Level: Element
 *
 * Intent: Row component for displaying property name and control in the properties panel.
 *
 * Tags: property, row, form, UI
 *
 * @example
 * ```tsx
 * <PropertyRow
 *   label="Background Color"
 *   isSubProperty={false}
 *   isDimmed={false}
 * >
 *   <ColorControl />
 * </PropertyRow>
 * ```
 */
export function PropertyRow({
  className = "",
  children,
  label,
  isSubProperty = false,
  isDimmed = false,
  ...props
}: PropertyRowProps) {
  const baseClassName = combineClassNames(
    "sdn-property-row",
    isSubProperty ? "sdn-property-row--sub" : undefined,
  )
  const dimmedClassName = combineClassNames(
    baseClassName,
    isDimmed ? "sdn-property-row--dimmed" : undefined,
  )
  const frameClassName = combineClassNames(dimmedClassName, className)

  return (
    <HTMLDiv className={frameClassName} {...props}>
      {children}
    </HTMLDiv>
  )
}

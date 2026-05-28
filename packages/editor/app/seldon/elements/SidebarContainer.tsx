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

export interface SidebarContainerProps extends HTMLAttributes<HTMLDivElement> {
  className?: string
  children?: React.ReactNode
}

/**
 * Sidebar Container
 *
 * Level: Element
 *
 * Intent: Main container for sidebar components with header and scrollable content.
 *
 * Tags: sidebar, container, layout, UI
 *
 * @example
 * ```tsx
 * <SidebarContainer>
 *   <SidebarHeader>Title</SidebarHeader>
 *   <SidebarContent>Content</SidebarContent>
 * </SidebarContainer>
 * ```
 */
export function SidebarContainer({
  className = "",
  children,
  ...props
}: SidebarContainerProps) {
  const frameClassName = combineClassNames("sdn-sidebar-container", className)

  return (
    <HTMLDiv className={frameClassName} {...props}>
      {children}
    </HTMLDiv>
  )
}

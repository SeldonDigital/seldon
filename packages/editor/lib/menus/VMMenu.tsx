"use client"

import { useInterfaceModeVars } from "@lib/theme/use-interface-mode-vars"
import {
  CSSProperties,
  ReactNode,
  RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { createPortal } from "react-dom"
import { useEditorConfig } from "@lib/hooks/use-editor-config"
import { MenuItem } from "@seldon/components/elements/MenuItem"
import { Menu } from "@seldon/components/parts/Menu"
import { Hr } from "@seldon/components/primitives/Hr"
import { IconProps } from "@seldon/components/primitives/Icon"
import { MenuAlign, MenuEntry, MenuItem as MenuItemModel } from "./types"
import { useMenuPosition } from "./use-menu-position"

function focusReturnTarget(element: HTMLElement | null | undefined): void {
  if (!element?.isConnected) return
  if (element.tabIndex < 0 && !element.hasAttribute("tabindex")) {
    element.tabIndex = -1
  }
  element.focus({ preventScroll: true })
}

/**
 * Whether an item shows the leading marker. `selected` drives it when set, so an
 * item can be marked without the activated tint or tinted without a marker. When
 * `selected` is omitted the marker follows `active` for plain toggle menus.
 */
function isMarked(item: MenuItemModel): boolean {
  return item.selected ?? Boolean(item.active)
}

/**
 * Leading marker for the active column. Marked items render a check (or radio
 * dot for `bullet` sets), tinted only when the item is also activated; unmarked
 * items render the same glyph hidden so labels stay aligned. Returns null when
 * the menu has no markable items, dropping the column entirely.
 */
function markerIconProps(
  item: MenuItemModel,
  showColumn: boolean,
): IconProps | null {
  if (!showColumn) return null
  const glyph =
    item.activeMarker === "bullet"
      ? "material-radioButtonChecked"
      : "material-check"
  if (isMarked(item)) {
    return {
      icon: glyph,
      "aria-hidden": "true",
      className: item.active ? "sdn-state-activated" : undefined,
    }
  }
  return { icon: glyph, "aria-hidden": "true", style: { visibility: "hidden" } }
}

interface VMMenuCommon {
  items: MenuEntry[]
  align?: MenuAlign
  minWidth?: string
  /** When set, menu actions restore focus here instead of the trigger. */
  focusTargetRef?: RefObject<HTMLElement | null>
}

/** Aria/handler props the caller spreads onto its trigger element. */
export interface DropdownTriggerProps {
  "aria-haspopup": "menu"
  "aria-expanded": boolean
  onClick: (event: React.MouseEvent) => void
  onKeyDown: (event: React.KeyboardEvent) => void
}

/** Arguments passed to `renderTrigger` in the self-managed trigger mode. */
export interface DropdownRenderTriggerArgs {
  ref: RefObject<HTMLButtonElement | null>
  open: boolean
  toggle: () => void
  triggerProps: DropdownTriggerProps
}

/** Controlled mode: the caller owns `open` and the anchor element. */
type VMMenuControlledProps = VMMenuCommon & {
  open: boolean
  anchorRef: RefObject<HTMLElement | null>
  onClose: () => void
  renderTrigger?: never
}

/** Trigger mode: VMMenu owns open state and anchors to its own trigger. */
type VMMenuTriggerProps = VMMenuCommon & {
  renderTrigger: (args: DropdownRenderTriggerArgs) => ReactNode
  open?: never
  anchorRef?: never
  onClose?: never
}

export type VMMenuProps = VMMenuControlledProps | VMMenuTriggerProps

/**
 * View-model for menus. In controlled mode the caller owns `open`/`anchorRef`
 * (used for headless slot triggers like sidebar row actions). In trigger mode
 * the caller supplies `renderTrigger` and VMMenu owns the open state and trigger
 * wiring. Both render the same floating `Menu` View.
 */
export function VMMenu(props: VMMenuProps) {
  if (props.renderTrigger) {
    return <TriggerMenu {...props} />
  }
  return <FloatingMenu {...props} />
}

/**
 * Self-managed trigger wrapper. Owns the open state and an internal trigger ref,
 * hands aria/keyboard props to `renderTrigger`, and anchors the floating menu to
 * that trigger.
 */
function TriggerMenu({
  items,
  align,
  minWidth,
  focusTargetRef,
  renderTrigger,
}: VMMenuTriggerProps) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const toggle = () => setOpen((current) => !current)

  const triggerProps: DropdownTriggerProps = {
    "aria-haspopup": "menu",
    "aria-expanded": open,
    onClick: (event) => {
      event.stopPropagation()
      toggle()
    },
    onKeyDown: (event) => {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault()
        setOpen(true)
      }
    },
  }

  return (
    <>
      {renderTrigger({ ref: triggerRef, open, toggle, triggerProps })}
      <FloatingMenu
        open={open}
        anchorRef={triggerRef}
        onClose={() => setOpen(false)}
        items={items}
        align={align}
        minWidth={minWidth}
        focusTargetRef={focusTargetRef}
      />
    </>
  )
}

interface FloatingMenuProps extends VMMenuCommon {
  open: boolean
  anchorRef: RefObject<HTMLElement | null>
  onClose: () => void
}

/**
 * The floating menu surface. Owns positioning, roving-focus keyboard navigation,
 * outside-click and Escape to close, and focus restore, then renders the
 * generated `Menu` View. Item state and visuals come from the generated
 * component CSS: hover from `.sdn-menu-item:hover`, disabled from
 * `aria-disabled`, active from `.sdn-state-activated`, and the highlighted item
 * from `aria-selected` on its leaves.
 */
function FloatingMenu({
  open,
  anchorRef,
  onClose,
  items,
  align = "start",
  minWidth = "180px",
  focusTargetRef,
}: FloatingMenuProps) {
  const { chromeTheme } = useEditorConfig()
  const position = useMenuPosition({ open, anchorRef, align })
  const menuRef = useRef<HTMLDivElement>(null)
  useInterfaceModeVars(menuRef)
  const [activeIndex, setActiveIndex] = useState(-1)
  const closedBySelectRef = useRef(false)

  const enabledIndexes = useMemo(
    () =>
      items.reduce<number[]>((acc, item, index) => {
        if (item !== "separator" && !item.disabled) acc.push(index)
        return acc
      }, []),
    [items],
  )

  // Highlight the first enabled item whenever the menu opens.
  useEffect(() => {
    if (open) setActiveIndex(enabledIndexes[0] ?? -1)
  }, [open, enabledIndexes])

  // Move DOM focus to the highlighted item for keyboard navigation.
  useEffect(() => {
    if (!open) return
    if (activeIndex >= 0) {
      menuRef.current
        ?.querySelector<HTMLElement>(`[data-menu-index="${activeIndex}"]`)
        ?.focus()
    } else {
      menuRef.current?.focus()
    }
  }, [open, activeIndex])

  // Restore focus to the trigger when the menu closes without a selection.
  const wasOpen = useRef(false)
  useEffect(() => {
    if (wasOpen.current && !open && !closedBySelectRef.current) {
      focusReturnTarget(anchorRef.current)
    }
    wasOpen.current = open
  }, [open, anchorRef])

  // Close on pointer interactions outside the menu and trigger.
  useEffect(() => {
    if (!open) return
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      if (menuRef.current?.contains(target)) return
      if (anchorRef.current?.contains(target)) return
      onClose()
    }
    document.addEventListener("pointerdown", handlePointerDown, true)
    return () =>
      document.removeEventListener("pointerdown", handlePointerDown, true)
  }, [open, onClose, anchorRef])

  if (open && typeof document === "undefined") return null
  if (!open) return null

  const showMarkerColumn = items.some(
    (item) => item !== "separator" && isMarked(item),
  )

  const moveActive = (direction: 1 | -1) => {
    if (enabledIndexes.length === 0) return
    const currentPosition = enabledIndexes.indexOf(activeIndex)
    let nextPosition = currentPosition + direction
    if (nextPosition < 0) nextPosition = enabledIndexes.length - 1
    if (nextPosition >= enabledIndexes.length) nextPosition = 0
    setActiveIndex(enabledIndexes[nextPosition])
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault()
        moveActive(1)
        break
      case "ArrowUp":
        event.preventDefault()
        moveActive(-1)
        break
      case "Home":
        event.preventDefault()
        setActiveIndex(enabledIndexes[0] ?? -1)
        break
      case "End":
        event.preventDefault()
        setActiveIndex(enabledIndexes[enabledIndexes.length - 1] ?? -1)
        break
      case "Escape":
        event.preventDefault()
        onClose()
        break
      case "Tab":
        onClose()
        break
    }
  }

  // Close before running the action, then move focus off the trigger when the
  // caller supplies a row target (for example after reset removes menu actions).
  const handleSelect = (item: MenuItemModel) => {
    if (item.disabled) return
    closedBySelectRef.current = true
    onClose()
    item.onSelect?.()
    requestAnimationFrame(() => {
      const focusTarget = focusTargetRef?.current
      if (focusTarget?.isConnected) {
        focusReturnTarget(focusTarget)
      } else if (anchorRef.current?.isConnected) {
        focusReturnTarget(anchorRef.current)
      }
      closedBySelectRef.current = false
    })
  }

  const containerStyle: CSSProperties = {
    position: "fixed",
    zIndex: 50,
    outline: "none",
    ...position,
  }

  return createPortal(
    <div
      ref={menuRef}
      tabIndex={-1}
      style={containerStyle}
      onKeyDown={handleKeyDown}
      data-theme={chromeTheme}
    >
      <Menu aria-orientation="vertical" style={{ minWidth }}>
        {items.map((item, index) => {
          if (item === "separator") {
            return <Hr key={`separator-${index}`} />
          }
          const highlighted = index === activeIndex
          return (
            <MenuItem
              key={item.id}
              type="button"
              data-menu-index={index}
              data-testid={item.testId}
              disabled={item.disabled}
              aria-disabled={item.disabled || undefined}
              tabIndex={highlighted ? 0 : -1}
              onClick={() => handleSelect(item)}
              onPointerEnter={() => {
                if (!item.disabled) setActiveIndex(index)
              }}
              icon={markerIconProps(item, showMarkerColumn)}
              textLabel={{
                children: item.label,
                "aria-disabled": item.disabled ? "true" : undefined,
                className: item.active ? "sdn-state-activated" : undefined,
                style: item.labelStyle,
              }}
              textLabel2={item.shortcut ? { children: item.shortcut } : null}
            />
          )
        })}
      </Menu>
    </div>,
    document.body,
  )
}

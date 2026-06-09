"use client"

import {
  CSSProperties,
  RefObject,
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { createPortal } from "react-dom"
import { MenuAlign, MenuEntry, MenuItem } from "./types"
import { useMenuPosition } from "./use-menu-position"

const HIGHLIGHT_BACKGROUND = "hsl(0 0% 100% / 0.1)"

interface MenuProps {
  open: boolean
  anchorRef: RefObject<HTMLElement | null>
  onClose: () => void
  items: MenuEntry[]
  align?: MenuAlign
  minWidth?: string
}

/**
 * A floating menu list rendered in a portal and anchored to a trigger element.
 * Replaces the Radix dropdown menu: handles outside-click and Escape to close,
 * roving-focus keyboard navigation, and restores focus to the trigger on close.
 */
export function Menu({
  open,
  anchorRef,
  onClose,
  items,
  align = "start",
  minWidth = "180px",
}: MenuProps) {
  const position = useMenuPosition({ open, anchorRef, align })
  const menuRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [activeIndex, setActiveIndex] = useState(-1)

  const enabledIndexes = useMemo(
    () =>
      items.reduce<number[]>((acc, item, index) => {
        if (item !== "separator" && !item.disabled) acc.push(index)
        return acc
      }, []),
    [items],
  )

  const hasActiveItem = items.some(
    (item) => item !== "separator" && item.active,
  )

  // Highlight the first enabled item whenever the menu opens.
  useEffect(() => {
    if (open) setActiveIndex(enabledIndexes[0] ?? -1)
  }, [open, enabledIndexes])

  // Move DOM focus to the highlighted item for keyboard navigation.
  useEffect(() => {
    if (!open) return
    if (activeIndex >= 0) {
      itemRefs.current[activeIndex]?.focus()
    } else {
      menuRef.current?.focus()
    }
  }, [open, activeIndex])

  // Restore focus to the trigger when the menu closes.
  const wasOpen = useRef(false)
  useEffect(() => {
    if (wasOpen.current && !open) {
      anchorRef.current?.focus?.()
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

  // Close before running the action to avoid focus thrashing during unmount.
  const handleSelect = (item: MenuItem) => {
    if (item.disabled) return
    onClose()
    item.onSelect?.()
  }

  const containerStyle: CSSProperties = {
    position: "fixed",
    zIndex: 50,
    minWidth,
    borderRadius: "0.375rem",
    border: "1px solid #262626",
    backgroundColor: "#333333",
    paddingTop: "var(--sdn-padding-tight)",
    paddingBottom: "var(--sdn-padding-tight)",
    color: "#F5F5F5",
    boxShadow:
      "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    outline: "none",
    ...position,
  }

  return createPortal(
    <div
      ref={menuRef}
      role="menu"
      tabIndex={-1}
      aria-orientation="vertical"
      style={containerStyle}
      onKeyDown={handleKeyDown}
    >
      {items.map((item, index) => {
        if (item === "separator") {
          return <MenuSeparator key={`separator-${index}`} />
        }
        return (
          <MenuItemButton
            key={item.id}
            ref={(element) => {
              itemRefs.current[index] = element
            }}
            item={item}
            highlighted={index === activeIndex}
            showActiveColumn={hasActiveItem}
            onSelect={() => handleSelect(item)}
            onPointerEnter={() => {
              if (!item.disabled) setActiveIndex(index)
            }}
          />
        )
      })}
    </div>,
    document.body,
  )
}

function MenuSeparator() {
  return (
    <div
      style={{
        margin: "0.25rem 0.75rem",
        height: "1px",
        backgroundColor: HIGHLIGHT_BACKGROUND,
      }}
    />
  )
}

interface MenuItemButtonProps {
  item: MenuItem
  highlighted: boolean
  showActiveColumn: boolean
  onSelect: () => void
  onPointerEnter: () => void
}

const MenuItemButton = forwardRef<HTMLButtonElement, MenuItemButtonProps>(
  function MenuItemButton(
    { item, highlighted, showActiveColumn, onSelect, onPointerEnter },
    ref,
  ) {
    const itemStyle: CSSProperties = {
      display: "flex",
      width: "100%",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "1rem",
      border: "none",
      background:
        highlighted && !item.disabled ? HIGHLIGHT_BACKGROUND : "transparent",
      borderRadius: "0.125rem",
      padding: "0.5rem 0.75rem",
      fontSize: "var(--sdn-font-size-xsmall)",
      textAlign: "left",
      color: item.active ? "var(--sdn-swatch-seldon-blue)" : "#F5F5F5",
      cursor: item.disabled ? "not-allowed" : "pointer",
      opacity: item.disabled ? 0.5 : undefined,
      userSelect: "none",
      outline: "none",
    }

    return (
      <button
        ref={ref}
        type="button"
        role="menuitem"
        disabled={item.disabled}
        aria-disabled={item.disabled || undefined}
        tabIndex={highlighted ? 0 : -1}
        style={itemStyle}
        onClick={onSelect}
        onPointerEnter={onPointerEnter}
        data-testid={item.testId}
      >
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--sdn-gap-compact)",
            minWidth: 0,
          }}
        >
          {showActiveColumn &&
            (item.active ? (
              <span
                style={{
                  color: "var(--sdn-swatch-seldon-blue)",
                  fontWeight: "var(--sdn-font-weight-bold)",
                  width: "0.75rem",
                  textAlign: "right",
                }}
              >
                ✓
              </span>
            ) : (
              <span style={{ width: "0.75rem" }} />
            ))}
          {item.icon && (
            <span style={{ display: "flex", alignItems: "center" }}>
              {item.icon}
            </span>
          )}
          <span
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {item.label}
          </span>
        </span>
        {item.shortcut && (
          <span style={{ color: "#a3a3a3" }}>{item.shortcut}</span>
        )}
      </button>
    )
  },
)

import { ICONIC_BUTTON_ATTR } from "@seldon/editor/lib/menus/iconic-button"
import { type MaybeRefOrGetter, computed, ref, toValue } from "vue"

import type { MenuEntry } from "./types"

interface UseRowActionsMenuOptions {
  ariaLabel?: string
}

/**
 * Headless "..." actions menu for a generated row. Owns the open state and the
 * anchor element, and returns slot props for the row's trailing iconic-button
 * plus the menu items to feed a `MenuController`. When there are no actions the
 * button stays reserved as a hidden, inert placeholder so the row footprint is
 * stable. Mirrors the React `useRowActionsMenu`.
 */
export function useRowActionsMenu(
  items: MaybeRefOrGetter<MenuEntry[]>,
  options?: UseRowActionsMenuOptions,
) {
  const open = ref(false)
  const anchor = ref<HTMLElement | null>(null)

  const menuItems = computed<MenuEntry[]>(() => toValue(items))
  const hasActions = computed(() => menuItems.value.length > 0)

  function close(): void {
    open.value = false
  }

  function onTriggerClick(event: MouseEvent): void {
    event.stopPropagation()
    anchor.value = event.currentTarget as HTMLElement
    open.value = !open.value
  }

  function onTriggerKeydown(event: KeyboardEvent): void {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault()
      anchor.value = event.currentTarget as HTMLElement
      open.value = true
    }
  }

  const buttonIconic = computed<Record<string, unknown>>(() => {
    if (!hasActions.value) {
      return {
        type: "button",
        disabled: true,
        tabindex: -1,
        style: {
          visibility: "hidden",
          pointerEvents: "none",
          flexShrink: 0,
        },
      }
    }
    return {
      type: "button",
      [ICONIC_BUTTON_ATTR]: true,
      "aria-label": options?.ariaLabel ?? "Row actions",
      "aria-haspopup": "menu",
      "aria-expanded": open.value,
      onClick: onTriggerClick,
      onKeydown: onTriggerKeydown,
      style: { position: "relative", zIndex: 10 },
    }
  })

  const icon = computed<Record<string, unknown>>(() => ({
    icon: "seldon-more",
    ...(hasActions.value ? {} : { style: { visibility: "hidden" } }),
  }))

  return { hasActions, open, anchor, close, buttonIconic, icon, menuItems }
}

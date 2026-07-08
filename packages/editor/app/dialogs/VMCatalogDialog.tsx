"use client"

import {
  CSSProperties,
  ChangeEvent,
  Fragment,
  PointerEvent,
  useCallback,
  useMemo,
  useState,
} from "react"
import { useDragControls } from "framer-motion"
import { useHotkeys } from "react-hotkeys-hook"
import { ModalOverlay } from "@seldon/components/custom-components"
import { ItemCatalog } from "@seldon/components/elements/ItemCatalog"
import { DialogCatalog } from "@seldon/components/modules/DialogCatalog"
import { ListStandardCatalog } from "@seldon/components/parts/ListStandardCatalog"
import { IconProps } from "@seldon/components/primitives/Icon"
import { TextSubtitle } from "@seldon/components/primitives/TextSubtitle"
import { PANEL_INITIAL_HEIGHT, PANEL_INITIAL_WIDTH } from "@app/constants"
import { CatalogDialogCategory, CatalogDialogItem } from "./types"

interface VMCatalogDialogProps<T extends CatalogDialogItem> {
  title: string
  confirmButtonText: string
  categories: CatalogDialogCategory<T>[]
  query: string
  onQueryChange: (query: string) => void
  onPick: (item: T) => void
  onClose: () => void
}

/**
 * Shared view-model for the catalog dialogs. Feeds the generated `DialogCatalog`
 * shell: it wires the title, search field, and cancel/confirm buttons, and
 * injects the category list into the shell's content frame via `seldonRefs`.
 * `DialogCatalog` is a complete modal surface, so it renders directly inside a
 * centered portal with a backdrop rather than the draggable `FloatingPanel`.
 */
export function VMCatalogDialog<T extends CatalogDialogItem>({
  title,
  confirmButtonText,
  categories,
  query,
  onQueryChange,
  onPick,
  onClose,
}: VMCatalogDialogProps<T>) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const dragControls = useDragControls()

  useHotkeys("esc", onClose)

  const startDrag = useCallback(
    (event: PointerEvent) => dragControls.start(event),
    [dragControls],
  )

  const stopDrag = useCallback((event: PointerEvent) => {
    // Keep pointer interactions with the search field from starting a drag.
    event.stopPropagation()
  }, [])

  const visibleCategories = useMemo(
    () => categories.filter(({ items }) => items.length > 0),
    [categories],
  )

  const selectedItem = useMemo(
    () =>
      visibleCategories
        .flatMap(({ items }) => items)
        .find((item) => item.id === selectedId) ?? null,
    [visibleCategories, selectedId],
  )

  const pickItem = useCallback(
    (item: T) => {
      onPick(item)
      setSelectedId(null)
      // onPick may trigger effects that must run before the panel unmounts.
      requestAnimationFrame(onClose)
    },
    [onPick, onClose],
  )

  const handleConfirm = useCallback(() => {
    if (selectedItem) pickItem(selectedItem)
  }, [selectedItem, pickItem])

  const handleQueryChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => onQueryChange(event.target.value),
    [onQueryChange],
  )

  const handleClearQuery = useCallback(() => onQueryChange(""), [onQueryChange])

  const content = useMemo(() => {
    if (visibleCategories.length === 0) {
      return <TextSubtitle style={styles.empty}>No results found</TextSubtitle>
    }

    return visibleCategories.map(({ category, items }) => (
      <Fragment key={category}>
        <TextSubtitle style={styles.category}>{category}</TextSubtitle>
        <ListStandardCatalog>
          {items.map((item) => (
            <CatalogRow
              key={item.id}
              item={item}
              isSelected={item.id === selectedId}
              onSelect={setSelectedId}
              onPick={pickItem}
            />
          ))}
        </ListStandardCatalog>
      </Fragment>
    ))
  }, [visibleCategories, selectedId, pickItem])

  const barHandle = { onPointerDown: startDrag, style: styles.dragHandle }
  const dialogTitle = { children: title }
  const searchField = { onPointerDown: stopDrag }
  const searchInput = {
    value: query,
    onChange: handleQueryChange,
    placeholder: "Search...",
    autoFocus: true,
  }
  const searchClear = {
    onClick: handleClearQuery,
    style: query ? undefined : styles.hidden,
  }
  const barButtons = {
    button3: null,
    icon: { icon: "seldon-none" as const },
    textLabel: { children: "Cancel" },
    icon2: { icon: "material-check" as const },
    textLabel2: { children: confirmButtonText },
  }
  const seldonRefs = {
    dialogContent: { style: styles.content, children: content },
    dialogCancel: { onClick: onClose },
    dialogConfirm: { onClick: handleConfirm, disabled: !selectedItem },
  }

  return (
    <ModalOverlay onClose={onClose} dragControls={dragControls}>
      <DialogCatalog
        data-testid="catalog-dialog"
        bar={barHandle}
        textTitle={dialogTitle}
        comboboxFieldSearch={searchField}
        input={searchInput}
        buttonIconic={searchClear}
        barButtons={barButtons}
        seldonRefs={seldonRefs}
        style={styles.dialog}
      />
    </ModalOverlay>
  )
}

interface CatalogRowProps<T extends CatalogDialogItem> {
  item: T
  isSelected: boolean
  onSelect: (id: string) => void
  onPick: (item: T) => void
}

function CatalogRow<T extends CatalogDialogItem>({
  item,
  isSelected,
  onSelect,
  onPick,
}: CatalogRowProps<T>) {
  const handleClick = useCallback(
    () => onSelect(item.id),
    [onSelect, item.id],
  )
  const handleDoubleClick = useCallback(() => onPick(item), [onPick, item])

  const rowIcon = { icon: item.icon as IconProps["icon"] }
  const rowTitle = { children: item.name }
  const rowSubtitle = { children: item.description }
  const rowStyle = isSelected ? styles.rowSelected : styles.row

  return (
    <ItemCatalog
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      aria-selected={isSelected}
      style={rowStyle}
      icon={rowIcon}
      textTitle={rowTitle}
      textSubtitle={rowSubtitle}
      data-testid={`catalog-item-${item.id}`}
    />
  )
}

const styles: Record<string, CSSProperties> = {
  dialog: {
    width: PANEL_INITIAL_WIDTH,
    height: PANEL_INITIAL_HEIGHT,
  },
  dragHandle: {
    cursor: "grab",
  },
  content: {
    flex: 1,
    minHeight: 0,
    overflowY: "auto",
    overflowX: "hidden",
    scrollbarGutter: "stable",
    scrollbarWidth: "thin",
  },
  category: {
    width: "100%",
  },
  row: {
    cursor: "pointer",
    width: "100%",
  },
  rowSelected: {
    cursor: "pointer",
    width: "100%",
    backgroundColor: "color-mix(in srgb, var(--sdn-swatch-white) 10%, transparent)",
  },
  empty: {
    width: "100%",
  },
  hidden: {
    display: "none",
  },
}

"use client"

import { WindowOverlay } from "@lib/overlays/WindowOverlay.bespoke"
import {
  CSSProperties,
  ChangeEvent,
  PointerEvent,
  useCallback,
  useMemo,
  useState,
} from "react"
import { useHotkeys } from "react-hotkeys-hook"
import { useDraggableWindow } from "@lib/hooks/use-draggable-window"
import { ItemCatalog } from "@seldon/components/elements/ItemCatalog"
import { Container } from "@seldon/components/frames/Container"
import { PanelDialog } from "@seldon/components/modules/PanelDialog"
import { ListStandardCatalog } from "@seldon/components/parts/ListStandardCatalog"
import { IconProps } from "@seldon/components/primitives/Icon"
import { TextSubtitle } from "@seldon/components/primitives/TextSubtitle"
import { ResizeSide } from "@seldon/components/utils/resize"
import { PANEL_INITIAL_HEIGHT, PANEL_INITIAL_WIDTH } from "@app/constants"
import { CatalogDialogCategory, CatalogDialogItem } from "./types"

// The title bar owns the top edge for dragging, so the dialog resizes from the
// side and bottom edges plus the two bottom corners.
const DIALOG_RESIZE_SIDES: readonly ResizeSide[] = [
  "left",
  "right",
  "bottom",
  "bottom-left",
  "bottom-right",
]

interface PanelDialogControllerProps<T extends CatalogDialogItem> {
  title: string
  confirmButtonText: string
  categories: CatalogDialogCategory<T>[]
  query: string
  onQueryChange: (query: string) => void
  onPick: (item: T) => void
  onClose: () => void
}

/**
 * Shared view-model for the catalog dialogs. Feeds the generated `PanelDialog`
 * shell: it wires the title, search field, and cancel/confirm buttons, and
 * injects the category list into the shell's content frame via `seldonRefs`.
 * `PanelDialog` is a complete modal surface, so it renders inside a modal
 * `WindowOverlay`, a backdrop-backed portal that the title bar drags and the
 * left, right, and bottom edges plus bottom corners resize.
 */
export function PanelDialogController<T extends CatalogDialogItem>({
  title,
  confirmButtonText,
  categories,
  query,
  onQueryChange,
  onPick,
  onClose,
}: PanelDialogControllerProps<T>) {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const {
    x,
    y,
    width,
    height,
    onResizeStart,
    onResize,
    getRect,
    moveControls,
    dragConstraints,
    minWidth,
    minHeight,
  } = useDraggableWindow({
    initialPosition: {
      x: 0.5 * window.innerWidth - 0.5 * PANEL_INITIAL_WIDTH,
      y: 0.5 * window.innerHeight - 0.5 * PANEL_INITIAL_HEIGHT,
    },
    initialSize: { width: PANEL_INITIAL_WIDTH, height: PANEL_INITIAL_HEIGHT },
    handleClose: onClose,
    closeOnEscape: false,
  })

  useHotkeys("esc", onClose)

  const startDrag = useCallback(
    (event: PointerEvent) => moveControls.start(event),
    [moveControls],
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

    // Pass rows as children so the dialog renders live data in place of the
    // variant's placeholder rows, while the workspace keeps them for the canvas.
    // The subtitle and the two-column Container mirror how the ListStandardCatalog
    // variant composes a section.
    return visibleCategories.map(({ category, items }) => (
      <ListStandardCatalog key={category}>
        <TextSubtitle style={styles.category}>{category}</TextSubtitle>
        <Container style={styles.catalogGrid}>
          {items.map((item) => (
            <CatalogRow
              key={item.id}
              item={item}
              isSelected={item.id === selectedId}
              onSelect={setSelectedId}
              onPick={pickItem}
            />
          ))}
        </Container>
      </ListStandardCatalog>
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
  // Cancel and confirm live in the footer's right frame (button4/button5). The
  // shell leaves both slots as placeholders, so enable them and set their labels;
  // their icons ride the shell defaults and onClick flows through seldonRefs.
  const cancelLabel = { children: "Cancel" }
  const confirmLabel = { children: confirmButtonText }
  const seldonRefs = {
    dialogContent: { style: styles.content, children: content },
    dialogCancel: { onClick: onClose },
    dialogConfirm: { onClick: handleConfirm },
  }

  return (
    <WindowOverlay
      modal
      onClose={onClose}
      x={x}
      y={y}
      width={width}
      height={height}
      moveControls={moveControls}
      dragConstraints={dragConstraints}
      onResizeStart={onResizeStart}
      onResize={onResize}
      getRect={getRect}
      resizeSides={DIALOG_RESIZE_SIDES}
      minWidth={minWidth}
      minHeight={minHeight}
    >
      <PanelDialog
        data-testid="catalog-dialog"
        bar={barHandle}
        textTitle={dialogTitle}
        comboboxFieldSearch={searchField}
        input={searchInput}
        buttonIconic={searchClear}
        button4={{}}
        textLabel4={cancelLabel}
        button5={{}}
        textLabel5={confirmLabel}
        seldonRefs={seldonRefs}
        style={styles.dialog}
      />
    </WindowOverlay>
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
  const handleClick = useCallback(() => onSelect(item.id), [onSelect, item.id])
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
    width: "100%",
    height: "100%",
  },
  dragHandle: {
    cursor: "grab",
    userSelect: "none",
    touchAction: "none",
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
  catalogGrid: {
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "var(--sdn-gaps-compact)",
  },
  row: {
    cursor: "pointer",
    width: "100%",
  },
  rowSelected: {
    cursor: "pointer",
    width: "100%",
    backgroundColor:
      "color-mix(in srgb, var(--sdn-swatch-white) 10%, transparent)",
  },
  empty: {
    width: "100%",
  },
  hidden: {
    display: "none",
  },
}

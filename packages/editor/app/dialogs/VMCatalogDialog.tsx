"use client"

import {
  CSSProperties,
  ChangeEvent,
  PointerEvent,
  useCallback,
  useMemo,
  useState,
} from "react"
import { useHotkeys } from "react-hotkeys-hook"
import { useFloatingPanel } from "@app/panels/hooks/use-floating-panel"
import { ItemCatalog } from "@seldon/components/elements/ItemCatalog"
import { Container } from "@seldon/components/frames/Container"
import { DialogCatalog } from "@seldon/components/modules/DialogCatalog"
import { ListStandardCatalog } from "@seldon/components/parts/ListStandardCatalog"
import { IconProps } from "@seldon/components/primitives/Icon"
import { TextSubtitle } from "@seldon/components/primitives/TextSubtitle"
import { PANEL_INITIAL_HEIGHT, PANEL_INITIAL_WIDTH } from "@app/constants"
import { ModalOverlay } from "./ModalOverlay"
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
 * `DialogCatalog` is a complete modal surface, so it renders inside `ModalOverlay`,
 * a backdrop-backed portal that the title bar drags and the left, right, and
 * bottom edges resize.
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

  const {
    x,
    y,
    width,
    height,
    handleResizeStart,
    handleResize,
    moveControls,
    dragConstraints,
  } = useFloatingPanel({
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
  // The shell forwards its own cancel/confirm icon and label slots (small size),
  // so the button leaves are wired through DialogCatalog's top-level props. The
  // cancel/confirm icons ride the shell defaults; only the labels need content.
  // `button3: null` suppresses the third BarButtons slot the shell does not use.
  const barButtons = { button3: null }
  const cancelLabel = { children: "Cancel" }
  const confirmLabel = { children: confirmButtonText }
  const seldonRefs = {
    dialogContent: { style: styles.content, children: content },
    dialogCancel: { onClick: onClose },
    dialogConfirm: { onClick: handleConfirm },
  }

  return (
    <ModalOverlay
      onClose={onClose}
      x={x}
      y={y}
      width={width}
      height={height}
      moveControls={moveControls}
      dragConstraints={dragConstraints}
      onResizeStart={handleResizeStart}
      onResize={handleResize}
    >
      <DialogCatalog
        data-testid="catalog-dialog"
        bar={barHandle}
        textTitle={dialogTitle}
        comboboxFieldSearch={searchField}
        input={searchInput}
        buttonIconic={searchClear}
        barButtons={barButtons}
        textLabel={cancelLabel}
        textLabel2={confirmLabel}
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
    width: "100%",
    height: "100%",
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
    backgroundColor: "color-mix(in srgb, var(--sdn-swatch-white) 10%, transparent)",
  },
  empty: {
    width: "100%",
  },
  hidden: {
    display: "none",
  },
}

"use client"

import { useComponentDragSession } from "@app/canvas/hooks/use-component-drag-session"
import { useEditorConfig } from "@app/editor/hooks/use-editor-config"
import { usePanel } from "@app/editor/hooks/use-panel"
import { useTool } from "@app/editor/hooks/use-tool"
import { FloatingPanel } from "@app/windows/FloatingPanel"
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
import { ItemCatalog } from "@seldon/components/elements/ItemCatalog"
import { Frame } from "@seldon/components/frames/Frame"
import { PanelPalette } from "@seldon/components/modules/PanelPalette"
import { BarFilter } from "@seldon/components/parts/BarFilter"
import { ListStandardCatalog } from "@seldon/components/parts/ListStandardCatalog"
import { TextSubtitle } from "@seldon/components/primitives/TextSubtitle"
import { TextTitle } from "@seldon/components/primitives/TextTitle"
import { useCallback, useEffect, useMemo, useRef } from "react"

import { useDialog } from "../../dialogs/hooks/use-dialog"

import type { CatalogComponentItem } from "../../dialogs/hooks/use-dialog"
import type { FloatingPanelApi } from "@app/windows/FloatingPanel"
import type { ComponentDragPayload } from "@seldon/editor/lib/workspace/component-drag"
import type { CSSProperties, ChangeEvent } from "react"

const EMPTY_SLOT = {}
const INITIAL_HEIGHT = 520
const INITIAL_WIDTH = 420

export function ComponentPaletteController() {
  const { componentPaletteOpen, closeComponentPalette } = usePanel()

  if (!componentPaletteOpen) return null

  return <ComponentPalette close={closeComponentPalette} />
}

function ComponentPalette({ close }: { close: () => void }) {
  const { componentPaletteRect, setComponentPaletteRect } = useEditorConfig()
  const showComponent = useCallback(() => true, [])
  const showAuthored = useCallback(() => true, [])
  const { categories, query, setQuery } = useDialog({
    shouldShowComponent: showComponent,
    shouldShowAuthored: showAuthored,
  })
  const visibleCategories = useMemo(
    () => categories.filter((category) => category.items.length > 0),
    [categories],
  )
  const onQueryChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setQuery(event.currentTarget.value),
    [setQuery],
  )
  const onClearQuery = useCallback(() => setQuery(""), [setQuery])
  const renderPalette = useCallback(
    (api: FloatingPanelApi) => {
      const content = visibleCategories.map((category) => (
        <ListStandardCatalog key={category.category}>
          <TextSubtitle>{category.category}</TextSubtitle>
          {category.items.map((item) => (
            <ComponentDragSource key={item.id} item={item} />
          ))}
        </ListStandardCatalog>
      ))
      const filter = (
        <BarFilter
          comboboxField={EMPTY_SLOT}
          input={filterInput}
          buttonIconic={EMPTY_SLOT}
          seldonRefs={{
            filterField: { onPointerDown: api.startDrag },
            filterFieldClear: { onClick: onClearQuery },
          }}
        />
      )
      const topBar = <TextTitle>Components</TextTitle>
      const topBarSlot = { children: topBar }
      const contentSlot = { children: content, style: contentStyle }
      const bottomBarSlot = { children: filter }
      const seldonRefs = {
        paletteTopBar: { onPointerDown: api.startDrag },
        paletteClose: { onClick: close, "data-testid": "component-palette-close" },
      }
      const palette = (
        <PanelPalette
          buttonIconic={null}
          buttonIconic2={EMPTY_SLOT}
          frame2={topBarSlot}
          frame3={contentSlot}
          frame5={bottomBarSlot}
          seldonRefs={seldonRefs}
          style={panelStyle}
          data-testid="component-palette"
        />
      )

      return palette
    },
    [close, onClearQuery, onQueryChange, query, visibleCategories],
  )
  const filterInput = { onChange: onQueryChange, value: query }
  const floatingPanel = (
    <FloatingPanel
      initialHeight={INITIAL_HEIGHT}
      initialWidth={INITIAL_WIDTH}
      onClose={close}
      onRectChange={setComponentPaletteRect}
      paletteId="component-palette"
      rect={componentPaletteRect}
      testId="component-palette"
    >
      {renderPalette}
    </FloatingPanel>
  )

  return floatingPanel
}

function ComponentDragSource({ item }: { item: CatalogComponentItem }) {
  const ref = useRef<HTMLElement | null>(null)
  const { setActiveTool } = useTool()
  const { begin, clear } = useComponentDragSession()
  const payload = useMemo<ComponentDragPayload>(
    () =>
      item.variantId
        ? { kind: "authored", variantId: item.variantId }
        : { componentId: item.componentId, kind: "catalog" },
    [item.componentId, item.variantId],
  )

  const refs = {
    catalogIcon: { icon: item.icon },
    catalogLabel: { children: item.name },
    catalogVariant: { children: item.description },
  }

  useEffect(() => {
    const element = ref.current

    if (!element) return

    return draggable({
      element,
      getInitialData: () => ({ action: "component-palette-insert", payload }),
      onDragStart: () => {
        begin(payload)
        setActiveTool("component")
      },
      onDrop: () => {
        clear()
        setActiveTool("select")
      },
    })
  }, [begin, clear, payload, setActiveTool])
  const testId = `component-palette-item-${item.id}`
  const itemContent = (
    <ItemCatalog
      icon={EMPTY_SLOT}
      seldonRefs={refs}
      textSubtitle={EMPTY_SLOT}
      textTitle={EMPTY_SLOT}
      data-testid={testId}
    />
  )
  const dragSource = <Frame ref={ref}>{itemContent}</Frame>

  return dragSource
}

const panelStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  height: "100%",
  width: "100%",
}

const contentStyle: CSSProperties = {
  flex: 1,
  minHeight: 0,
  overflowY: "auto",
}

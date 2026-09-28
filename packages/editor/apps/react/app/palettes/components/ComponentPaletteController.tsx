"use client"

import { useComponentDragSession } from "@app/canvas/hooks/use-component-drag-session"
import { useEditorConfig } from "@app/editor/hooks/use-editor-config"
import { usePanel } from "@app/editor/hooks/use-panel"
import { useTool } from "@app/editor/hooks/use-tool"
import { FloatingPanel } from "@app/windows/FloatingPanel"
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
import { Frame } from "@seldon/components/frames/Frame"
import { PanelComponents } from "@seldon/components/modules/PanelComponents"
import { ListStandardCatalog } from "@seldon/components/parts/ListStandardCatalog"
import { useCallback, useEffect, useMemo, useRef } from "react"

import { useDialog } from "../../dialogs/hooks/use-dialog"
import { ComponentCatalogPreview } from "./ComponentCatalogPreview"

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
        <ListStandardCatalog
          container={{
            children: category.items.map((item) => (
              <ComponentDragSource category={category.category} key={item.id} item={item} />
            )),
          }}
          itemCatalog={null}
          key={category.category}
          textSubtitle={EMPTY_SLOT}
        />
      ))
      const seldonRefs = {
        componentsPaletteTopBar: { onPointerDown: api.startDrag },
        componentsPaletteClose: { onClick: close, "data-testid": "component-palette-close" },
        componentsPaletteContents: { children: content, style: contentStyle },
        componentsPaletteFilterClear: { onClick: onClearQuery },
        componentsPaletteFilterInput: filterInput,
      }
      const palette = (
        <PanelComponents
          barState={EMPTY_SLOT}
          barFilter={EMPTY_SLOT}
          buttonIconic={null}
          buttonIconic2={EMPTY_SLOT}
          comboboxField={EMPTY_SLOT}
          seldonRefs={seldonRefs}
          style={panelStyle}
          data-testid="component-palette"
          textTitle={EMPTY_SLOT}
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

interface ComponentDragSourceProps {
  category: string
  item: CatalogComponentItem
}

function ComponentDragSource({ category, item }: ComponentDragSourceProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const { setActiveTool } = useTool()
  const { begin, clear } = useComponentDragSession()
  const payload = useMemo<ComponentDragPayload>(
    () =>
      item.variantId
        ? { kind: "authored", variantId: item.variantId }
        : { componentId: item.componentId, kind: "catalog" },
    [item.componentId, item.variantId],
  )

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
  const preview = (
    <ComponentCatalogPreview componentId={item.componentId} variantId={item.variantId} />
  )
  const itemContent = (
    <ListStandardCatalog
      frame={{ children: preview, style: previewFrameStyle }}
      itemCatalog={EMPTY_SLOT}
      textSubtitle={null}
      textSubtitle2={{ children: category }}
      textSubtitle3={{ children: item.description }}
      textTitle={{ children: item.name }}
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

const previewFrameStyle: CSSProperties = {
  position: "relative",
}

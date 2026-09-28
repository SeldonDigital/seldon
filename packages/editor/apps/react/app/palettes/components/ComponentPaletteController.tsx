"use client"

import { useComponentDragSession } from "@app/canvas/hooks/use-component-drag-session"
import { useEditorConfig } from "@app/editor/hooks/use-editor-config"
import { usePanel } from "@app/editor/hooks/use-panel"
import { useTool } from "@app/editor/hooks/use-tool"
import { FloatingPanel } from "@app/windows/FloatingPanel"
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
import { ItemCatalog } from "@seldon/components/elements/ItemCatalog"
import { Frame } from "@seldon/components/frames/Frame"
import { PanelComponents } from "@seldon/components/modules/PanelComponents"
import { ListStandardCatalog } from "@seldon/components/parts/ListStandardCatalog"
import { TextSubtitle } from "@seldon/components/primitives/TextSubtitle"
import { TextTitle } from "@seldon/components/primitives/TextTitle"
import { useCallback, useEffect, useMemo, useRef } from "react"

import { useDialog } from "../../dialogs/hooks/use-dialog"
import { ComponentCatalogPreview } from "./ComponentCatalogPreview.bespoke"

import type { CatalogComponentItem } from "../../dialogs/hooks/use-dialog"
import type { FloatingPanelApi } from "@app/windows/FloatingPanel"
import type { ComponentDragPayload } from "@seldon/editor/lib/workspace/component-drag"
import type { CSSProperties, ChangeEvent } from "react"

const EMPTY_SLOT = {}
const INITIAL_HEIGHT = 520
const INITIAL_WIDTH = 420
const CATALOG_ITEM_CLASS = "sdn-item-catalog--yumy"
const CATALOG_IMAGE_CLASS = "sdn-frame sdn-frame--pg9d"
const CATALOG_COPY_CLASS = "sdn-frame sdn-frame--nhfs"
const CATALOG_NAME_CLASS = "sdn-text-subtitle--uv0m"
const CATALOG_VARIANT_CLASS = "sdn-text-subtitle--glvh"
const CATALOG_METADATA_CLASS = "sdn-text-subtitle--hq8p"

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
  const filterInput = { onChange: onQueryChange, value: query }
  const renderPalette = useCallback(
    (api: FloatingPanelApi) => {
      const content = visibleCategories.map((category) => (
        <ListStandardCatalog
          container={{
            children: category.items.map((item) => (
              <ComponentDragSource key={item.id} item={item} />
            )),
          }}
          itemCatalog={null}
          key={category.category}
          textSubtitle={{ children: category.category }}
        />
      ))
      const seldonRefs = {
        componentsPaletteTopBar: { onPointerDown: api.startDrag },
        componentsPaletteClose: { onClick: close, "data-testid": "component-palette-close" },
        componentsPaletteContents: { children: content, style: contentsStyle },
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
  item: CatalogComponentItem
}

function ComponentDragSource({ item }: ComponentDragSourceProps) {
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
  const name = item.name
  const description = item.description
  const metadataText = item.details
  const preview = <ComponentCatalogPreview componentId={item.componentId} />
  const metadata = metadataText ? (
    <TextSubtitle className={CATALOG_METADATA_CLASS}>{metadataText}</TextSubtitle>
  ) : null
  const variantLabel = <TextSubtitle className={CATALOG_VARIANT_CLASS}>{description}</TextSubtitle>
  const nameLabel = <TextTitle className={CATALOG_NAME_CLASS}>{name}</TextTitle>
  const imageFrame = <Frame className={CATALOG_IMAGE_CLASS}>{preview}</Frame>
  const copyFrame = (
    <Frame className={CATALOG_COPY_CLASS}>
      {nameLabel}
      {variantLabel}
      {metadata}
    </Frame>
  )
  const itemContent = (
    <ItemCatalog className={CATALOG_ITEM_CLASS} data-testid={testId}>
      {imageFrame}
      {copyFrame}
    </ItemCatalog>
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

const contentsStyle: CSSProperties = {
  flex: 1,
  minHeight: 0,
  overflowY: "auto",
}


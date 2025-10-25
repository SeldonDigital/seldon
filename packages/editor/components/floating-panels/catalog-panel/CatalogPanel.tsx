import { Grid } from "@components/seldon/custom/Grid"
import { AvatarIcon } from "@components/seldon/elements/AvatarIcon"
import { ButtonBarPrimary } from "@components/seldon/elements/ButtonBarPrimary"
import { TextEditSearch } from "@components/seldon/elements/TextEditSearch"
import { FrameScroller } from "@components/seldon/frames/FrameScroller"
import { IconProps } from "@components/seldon/primitives/Icon"
import { Label } from "@components/seldon/primitives/Label"
import { useAddToast } from "@components/toaster/use-add-toast"
import { FloatingPanel } from "@components/ui/floating-panel/FloatingPanel"
import { Target } from "@lib/types"
import { useWorkspace } from "@lib/workspace/use-workspace"
import React, { CSSProperties, useCallback, useMemo, useState } from "react"

import { catalog } from "@seldon/core/components/catalog"
import { ComponentIcon, ComponentId } from "@seldon/core/components/constants"
import { ComponentSchema } from "@seldon/core/components/types"
import { VariantId } from "@seldon/core/index"
import { getVariantById } from "@seldon/core/workspace/helpers/get-variant-by-id"
import { workspaceService } from "@seldon/core/workspace/services/workspace.service"

const categoryConfigs = [
  { category: "Screens", schemas: catalog.screens },
  { category: "Modules", schemas: catalog.modules },
  { category: "Parts", schemas: catalog.parts },
  { category: "Elements", schemas: catalog.elements },
  { category: "Primitives", schemas: catalog.primitives },
  { category: "Frames", schemas: catalog.frames },
]

export type CatalogItem = {
  componentId: ComponentId
  variantId?: VariantId
  icon: ComponentIcon
  name: string
  description: string
}

export type FilterComponentPredicate = (schema: ComponentSchema) => boolean

export function CatalogPanel({
  title,
  onPick,
  shouldShowComponent,
  confirmButtonText,
  onClose,
  target,
  task,
}: {
  title?: string
  onPick: (component: CatalogItem) => void
  shouldShowComponent: FilterComponentPredicate
  confirmButtonText: string
  onClose: () => void
  target?: Target | null
  task: "search_all" | "search_catalog"
}) {
  const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null)
  const { workspace } = useWorkspace()
  const [query, setQuery] = useState("")
  // We filter the results based on the query until the user submits the query
  // after which we will filter the results based on response from the AI.
  // If the user changes the query, we will reset the filter type to "query"
  const [filterType, setFilterType] = useState<"query" | "ai">("query")
  const addToast = useAddToast()

  const submit = useCallback(async () => {
    try {
      setFilterType("ai")
    } catch (error) {
      if (error instanceof Error) {
        addToast(error.message)
      }
    }
  }, [addToast])

  const categories = useMemo(() => {
    return categoryConfigs.map(({ category, schemas }) => {
      const variants: CatalogItem[] = schemas
        // Filter out components that don't match the shouldShowComponent filter
        .filter((schema) => shouldShowComponent(schema))

        .flatMap((schema) => {
          const board = workspace.boards[schema.id]

          if (board) {
            // If board exists, get all variants
            return Object.values(board.variants).map((variantId) => {
              const variant = getVariantById(variantId, workspace)
              return {
                componentId: schema.id,
                variantId,
                name: schema.name,
                icon: schema.icon,
                description: workspaceService.isDefaultVariant(variant)
                  ? "Default"
                  : variant.label,
              }
            })
          } else {
            // If no board exists, use default variant
            return [
              {
                componentId: schema.id,
                name: schema.name,
                icon: schema.icon,
                description: "Default",
              },
            ]
          }
        })

      return {
        category,
        variants,
      }
    })
  }, [shouldShowComponent, filterType, query, workspace])

  const hasResults = categories.some(({ variants }) => variants.length > 0)

  function pickItem(item: CatalogItem) {
    onPick(item)
    setSelectedItem(null)
    // We need to requestAnimationFrame because onPick needs to trigger useEffects before closing the panel
    requestAnimationFrame(onClose)
  }

  return (
    <FloatingPanel
      closeOnClickOutside
      handleClose={onClose}
      testId="catalog-panel"
      title={title}
    >
      <TextEditSearch
        className="seldon-instance child-textEdit-7iwlJ2"
        frameProps={{
          className: "child-input-imzqxM",
          style: styles.inputWrapper,
        }}
        frameInputProps={{
          value: query,
          onChange: (e) => setQuery(e.target.value),
          placeholder: "Search components...",
          disabled: false,
          autoFocus: true,
          className: "child-input-E4MGjq",
          style: styles.input,
          // @ts-expect-error - data-testid is not a valid prop for Input
          "data-testid": "catalog-panel-search-input",
        }}
        frameIconProps={{
          className: "seldon-instance child-icon-GEGhH3",
        }}
        frameButtonIconicProps={{
          disabled: false,
          onClick: submit,
          className: "seldon-instance child-button-lE4yjU",
        }}
      />

      <FrameScroller
        className="child-frameScroller-45OuwL"
        style={styles.scroller}
      >
        {!hasResults && (
          <Label className="seldon-instance child-label-9J3xaw">
            No results found
          </Label>
        )}
        {categories
          .filter(({ variants }) => variants.length > 0)
          .map(({ category, variants }) => (
            <React.Fragment key={category}>
              <Label
                key={category}
                className="seldon-instance child-label-9J3xaw"
              >
                {category}
              </Label>
              <Grid columns={3} gap={8}>
                {variants.map((item) => {
                  const isSelected = selectedItem === item
                  return (
                    <AvatarIcon
                      key={item.variantId ?? item.componentId}
                      onDoubleClick={() => pickItem(item)}
                      onClick={() => setSelectedItem(item)}
                      style={styles.listItem}
                      className={
                        isSelected
                          ? "variant-avatarIcon-RAKw9p"
                          : "variant-avatarIcon-default"
                      }
                      iconProps={{
                        className: isSelected
                          ? "child-icon-RCda9T"
                          : "child-icon-2cx8P5",
                        icon: item.icon as IconProps["icon"],
                      }}
                      textblockTitleTitleProps={{
                        children: item.name,
                        className: isSelected
                          ? "child-title-Z0nv06"
                          : "child-title-uS4kXt",
                      }}
                      textblockTitleSubtitleProps={{
                        children: item.description,
                        className: isSelected
                          ? "child-subtitle-2eTIiz"
                          : "child-subtitle--5JG0D",
                      }}
                      data-testid={`catalog-item-${item.variantId ?? item.componentId}`}
                    />
                  )
                })}
              </Grid>
            </React.Fragment>
          ))}
      </FrameScroller>
      {/* Footer with Add to Canvas button */}
      <ButtonBarPrimary
        buttonProps={{ style: { display: "none" } }}
        buttonPrimary1Props={{
          onClick: () => pickItem(selectedItem!),
          type: "button",
          disabled: !selectedItem,
          // @ts-expect-error - data-testid is not a valid prop for ButtonProps
          "data-testid": "catalog-panel-add-component-button",
        }}
        buttonPrimary1LabelProps={{
          children: confirmButtonText,
        }}
      />
    </FloatingPanel>
  )
}

const styles: Record<string, CSSProperties> = {
  input: {
    flex: "1 1 0",
    height: "100%",
  },
  inputWrapper: {
    border: "var(--hairline) solid hsl(0deg 4% 98% / 10%)",
  },
  spinner: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: "translateY(-50%)",
  },
  scroller: {
    scrollbarGutter: "stable",
    scrollbarWidth: "thin",
    display: "block",
  },
  listItem: {
    cursor: "pointer",
    width: "100%",
    justifyContent: "start",
  },
}

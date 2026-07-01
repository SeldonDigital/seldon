import React, { CSSProperties, useState } from "react"
import { Grid } from "@seldon/components/chrome/custom/Grid"
import { AvatarIcon } from "@seldon/components/chrome/elements/AvatarIcon"
import { ButtonBarPrimary } from "@seldon/components/chrome/elements/ButtonBarPrimary"
import { TextEditSearch } from "@seldon/components/chrome/elements/TextEditSearch"
import { FrameScroller } from "@seldon/components/chrome/frames/FrameScroller"
import { IconProps } from "@seldon/components/chrome/primitives/Icon"
import { Label } from "@seldon/components/chrome/primitives/Label"
import { FloatingPanel } from "@app/panels/FloatingPanel"

export type CatalogPanelItem = {
  id: string
  icon: string
  name: string
  description: string
}

export type CatalogPanelCategory<T extends CatalogPanelItem> = {
  category: string
  items: T[]
}

/**
 * Presentational picker panel. Parents own the data: they pass already-filtered
 * categories and the search query state.
 */
export function CatalogPanel<T extends CatalogPanelItem>({
  title,
  confirmButtonText,
  onClose,
  onPick,
  categories,
  query,
  onQueryChange,
}: {
  title?: string
  confirmButtonText: string
  onClose: () => void
  onPick: (item: T) => void
  categories: CatalogPanelCategory<T>[]
  query: string
  onQueryChange: (query: string) => void
}) {
  const [selectedItem, setSelectedItem] = useState<T | null>(null)

  const hasResults = categories.some(({ items }) => items.length > 0)
  const visibleCategories = categories.filter(({ items }) => items.length > 0)

  function pickItem(item: T) {
    onPick(item)
    setSelectedItem(null)
    // We need to requestAnimationFrame because onPick needs to trigger useEffects before closing the panel
    requestAnimationFrame(onClose)
  }

  const handleConfirm = () => {
    if (selectedItem) {
      pickItem(selectedItem)
    }
  }

  const noResultsLabel = hasResults ? null : (
    <Label className="seldon-instance child-label-9J3xaw">
      No results found
    </Label>
  )

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
          onChange: (e) => onQueryChange(e.target.value),
          placeholder: "Search...",
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
          className: "seldon-instance child-button-lE4yjU",
          style: { display: "none" },
        }}
      />

      <FrameScroller
        className="child-frameScroller-45OuwL"
        style={styles.scroller}
      >
        {noResultsLabel}
        {visibleCategories.map(({ category, items }) => (
          <CatalogCategorySection
            key={category}
            category={category}
            items={items}
            selectedItem={selectedItem}
            onSelect={setSelectedItem}
            onPick={pickItem}
          />
        ))}
      </FrameScroller>
      {/* Footer with Add to Canvas button */}
      <ButtonBarPrimary
        buttonProps={{ style: { display: "none" } }}
        buttonPrimary1Props={{
          onClick: handleConfirm,
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

interface CatalogCategorySectionProps<T extends CatalogPanelItem> {
  category: string
  items: T[]
  selectedItem: T | null
  onSelect: (item: T) => void
  onPick: (item: T) => void
}

function CatalogCategorySection<T extends CatalogPanelItem>({
  category,
  items,
  selectedItem,
  onSelect,
  onPick,
}: CatalogCategorySectionProps<T>) {
  return (
    <React.Fragment>
      <Label className="seldon-instance child-label-9J3xaw">{category}</Label>
      <Grid columns={3} gap={8}>
        {items.map((item) => (
          <CatalogItemTile
            key={item.id}
            item={item}
            isSelected={selectedItem === item}
            onSelect={onSelect}
            onPick={onPick}
          />
        ))}
      </Grid>
    </React.Fragment>
  )
}

interface CatalogItemTileProps<T extends CatalogPanelItem> {
  item: T
  isSelected: boolean
  onSelect: (item: T) => void
  onPick: (item: T) => void
}

function CatalogItemTile<T extends CatalogPanelItem>({
  item,
  isSelected,
  onSelect,
  onPick,
}: CatalogItemTileProps<T>) {
  const handleClick = () => onSelect(item)
  const handleDoubleClick = () => onPick(item)

  return (
    <AvatarIcon
      onDoubleClick={handleDoubleClick}
      onClick={handleClick}
      style={styles.listItem}
      className={
        isSelected ? "variant-avatarIcon-RAKw9p" : "variant-avatarIcon-default"
      }
      iconProps={{
        className: isSelected ? "child-icon-RCda9T" : "child-icon-2cx8P5",
        icon: item.icon as IconProps["icon"],
      }}
      textblockTitleTitleProps={{
        children: item.name,
        className: isSelected ? "child-title-Z0nv06" : "child-title-uS4kXt",
      }}
      textblockTitleSubtitleProps={{
        children: item.description,
        className: isSelected
          ? "child-subtitle-2eTIiz"
          : "child-subtitle--5JG0D",
      }}
      data-testid={`catalog-item-${item.id}`}
    />
  )
}

const styles: Record<string, CSSProperties> = {
  input: {
    flex: "1 1 0",
    height: "100%",
  },
  inputWrapper: {
    border:
      "var(--hairline) solid color-mix(in srgb, var(--sdn-swatch-white) 10%, transparent)",
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

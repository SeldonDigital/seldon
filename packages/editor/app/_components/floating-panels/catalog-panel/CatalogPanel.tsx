import React, { CSSProperties, useState } from "react"
import { Grid } from "@components/seldon/custom/Grid"
import { AvatarIcon } from "@components/seldon/elements/AvatarIcon"
import { ButtonBarPrimary } from "@components/seldon/elements/ButtonBarPrimary"
import { TextEditSearch } from "@components/seldon/elements/TextEditSearch"
import { FrameScroller } from "@components/seldon/frames/FrameScroller"
import { IconProps } from "@components/seldon/primitives/Icon"
import { Label } from "@components/seldon/primitives/Label"
import { FloatingPanel } from "@components/ui/floating-panel/FloatingPanel"

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
 * categories, the search query state, and an optional AI search trigger.
 */
export function CatalogPanel<T extends CatalogPanelItem>({
  title,
  confirmButtonText,
  onClose,
  onPick,
  categories,
  query,
  onQueryChange,
  onSubmitSearch,
  isSearching = false,
}: {
  title?: string
  confirmButtonText: string
  onClose: () => void
  onPick: (item: T) => void
  categories: CatalogPanelCategory<T>[]
  query: string
  onQueryChange: (query: string) => void
  onSubmitSearch?: () => void
  isSearching?: boolean
}) {
  const [selectedItem, setSelectedItem] = useState<T | null>(null)

  const hasResults = categories.some(({ items }) => items.length > 0)

  function pickItem(item: T) {
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
          onChange: (e) => onQueryChange(e.target.value),
          placeholder: "Search...",
          disabled: isSearching,
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
          disabled: isSearching || !onSubmitSearch,
          onClick: onSubmitSearch,
          className: "seldon-instance child-button-lE4yjU",
          style: onSubmitSearch ? undefined : { display: "none" },
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
          .filter(({ items }) => items.length > 0)
          .map(({ category, items }) => (
            <React.Fragment key={category}>
              <Label
                key={category}
                className="seldon-instance child-label-9J3xaw"
              >
                {category}
              </Label>
              <Grid columns={3} gap={8}>
                {items.map((item) => {
                  const isSelected = selectedItem === item
                  return (
                    <AvatarIcon
                      key={item.id}
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
                      data-testid={`catalog-item-${item.id}`}
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

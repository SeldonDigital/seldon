/*****
 *
 * This code was generated using Seldon (https://github.com/SeldonDigital/seldon)
 *
 * License: https://github.com/SeldonDigital/seldon/blob/main/LICENSE.md
 * Do not redistribute or sublicense without permission.
 *
 * You may not use this software, or any derivative works of it, in whole or in part,
 * for the purposes of training, fine-tuning, or otherwise improving (directly or indirectly)
 * any machine learning or artificial intelligence system without written permission.
 *
 *****/
import { ButtonIconic } from "../elements/ButtonIconic"
import { ComboboxField } from "../elements/ComboboxField"
import { ItemCatalog } from "../elements/ItemCatalog"
import { Container } from "../frames/Container"
import { Frame } from "../frames/Frame"
import { HTMLDiv } from "../native-react/HTML.Div"
import { BarFilter } from "../parts/BarFilter"
import { BarState } from "../parts/BarState"
import { ListStandardCatalog } from "../parts/ListStandardCatalog"
import { TextSubtitle } from "../primitives/TextSubtitle"
import { TextTitle } from "../primitives/TextTitle"
import { combineClassNames } from "../utils/class-name"
import { mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

import type { ButtonIconicProps } from "../elements/ButtonIconic"
import type { ComboboxFieldProps } from "../elements/ComboboxField"
import type { ItemCatalogProps } from "../elements/ItemCatalog"
import type { ContainerProps } from "../frames/Container"
import type { FrameProps } from "../frames/Frame"
import type { BarFilterProps } from "../parts/BarFilter"
import type { BarStateProps } from "../parts/BarState"
import type { ListStandardCatalogProps } from "../parts/ListStandardCatalog"
import type { IconProps } from "../primitives/Icon"
import type { InputProps } from "../primitives/Input"
import type { TextSubtitleProps } from "../primitives/TextSubtitle"
import type { TextTitleProps } from "../primitives/TextTitle"
import type { SeldonRefs } from "../utils/merge-slot"
import type { HTMLAttributes } from "react"

export interface PanelComponentsProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  frame?: FrameProps | null
  barState?: BarStateProps | null
  textTitle?: TextTitleProps | null
  buttonIconic?: ButtonIconicProps | null
  icon?: IconProps | null
  buttonIconic2?: ButtonIconicProps | null
  icon2?: IconProps | null

  frame2?: FrameProps | null
  listStandardCatalog?: ListStandardCatalogProps | null
  textSubtitle?: TextSubtitleProps | null
  container?: ContainerProps | null
  itemCatalog?: ItemCatalogProps | null
  frame3?: FrameProps | null
  frame4?: FrameProps | null
  textTitle2?: TextTitleProps | null
  textSubtitle2?: TextSubtitleProps | null
  textSubtitle3?: TextSubtitleProps | null

  frame5?: FrameProps | null
  barFilter?: BarFilterProps | null
  comboboxField?: ComboboxFieldProps | null
  icon3?: IconProps | null
  input?: InputProps | null
  buttonIconic3?: ButtonIconicProps | null
  icon4?: IconProps | null
}

//
// Default property values
//
const sdn: PanelComponentsProps = {
  role: "dialog",
  "aria-hidden": "false",
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--jbzn",
    "data-seldon-ref": "componentsPaletteTopBar",
  },
  barState: {
    className: "sdn-bar-state sdn-bar-state--mlcq",
  },
  textTitle: {
    children: "Components",
    className: "sdn-text-title sdn-text-title--sman",
    "data-seldon-ref": "componentsPaletteTitle",
  },
  buttonIconic: {
    className: "sdn-button-iconic sdn-button-iconic--tlj6",
  },
  icon: {
    icon: "seldon-more",
    className: "sdn-icon sdn-icon--mahk",
  },
  buttonIconic2: {
    className: "sdn-button-iconic sdn-button-iconic--tlj6",
    "data-seldon-ref": "componentsPaletteClose",
  },
  icon2: {
    icon: "material-close",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--mahk",
  },

  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--kpnm",
    "data-seldon-ref": "componentsPaletteContents",
  },
  listStandardCatalog: {
    className: "sdn-list-standard-catalog sdn-list-standard-catalog--7roj",
    "data-seldon-ref": "componentsCatalogList",
  },
  textSubtitle: {
    children: "Component Level",
    className: "sdn-text-subtitle sdn-text-subtitle--qgof",
    "data-seldon-ref": "componentsCatalogLevel",
  },
  container: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-container sdn-container--x52o",
  },
  itemCatalog: {
    className: "sdn-item-catalog sdn-item-catalog--yumy",
    "data-seldon-ref": "componentsCatalogItem",
  },
  frame3: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--pg9d",
    "data-seldon-ref": "componentsCatalogImage",
  },
  frame4: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--nhfs",
  },
  textTitle2: {
    children: "Component Name",
    className: "sdn-text-title sdn-text-subtitle--uv0m",
    "data-seldon-ref": "componentsCatalogName",
  },
  textSubtitle2: {
    children: "Default Variant",
    className: "sdn-text-subtitle sdn-text-subtitle--glvh",
    "data-seldon-ref": "componentsCatalogVariant",
  },
  textSubtitle3: {
    children: "Description · Tag · Tag · Tag",
    className: "sdn-text-subtitle sdn-text-subtitle--uvjq",
    "data-seldon-ref": "componentsCatalogMetadata",
  },

  frame5: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--rc9x",
    "data-seldon-ref": "componentsPaletteBottomBar",
  },
  barFilter: {
    className: "sdn-bar-filter sdn-bar-filter--hiy2",
    "data-seldon-ref": "componentsPaletteFilter",
  },
  comboboxField: {
    className: "sdn-combobox-field sdn-combobox-field--f36v",
  },
  icon3: {
    icon: "material-filterList",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
  },
  input: {
    placeholder: "Filter...",
    type: "text",
    role: "combobox",
    "aria-haspopup": "listbox",
    className: "sdn-input sdn-input--krby",
    "data-seldon-ref": "componentsPaletteFilterInput",
  },
  buttonIconic3: {
    className: "sdn-button-iconic sdn-button-iconic--csub",
    "data-seldon-ref": "componentsPaletteFilterClear",
  },
  icon4: {
    icon: "material-close",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--rftn",
  },
}

/**
 * Panel: PanelComponents
 * Level: Module
 * Intent: Schema for modal-style dialog panels with overlay behavior, used for alerts, confirmations, or embedded interactive content.
 * Tags: panel, dialog, modal, ui, overlay, popup, interaction, alert
 * Type: Inline
 *
 * Structure:
 *   Frame                   frame                -> componentsPaletteTopBar
 *     BarState              barState
 *       TextTitle           textTitle            -> componentsPaletteTitle
 *     ButtonIconic          buttonIconic
 *       Icon                icon
 *     ButtonIconic          buttonIconic2        -> componentsPaletteClose
 *       Icon                icon2
 *   Frame                   frame2               -> componentsPaletteContents
 *     ListStandardCatalog   listStandardCatalog  -> componentsCatalogList
 *       TextSubtitle        textSubtitle         -> componentsCatalogLevel
 *       Container           container
 *         ItemCatalog       itemCatalog          -> componentsCatalogItem
 *           Frame           frame3               -> componentsCatalogImage
 *           Frame           frame4
 *             TextTitle     textTitle2           -> componentsCatalogName
 *             TextSubtitle  textSubtitle2        -> componentsCatalogVariant
 *             TextSubtitle  textSubtitle3        -> componentsCatalogMetadata
 *   Frame                   frame5               -> componentsPaletteBottomBar
 *     BarFilter             barFilter            -> componentsPaletteFilter
 *       ComboboxField       comboboxField
 *         Icon              icon3
 *         Input             input                -> componentsPaletteFilterInput
 *         ButtonIconic      buttonIconic3        -> componentsPaletteFilterClear
 *           Icon            icon4
 *
 * @example
 * ```tsx
 * <PanelComponents
 *   role="dialog"
 *   aria-hidden="false"
 * />
 * ```
 */
export function PanelComponents({
  className = "",
  frame,
  barState,
  textTitle,
  buttonIconic,
  icon,
  buttonIconic2,
  icon2,

  frame2,
  listStandardCatalog,
  textSubtitle,
  container,
  itemCatalog,
  frame3,
  frame4,
  textTitle2,
  textSubtitle2,
  textSubtitle3,

  frame5,
  barFilter,
  comboboxField,
  icon3,
  input,
  buttonIconic3,
  icon4,

  children,
  seldonRefs,
  ...props
}: PanelComponentsProps) {
  const panelComponentsClassName = combineClassNames("sdn-panel-components", className)

  const frameProps = mergeSlot(sdn.frame, frame, seldonRefs)
  const barStateProps = mergeOptionalSlot(sdn.barState, barState, seldonRefs)
  const textTitleProps = mergeOptionalSlot(sdn.textTitle, textTitle, seldonRefs)
  const buttonIconicProps = mergeOptionalSlot(sdn.buttonIconic, buttonIconic, seldonRefs)
  const iconProps = mergeOptionalSlot(sdn.icon, icon, seldonRefs)
  const buttonIconic2Props = mergeOptionalSlot(sdn.buttonIconic2, buttonIconic2, seldonRefs)
  const icon2Props = mergeSlot(sdn.icon2, icon2, seldonRefs)

  const frame2Props = mergeSlot(sdn.frame2, frame2, seldonRefs)
  const listStandardCatalogProps = mergeOptionalSlot(
    sdn.listStandardCatalog,
    listStandardCatalog,
    seldonRefs,
  )
  const textSubtitleProps = mergeOptionalSlot(sdn.textSubtitle, textSubtitle, seldonRefs)
  const containerProps = mergeSlot(sdn.container, container, seldonRefs)
  const itemCatalogProps = mergeOptionalSlot(sdn.itemCatalog, itemCatalog, seldonRefs)
  const frame3Props = mergeSlot(sdn.frame3, frame3, seldonRefs)
  const frame4Props = mergeSlot(sdn.frame4, frame4, seldonRefs)
  const textTitle2Props = mergeOptionalSlot(sdn.textTitle2, textTitle2, seldonRefs)
  const textSubtitle2Props = mergeOptionalSlot(sdn.textSubtitle2, textSubtitle2, seldonRefs)
  const textSubtitle3Props = mergeOptionalSlot(sdn.textSubtitle3, textSubtitle3, seldonRefs)

  const frame5Props = mergeSlot(sdn.frame5, frame5, seldonRefs)
  const barFilterProps = mergeOptionalSlot(sdn.barFilter, barFilter, seldonRefs)
  const comboboxFieldProps = mergeOptionalSlot(sdn.comboboxField, comboboxField, seldonRefs)
  const icon3Props = mergeSlot(sdn.icon3, icon3, seldonRefs)
  const inputProps = mergeSlot(sdn.input, input, seldonRefs)
  const buttonIconic3Props = mergeSlot(sdn.buttonIconic3, buttonIconic3, seldonRefs)
  const icon4Props = mergeSlot(sdn.icon4, icon4, seldonRefs)

  return (
    <HTMLDiv
      className={panelComponentsClassName}
      data-seldon-ref={"componentsPalette"}
      role={sdn["role"]}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    >
      {children !== undefined ? (
        children
      ) : (
        <>
          <Frame {...frameProps}>
            {frameProps?.children !== undefined ? (
              frameProps?.children
            ) : (
              <>
                {barStateProps !== null && (
                  <BarState {...barStateProps}>
                    {textTitleProps !== null && <TextTitle {...textTitleProps} />}
                  </BarState>
                )}
                {buttonIconicProps !== null && (
                  <ButtonIconic {...buttonIconicProps} icon={iconProps} />
                )}
                {buttonIconic2Props !== null && (
                  <ButtonIconic {...buttonIconic2Props} icon={icon2Props} />
                )}
              </>
            )}
          </Frame>
          <Frame {...frame2Props}>
            {frame2Props?.children !== undefined ? (
              frame2Props?.children
            ) : (
              <>
                {listStandardCatalogProps !== null && (
                  <ListStandardCatalog {...listStandardCatalogProps}>
                    {textSubtitleProps !== null && <TextSubtitle {...textSubtitleProps} />}
                    <Frame {...containerProps}>
                      {itemCatalogProps !== null && (
                        <ItemCatalog {...itemCatalogProps}>
                          <Frame {...frame3Props} />
                          <Frame {...frame4Props}>
                            {textTitle2Props !== null && <TextTitle {...textTitle2Props} />}
                            {textSubtitle2Props !== null && (
                              <TextSubtitle {...textSubtitle2Props} />
                            )}
                            {textSubtitle3Props !== null && (
                              <TextSubtitle {...textSubtitle3Props} />
                            )}
                          </Frame>
                        </ItemCatalog>
                      )}
                    </Frame>
                  </ListStandardCatalog>
                )}
              </>
            )}
          </Frame>
          <Frame {...frame5Props}>
            {frame5Props?.children !== undefined ? (
              frame5Props?.children
            ) : (
              <>
                {barFilterProps !== null && (
                  <BarFilter {...barFilterProps}>
                    {comboboxFieldProps !== null && (
                      <ComboboxField
                        {...comboboxFieldProps}
                        icon={icon3Props}
                        input={inputProps}
                        buttonIconic={buttonIconic3Props}
                        icon2={icon4Props}
                      />
                    )}
                  </BarFilter>
                )}
              </>
            )}
          </Frame>
        </>
      )}
    </HTMLDiv>
  )
}

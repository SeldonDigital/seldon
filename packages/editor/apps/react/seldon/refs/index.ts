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

export type SeldonRef =
  | "catalogIcon"
  | "catalogItem"
  | "catalogItems"
  | "catalogLabel"
  | "catalogVariant"
  | "createComponentContainer"
  | "createComponentFrame"
  | "createComponentIntent"
  | "createComponentLevel"
  | "createComponentName"
  | "createComponentTags"
  | "Default"
  | "dialogCancel"
  | "dialogConfirm"
  | "dialogContent"
  | "dialogTitle"
  | "exportAllFontsNo"
  | "exportAllFontsNoIcon"
  | "exportAllFontsYes"
  | "exportAllFontsYesIcon"
  | "exportAllIconsNo"
  | "exportAllIconsNoIcon"
  | "exportAllIconsYes"
  | "exportAllIconsYesIcon"
  | "exportAllThemesNo"
  | "exportAllThemesNoIcon"
  | "exportAllThemesYes"
  | "exportAllThemesYesIcon"
  | "exportCancel"
  | "exportConfirm"
  | "exportFontLinksNo"
  | "exportFontLinksNoIcon"
  | "exportFontLinksYes"
  | "exportFontLinksYesIcon"
  | "exportHiddenNo"
  | "exportHiddenNoIcon"
  | "exportHiddenYes"
  | "exportHiddenYesIcon"
  | "exportPlatform"
  | "exportRootPath"
  | "exportSavedWorkspaceNo"
  | "exportSavedWorkspaceNoIcon"
  | "exportSavedWorkspaceYes"
  | "exportSavedWorkspaceYesIcon"
  | "exportScriptsNo"
  | "exportScriptsNoIcon"
  | "exportScriptsYes"
  | "exportScriptsYesIcon"
  | "exportWorkspaceName"
  | "filterActions"
  | "filterIcon"
  | "filterLabel"
  | "hariBar"
  | "hariClamp"
  | "hariClose"
  | "hariErrorIcon"
  | "hariErrorRetry"
  | "hariErrorRetryLabel"
  | "hariErrorText"
  | "hariInput"
  | "hariModel"
  | "hariModelLabel"
  | "hariOutcome"
  | "hariOutcomeIcon"
  | "hariOutcomeLabel"
  | "hariOutcomeText"
  | "hariReasoningBody"
  | "hariReasoningChevron"
  | "hariReasoningClamped"
  | "hariReasoningLabel"
  | "hariReasoningToggle"
  | "hariReplyText"
  | "hariReset"
  | "hariSelection"
  | "hariSelectionLabel"
  | "hariSend"
  | "hariSendIcon"
  | "hariStatusIcon"
  | "hariStatusLabel"
  | "hariThinking"
  | "hariThinkingLabel"
  | "hariTools"
  | "hariUserText"
  | "logo"
  | "menuComponent"
  | "menuDev"
  | "menuEdit"
  | "menuFile"
  | "menuMode"
  | "menus"
  | "menuState"
  | "menuTheme"
  | "menuView"
  | "nodeActions"
  | "nodeDisclosure"
  | "nodeDisclosureIcon"
  | "nodeDisplay"
  | "nodeDisplayIcon"
  | "nodeIcon"
  | "nodeLabel"
  | "objectsContainer"
  | "optionIcon"
  | "optionLabel"
  | "projectActions"
  | "projectIcon"
  | "projectLabel"
  | "propertiesContainer"
  | "propertyActions"
  | "propertyDisclosure"
  | "propertyDisclosureIcon"
  | "propertyFilter"
  | "propertyFilterClear"
  | "propertyLabel"
  | "propertyToggleActions"
  | "propertyToggleDisclosure"
  | "propertyToggleDisclosureIcon"
  | "propertyToggleIcon"
  | "propertyToggleLabel"
  | "propertyToggleSwitch"
  | "propertyValueIcon"
  | "propertyValueLabel"
  | "propertyValueMenu"
  | "refCard"
  | "refCardCondition"
  | "refCardControllerFrom"
  | "refCardControllerItem"
  | "refCardControllerName"
  | "refCardControllerPass"
  | "refCardControllerPath"
  | "refCardControllers"
  | "refCardPath"
  | "refCardView"
  | "refChip"
  | "refChipIcon"
  | "refChipName"
  | "searchActions"
  | "searchIcon"
  | "searchLabel"
  | "sectionActions"
  | "sectionAdd"
  | "sectionDisclosure"
  | "sectionDisclosureIcon"
  | "sectionLabel"
  | "sidebarComponents"
  | "sidebarResources"
  | "tool"
  | "turns"
  | "workspaceName"
  | "workspaceSave"

export interface SeldonRefView {
  component: string
  file: string
  slot: string | null
  type: string
  rendersWhen: "unless-null" | "when-passed"
}

export interface SeldonRefEntry {
  component: string
  nodeId: string
  className: string
  views: SeldonRefView[]
}

export const SELDON_REFS: Record<SeldonRef, SeldonRefEntry> = {
  catalogIcon: {
    component: "Icon",
    nodeId: "component-icon-meNEMxeY",
    className: "sdn-icon sdn-icon--mene",
    views: [
      {
        component: "ItemCatalog",
        file: "elements/ItemCatalog.tsx",
        slot: "icon",
        type: "IconProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  catalogItem: {
    component: "ItemCatalog",
    nodeId: "component-item-product",
    className: "sdn-item-catalog sdn-item",
    views: [
      {
        component: "ItemCatalog",
        file: "elements/ItemCatalog.tsx",
        slot: null,
        type: "ItemCatalogProps",
        rendersWhen: "unless-null",
      },
    ],
  },
  catalogItems: {
    component: "Container",
    nodeId: "component-container-x52OfMWH",
    className: "sdn-container sdn-container--x52o",
    views: [
      {
        component: "ListStandardCatalog",
        file: "parts/ListStandardCatalog.tsx",
        slot: "container",
        type: "ContainerProps",
        rendersWhen: "unless-null",
      },
    ],
  },
  catalogLabel: {
    component: "TextTitle",
    nodeId: "component-text-noun68PK",
    className: "sdn-text-title sdn-text-title--noun",
    views: [
      {
        component: "ItemCatalog",
        file: "elements/ItemCatalog.tsx",
        slot: "textTitle",
        type: "TextTitleProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  catalogVariant: {
    component: "TextSubtitle",
    nodeId: "component-text-R4oTaXSN",
    className: "sdn-text-subtitle sdn-text-subtitle--r4ot",
    views: [
      {
        component: "ItemCatalog",
        file: "elements/ItemCatalog.tsx",
        slot: "textSubtitle",
        type: "TextSubtitleProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  createComponentContainer: {
    component: "ItemCatalog",
    nodeId: "component-panel-eFZLmrJg",
    className: "sdn-item-catalog sdn-item-catalog--xhyo",
    views: [
      {
        component: "DialogCreateComponent",
        file: "modules/DialogCreateComponent.tsx",
        slot: "itemCatalog2",
        type: "ItemCatalogProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  createComponentFrame: {
    component: "ItemCatalog",
    nodeId: "component-item-xhYOpZp3",
    className: "sdn-item-catalog sdn-item-catalog--xhyo",
    views: [
      {
        component: "DialogCreateComponent",
        file: "modules/DialogCreateComponent.tsx",
        slot: "itemCatalog",
        type: "ItemCatalogProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  createComponentIntent: {
    component: "Input",
    nodeId: "component-panel-WC2KRJFl",
    className: "sdn-input sdn-input--qirj",
    views: [
      {
        component: "DialogCreateComponent",
        file: "modules/DialogCreateComponent.tsx",
        slot: "input3",
        type: "InputProps",
        rendersWhen: "unless-null",
      },
    ],
  },
  createComponentLevel: {
    component: "ComboboxField",
    nodeId: "component-formControl-HdymRu7r",
    className: "sdn-combobox-field sdn-combobox-field--hdym",
    views: [
      {
        component: "DialogCreateComponent",
        file: "modules/DialogCreateComponent.tsx",
        slot: "comboboxField",
        type: "ComboboxFieldProps",
        rendersWhen: "unless-null",
      },
    ],
  },
  createComponentName: {
    component: "Input",
    nodeId: "component-formControl-QiRj1M64",
    className: "sdn-input sdn-input--qirj",
    views: [
      {
        component: "DialogCreateComponent",
        file: "modules/DialogCreateComponent.tsx",
        slot: "input",
        type: "InputProps",
        rendersWhen: "unless-null",
      },
    ],
  },
  createComponentTags: {
    component: "Input",
    nodeId: "component-panel-1YblVT7S",
    className: "sdn-input sdn-input--qirj",
    views: [
      {
        component: "DialogCreateComponent",
        file: "modules/DialogCreateComponent.tsx",
        slot: "input4",
        type: "InputProps",
        rendersWhen: "unless-null",
      },
    ],
  },
  Default: {
    component: "ItemCatalog",
    nodeId: "component-item-hSnQ9Zqv",
    className: "sdn-item-catalog sdn-item-catalog--bg0n",
    views: [
      {
        component: "ListStandardProductList",
        file: "parts/ListStandardProductList.tsx",
        slot: "itemCatalog3",
        type: "ItemCatalogProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  dialogCancel: {
    component: "Button",
    nodeId: "component-bar-oHXIPFr4",
    className: "sdn-button sdn-button--wjtm",
    views: [
      {
        component: "PanelDialog",
        file: "modules/PanelDialog.tsx",
        slot: "button4",
        type: "ButtonProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  dialogConfirm: {
    component: "Button",
    nodeId: "component-bar-UpjLfdY0",
    className: "sdn-button sdn-button--upjl",
    views: [
      {
        component: "PanelDialog",
        file: "modules/PanelDialog.tsx",
        slot: "button5",
        type: "ButtonProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  dialogContent: {
    component: "Frame",
    nodeId: "component-panel-2wWoLkwm",
    className: "sdn-frame sdn-frame--2wwo",
    views: [
      {
        component: "PanelDialog",
        file: "modules/PanelDialog.tsx",
        slot: "frame",
        type: "FrameProps",
        rendersWhen: "unless-null",
      },
    ],
  },
  dialogTitle: {
    component: "TextTitle",
    nodeId: "component-panel-j8D9mUx4",
    className: "sdn-text-title sdn-text-title--eodu",
    views: [
      {
        component: "PanelDialog",
        file: "modules/PanelDialog.tsx",
        slot: "textTitle",
        type: "TextTitleProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  exportAllFontsNo: {
    component: "MenuItemRadio",
    nodeId: "component-panel-yVKBdxqz",
    className: "sdn-menu-item sdn-menu-item-radio--wifm",
    views: [
      {
        component: "DialogExportComponent",
        file: "modules/DialogExportComponent.tsx",
        slot: "menuItemRadio8",
        type: "MenuItemRadioProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  exportAllFontsNoIcon: {
    component: "Icon",
    nodeId: "component-panel-ELZAfUu6",
    className: "sdn-icon sdn-icon--3qou",
    views: [
      {
        component: "DialogExportComponent",
        file: "modules/DialogExportComponent.tsx",
        slot: "icon9",
        type: "IconProps",
        rendersWhen: "unless-null",
      },
    ],
  },
  exportAllFontsYes: {
    component: "MenuItemRadio",
    nodeId: "component-panel-e48Xe2Fa",
    className: "sdn-menu-item sdn-menu-item-radio--wifm",
    views: [
      {
        component: "DialogExportComponent",
        file: "modules/DialogExportComponent.tsx",
        slot: "menuItemRadio7",
        type: "MenuItemRadioProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  exportAllFontsYesIcon: {
    component: "Icon",
    nodeId: "component-panel-AAAIIBZA",
    className: "sdn-icon sdn-icon--3qou",
    views: [
      {
        component: "DialogExportComponent",
        file: "modules/DialogExportComponent.tsx",
        slot: "icon8",
        type: "IconProps",
        rendersWhen: "unless-null",
      },
    ],
  },
  exportAllIconsNo: {
    component: "MenuItemRadio",
    nodeId: "component-panel-rugVimbb",
    className: "sdn-menu-item sdn-menu-item-radio--wifm",
    views: [
      {
        component: "DialogExportComponent",
        file: "modules/DialogExportComponent.tsx",
        slot: "menuItemRadio10",
        type: "MenuItemRadioProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  exportAllIconsNoIcon: {
    component: "Icon",
    nodeId: "component-panel-HvqKiDjV",
    className: "sdn-icon sdn-icon--3qou",
    views: [
      {
        component: "DialogExportComponent",
        file: "modules/DialogExportComponent.tsx",
        slot: "icon11",
        type: "IconProps",
        rendersWhen: "unless-null",
      },
    ],
  },
  exportAllIconsYes: {
    component: "MenuItemRadio",
    nodeId: "component-panel-6ZzKEgPL",
    className: "sdn-menu-item sdn-menu-item-radio--wifm",
    views: [
      {
        component: "DialogExportComponent",
        file: "modules/DialogExportComponent.tsx",
        slot: "menuItemRadio9",
        type: "MenuItemRadioProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  exportAllIconsYesIcon: {
    component: "Icon",
    nodeId: "component-panel-uhkDW6j5",
    className: "sdn-icon sdn-icon--3qou",
    views: [
      {
        component: "DialogExportComponent",
        file: "modules/DialogExportComponent.tsx",
        slot: "icon10",
        type: "IconProps",
        rendersWhen: "unless-null",
      },
    ],
  },
  exportAllThemesNo: {
    component: "MenuItemRadio",
    nodeId: "component-panel-dHhbJMnp",
    className: "sdn-menu-item sdn-menu-item-radio--wifm",
    views: [
      {
        component: "DialogExportComponent",
        file: "modules/DialogExportComponent.tsx",
        slot: "menuItemRadio6",
        type: "MenuItemRadioProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  exportAllThemesNoIcon: {
    component: "Icon",
    nodeId: "component-panel-dE3r3x5s",
    className: "sdn-icon sdn-icon--3qou",
    views: [
      {
        component: "DialogExportComponent",
        file: "modules/DialogExportComponent.tsx",
        slot: "icon7",
        type: "IconProps",
        rendersWhen: "unless-null",
      },
    ],
  },
  exportAllThemesYes: {
    component: "MenuItemRadio",
    nodeId: "component-panel-Ll8MAURr",
    className: "sdn-menu-item sdn-menu-item-radio--wifm",
    views: [
      {
        component: "DialogExportComponent",
        file: "modules/DialogExportComponent.tsx",
        slot: "menuItemRadio5",
        type: "MenuItemRadioProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  exportAllThemesYesIcon: {
    component: "Icon",
    nodeId: "component-panel-6zRYcjko",
    className: "sdn-icon sdn-icon--3qou",
    views: [
      {
        component: "DialogExportComponent",
        file: "modules/DialogExportComponent.tsx",
        slot: "icon6",
        type: "IconProps",
        rendersWhen: "unless-null",
      },
    ],
  },
  exportCancel: {
    component: "Button",
    nodeId: "component-panel-0g7dRdqO",
    className: "sdn-button sdn-button--wjtm",
    views: [
      {
        component: "DialogExportComponent",
        file: "modules/DialogExportComponent.tsx",
        slot: "button",
        type: "ButtonProps",
        rendersWhen: "unless-null",
      },
    ],
  },
  exportConfirm: {
    component: "Button",
    nodeId: "component-panel-Zd52I5RB",
    className: "sdn-button sdn-button--upjl",
    views: [
      {
        component: "DialogExportComponent",
        file: "modules/DialogExportComponent.tsx",
        slot: "button2",
        type: "ButtonProps",
        rendersWhen: "unless-null",
      },
    ],
  },
  exportFontLinksNo: {
    component: "MenuItemRadio",
    nodeId: "component-panel-ckamBjyC",
    className: "sdn-menu-item sdn-menu-item-radio--wifm",
    views: [
      {
        component: "DialogExportComponent",
        file: "modules/DialogExportComponent.tsx",
        slot: "menuItemRadio2",
        type: "MenuItemRadioProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  exportFontLinksNoIcon: {
    component: "Icon",
    nodeId: "component-panel-L4bLvhoP",
    className: "sdn-icon sdn-icon--3qou",
    views: [
      {
        component: "DialogExportComponent",
        file: "modules/DialogExportComponent.tsx",
        slot: "icon3",
        type: "IconProps",
        rendersWhen: "unless-null",
      },
    ],
  },
  exportFontLinksYes: {
    component: "MenuItemRadio",
    nodeId: "component-panel-lKDfX83Z",
    className: "sdn-menu-item sdn-menu-item-radio--wifm",
    views: [
      {
        component: "DialogExportComponent",
        file: "modules/DialogExportComponent.tsx",
        slot: "menuItemRadio",
        type: "MenuItemRadioProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  exportFontLinksYesIcon: {
    component: "Icon",
    nodeId: "component-panel-XOpVCSGs",
    className: "sdn-icon sdn-icon--3qou",
    views: [
      {
        component: "DialogExportComponent",
        file: "modules/DialogExportComponent.tsx",
        slot: "icon2",
        type: "IconProps",
        rendersWhen: "unless-null",
      },
    ],
  },
  exportHiddenNo: {
    component: "MenuItemRadio",
    nodeId: "component-panel-cM5q9shs",
    className: "sdn-menu-item sdn-menu-item-radio--wifm",
    views: [
      {
        component: "DialogExportComponent",
        file: "modules/DialogExportComponent.tsx",
        slot: "menuItemRadio4",
        type: "MenuItemRadioProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  exportHiddenNoIcon: {
    component: "Icon",
    nodeId: "component-panel-BZN5sI4T",
    className: "sdn-icon sdn-icon--3qou",
    views: [
      {
        component: "DialogExportComponent",
        file: "modules/DialogExportComponent.tsx",
        slot: "icon5",
        type: "IconProps",
        rendersWhen: "unless-null",
      },
    ],
  },
  exportHiddenYes: {
    component: "MenuItemRadio",
    nodeId: "component-panel-wIfMpjAU",
    className: "sdn-menu-item sdn-menu-item-radio--wifm",
    views: [
      {
        component: "DialogExportComponent",
        file: "modules/DialogExportComponent.tsx",
        slot: "menuItemRadio3",
        type: "MenuItemRadioProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  exportHiddenYesIcon: {
    component: "Icon",
    nodeId: "component-panel-WG67k8nP",
    className: "sdn-icon sdn-icon--3qou",
    views: [
      {
        component: "DialogExportComponent",
        file: "modules/DialogExportComponent.tsx",
        slot: "icon4",
        type: "IconProps",
        rendersWhen: "unless-null",
      },
    ],
  },
  exportPlatform: {
    component: "Input",
    nodeId: "component-comboboxField-kbxUrlMi",
    className: "sdn-input sdn-input--pzcf",
    views: [
      {
        component: "DialogExportComponent",
        file: "modules/DialogExportComponent.tsx",
        slot: "input3",
        type: "InputProps",
        rendersWhen: "unless-null",
      },
    ],
  },
  exportRootPath: {
    component: "Input",
    nodeId: "component-panel-brFiKeXr",
    className: "sdn-input sdn-input--j1ro",
    views: [
      {
        component: "DialogExportComponent",
        file: "modules/DialogExportComponent.tsx",
        slot: "input2",
        type: "InputProps",
        rendersWhen: "unless-null",
      },
    ],
  },
  exportSavedWorkspaceNo: {
    component: "MenuItemRadio",
    nodeId: "component-panel-7E0knrLz",
    className: "sdn-menu-item sdn-menu-item-radio--wifm",
    views: [
      {
        component: "DialogExportComponent",
        file: "modules/DialogExportComponent.tsx",
        slot: "menuItemRadio12",
        type: "MenuItemRadioProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  exportSavedWorkspaceNoIcon: {
    component: "Icon",
    nodeId: "component-panel-EwRweg8T",
    className: "sdn-icon sdn-icon--3qou",
    views: [
      {
        component: "DialogExportComponent",
        file: "modules/DialogExportComponent.tsx",
        slot: "icon13",
        type: "IconProps",
        rendersWhen: "unless-null",
      },
    ],
  },
  exportSavedWorkspaceYes: {
    component: "MenuItemRadio",
    nodeId: "component-panel-PabJ3D96",
    className: "sdn-menu-item sdn-menu-item-radio--wifm",
    views: [
      {
        component: "DialogExportComponent",
        file: "modules/DialogExportComponent.tsx",
        slot: "menuItemRadio11",
        type: "MenuItemRadioProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  exportSavedWorkspaceYesIcon: {
    component: "Icon",
    nodeId: "component-panel-wqWys28h",
    className: "sdn-icon sdn-icon--3qou",
    views: [
      {
        component: "DialogExportComponent",
        file: "modules/DialogExportComponent.tsx",
        slot: "icon12",
        type: "IconProps",
        rendersWhen: "unless-null",
      },
    ],
  },
  exportScriptsNo: {
    component: "MenuItemRadio",
    nodeId: "component-panel-yNBXWgOb",
    className: "sdn-menu-item sdn-menu-item-radio--wifm",
    views: [
      {
        component: "DialogExportComponent",
        file: "modules/DialogExportComponent.tsx",
        slot: "menuItemRadio14",
        type: "MenuItemRadioProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  exportScriptsNoIcon: {
    component: "Icon",
    nodeId: "component-panel-xrKjwATK",
    className: "sdn-icon sdn-icon--3qou",
    views: [
      {
        component: "DialogExportComponent",
        file: "modules/DialogExportComponent.tsx",
        slot: "icon15",
        type: "IconProps",
        rendersWhen: "unless-null",
      },
    ],
  },
  exportScriptsYes: {
    component: "MenuItemRadio",
    nodeId: "component-panel-6KIgaAzM",
    className: "sdn-menu-item sdn-menu-item-radio--wifm",
    views: [
      {
        component: "DialogExportComponent",
        file: "modules/DialogExportComponent.tsx",
        slot: "menuItemRadio13",
        type: "MenuItemRadioProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  exportScriptsYesIcon: {
    component: "Icon",
    nodeId: "component-panel-dCrsBN4m",
    className: "sdn-icon sdn-icon--3qou",
    views: [
      {
        component: "DialogExportComponent",
        file: "modules/DialogExportComponent.tsx",
        slot: "icon14",
        type: "IconProps",
        rendersWhen: "unless-null",
      },
    ],
  },
  exportWorkspaceName: {
    component: "Input",
    nodeId: "component-formControl-j1rONFyf",
    className: "sdn-input sdn-input--j1ro",
    views: [
      {
        component: "DialogExportComponent",
        file: "modules/DialogExportComponent.tsx",
        slot: "input",
        type: "InputProps",
        rendersWhen: "unless-null",
      },
    ],
  },
  filterActions: {
    component: "ButtonIconic",
    nodeId: "component-comboboxField-egV44OiP",
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
    views: [
      {
        component: "ComboboxFieldFilter",
        file: "elements/ComboboxFieldFilter.tsx",
        slot: "buttonIconic",
        type: "ButtonIconicProps",
        rendersWhen: "unless-null",
      },
    ],
  },
  filterIcon: {
    component: "Icon",
    nodeId: "component-comboboxField-ta9b5fTa",
    className: "sdn-icon sdn-icon--xi68",
    views: [
      {
        component: "ComboboxFieldFilter",
        file: "elements/ComboboxFieldFilter.tsx",
        slot: "icon",
        type: "IconProps",
        rendersWhen: "unless-null",
      },
    ],
  },
  filterLabel: {
    component: "Input",
    nodeId: "component-comboboxField-TWyxOQad",
    className: "sdn-input sdn-input--twyx",
    views: [
      {
        component: "ComboboxFieldFilter",
        file: "elements/ComboboxFieldFilter.tsx",
        slot: "input",
        type: "InputProps",
        rendersWhen: "unless-null",
      },
    ],
  },
  hariBar: {
    component: "Bar",
    nodeId: "component-panel-DxDVepgS",
    className: "sdn-bar sdn-bar--9xs7",
    views: [
      {
        component: "PanelHari",
        file: "modules/PanelHari.tsx",
        slot: "bar",
        type: "BarProps",
        rendersWhen: "unless-null",
      },
    ],
  },
  hariClamp: {
    component: "ButtonToggle",
    nodeId: "component-button-N1pT65yh",
    className: "sdn-button-toggle sdn-button-iconic--pgsr",
    views: [
      {
        component: "PanelHari",
        file: "modules/PanelHari.tsx",
        slot: "buttonToggle3",
        type: "ButtonToggleProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  hariClose: {
    component: "ButtonIconic",
    nodeId: "component-panel-dHCB3O1v",
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
    views: [
      {
        component: "PanelHari",
        file: "modules/PanelHari.tsx",
        slot: "buttonIconic2",
        type: "ButtonIconicProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  hariErrorIcon: {
    component: "Icon",
    nodeId: "component-icon-GM8jpOSl",
    className: "sdn-icon sdn-icon--gm8j",
    views: [
      {
        component: "MessageError",
        file: "elements/MessageError.tsx",
        slot: "icon",
        type: "IconProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  hariErrorRetry: {
    component: "ButtonSimple",
    nodeId: "component-button-AKDnMgFM",
    className: "sdn-button-simple sdn-button-iconic--iklu",
    views: [
      {
        component: "MessageError",
        file: "elements/MessageError.tsx",
        slot: "buttonSimple",
        type: "ButtonSimpleProps",
        rendersWhen: "unless-null",
      },
    ],
  },
  hariErrorRetryLabel: {
    component: "TextLabel",
    nodeId: "component-text-AfTUkMQr",
    className: "sdn-text-label sdn-text-label--aftu",
    views: [
      {
        component: "MessageError",
        file: "elements/MessageError.tsx",
        slot: "textLabel",
        type: "TextLabelProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  hariErrorText: {
    component: "TextDescription",
    nodeId: "component-text-gaFQYpvP",
    className: "sdn-text-description sdn-text-label--lbxv",
    views: [
      {
        component: "MessageError",
        file: "elements/MessageError.tsx",
        slot: "textDescription",
        type: "TextDescriptionProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  hariInput: {
    component: "Textarea",
    nodeId: "component-textarea-2uPWguWV",
    className: "sdn-textarea sdn-textarea--2upw",
    views: [
      {
        component: "PanelHari",
        file: "modules/PanelHari.tsx",
        slot: "textarea",
        type: "TextareaProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  hariModel: {
    component: "ButtonMenu",
    nodeId: "component-panel-EqziYbqa",
    className: "sdn-button-menu sdn-button-menu--ipe0",
    views: [
      {
        component: "PanelHari",
        file: "modules/PanelHari.tsx",
        slot: "buttonMenu",
        type: "ButtonMenuProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  hariModelLabel: {
    component: "TextLabel",
    nodeId: "component-panel-wKKOvQwf",
    className: "sdn-text-label sdn-text-label--sa6t",
    views: [
      {
        component: "PanelHari",
        file: "modules/PanelHari.tsx",
        slot: "textLabel",
        type: "TextLabelProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  hariOutcome: {
    component: "ButtonToggle",
    nodeId: "component-panel-PMmBQIRj",
    className: "sdn-button-toggle sdn-button-iconic--pgsr",
    views: [
      {
        component: "PanelHari",
        file: "modules/PanelHari.tsx",
        slot: "buttonToggle",
        type: "ButtonToggleProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  hariOutcomeIcon: {
    component: "Icon",
    nodeId: "component-icon-wxT91IpG",
    className: "sdn-icon sdn-icon--wxt9",
    views: [
      {
        component: "MessageOutcome",
        file: "elements/MessageOutcome.tsx",
        slot: "icon",
        type: "IconProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  hariOutcomeLabel: {
    component: "TextLabel",
    nodeId: "component-text-PIf8vzL0",
    className: "sdn-text-label sdn-text-label--lbxv",
    views: [
      {
        component: "MessageOutcome",
        file: "elements/MessageOutcome.tsx",
        slot: "textLabel",
        type: "TextLabelProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  hariOutcomeText: {
    component: "TextDescription",
    nodeId: "component-text-UAGUHvkF",
    className: "sdn-text-description sdn-text-description--choa",
    views: [
      {
        component: "MessageOutcome",
        file: "elements/MessageOutcome.tsx",
        slot: "textDescription",
        type: "TextDescriptionProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  hariReasoningBody: {
    component: "TextDescription",
    nodeId: "component-text-cHoacyQ2",
    className: "sdn-text-description sdn-text-description--choa",
    views: [
      {
        component: "MessageThinking",
        file: "elements/MessageThinking.tsx",
        slot: "textDescription3",
        type: "TextDescriptionProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  hariReasoningChevron: {
    component: "Icon",
    nodeId: "component-icon-KzY9lbAe",
    className: "sdn-icon sdn-icon--kzy9",
    views: [
      {
        component: "MessageThinking",
        file: "elements/MessageThinking.tsx",
        slot: "icon",
        type: "IconProps",
        rendersWhen: "unless-null",
      },
    ],
  },
  hariReasoningClamped: {
    component: "TextDescription",
    nodeId: "component-message-aeeOGbms",
    className: "sdn-text-description sdn-text-description--aeeo",
    views: [
      {
        component: "MessageThinking",
        file: "elements/MessageThinking.tsx",
        slot: "textDescription2",
        type: "TextDescriptionProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  hariReasoningLabel: {
    component: "TextDescription",
    nodeId: "component-text-0r1JFBYH",
    className: "sdn-text-description sdn-text-description--0r1j",
    views: [
      {
        component: "MessageThinking",
        file: "elements/MessageThinking.tsx",
        slot: "textDescription",
        type: "TextDescriptionProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  hariReasoningToggle: {
    component: "ButtonIconic",
    nodeId: "component-button-iKLUV4uP",
    className: "sdn-button-iconic sdn-button-iconic--iklu",
    views: [
      {
        component: "MessageThinking",
        file: "elements/MessageThinking.tsx",
        slot: "buttonIconic",
        type: "ButtonIconicProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  hariReplyText: {
    component: "TextDescription",
    nodeId: "component-text-rdPTp0zG",
    className: "sdn-text-description sdn-text-description--welb",
    views: [
      {
        component: "MessageAssistant",
        file: "elements/MessageAssistant.tsx",
        slot: "textDescription",
        type: "TextDescriptionProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  hariReset: {
    component: "ButtonIconic",
    nodeId: "component-panel-ATTVDoTF",
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
    views: [
      {
        component: "PanelHari",
        file: "modules/PanelHari.tsx",
        slot: "buttonIconic",
        type: "ButtonIconicProps",
        rendersWhen: "unless-null",
      },
    ],
  },
  hariSelection: {
    component: "Chip",
    nodeId: "component-chip-LO6kjXwm",
    className: "sdn-chip sdn-chip--lo6k",
    views: [
      {
        component: "PanelHari",
        file: "modules/PanelHari.tsx",
        slot: "chip",
        type: "ChipProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  hariSelectionLabel: {
    component: "TextLabel",
    nodeId: "component-chip-zawrF4dY",
    className: "sdn-text-label sdn-text-label--lug5",
    views: [
      {
        component: "PanelHari",
        file: "modules/PanelHari.tsx",
        slot: "textLabel3",
        type: "TextLabelProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  hariSend: {
    component: "ButtonIconic",
    nodeId: "component-button-Wh0irV9y",
    className: "sdn-button-iconic sdn-button-iconic--wh0i",
    views: [
      {
        component: "PanelHari",
        file: "modules/PanelHari.tsx",
        slot: "buttonIconic3",
        type: "ButtonIconicProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  hariSendIcon: {
    component: "Icon",
    nodeId: "component-button-KQWpbKqF",
    className: "sdn-icon sdn-icon--umgs",
    views: [
      {
        component: "PanelHari",
        file: "modules/PanelHari.tsx",
        slot: "icon8",
        type: "IconProps",
        rendersWhen: "unless-null",
      },
    ],
  },
  hariStatusIcon: {
    component: "Icon",
    nodeId: "component-icon-8Ds95Uq5",
    className: "sdn-icon sdn-icon--8ds9",
    views: [
      {
        component: "MessageStatus",
        file: "elements/MessageStatus.tsx",
        slot: "icon",
        type: "IconProps",
        rendersWhen: "unless-null",
      },
    ],
  },
  hariStatusLabel: {
    component: "TextLabel",
    nodeId: "component-text-UE8Mt3mk",
    className: "sdn-text-label sdn-text-label--ue8m",
    views: [
      {
        component: "MessageStatus",
        file: "elements/MessageStatus.tsx",
        slot: "textLabel",
        type: "TextLabelProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  hariThinking: {
    component: "ButtonMenu",
    nodeId: "component-panel-IpE0XEo6",
    className: "sdn-button-menu sdn-button-menu--ipe0",
    views: [
      {
        component: "PanelHari",
        file: "modules/PanelHari.tsx",
        slot: "buttonMenu2",
        type: "ButtonMenuProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  hariThinkingLabel: {
    component: "TextLabel",
    nodeId: "component-panel-5LdFLd1M",
    className: "sdn-text-label sdn-text-label--sa6t",
    views: [
      {
        component: "PanelHari",
        file: "modules/PanelHari.tsx",
        slot: "textLabel2",
        type: "TextLabelProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  hariTools: {
    component: "ButtonToggle",
    nodeId: "component-panel-ablPq3kW",
    className: "sdn-button-toggle sdn-button-iconic--pgsr",
    views: [
      {
        component: "PanelHari",
        file: "modules/PanelHari.tsx",
        slot: "buttonToggle2",
        type: "ButtonToggleProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  hariUserText: {
    component: "TextDescription",
    nodeId: "component-text-5X8uWVHu",
    className: "sdn-text-description sdn-text-description--welb",
    views: [
      {
        component: "MessageUser",
        file: "elements/MessageUser.tsx",
        slot: "textDescription",
        type: "TextDescriptionProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  logo: {
    component: "Frame",
    nodeId: "component-frame-AjNqkrLb",
    className: "sdn-frame sdn-frame--ajnq",
    views: [
      {
        component: "BarTopbar",
        file: "parts/BarTopbar.tsx",
        slot: "frame2",
        type: "FrameProps",
        rendersWhen: "unless-null",
      },
    ],
  },
  menuComponent: {
    component: "ButtonSimple",
    nodeId: "component-bar-tJLcDfnC",
    className: "sdn-button-simple sdn-button-simple--dbgs",
    views: [
      {
        component: "BarTopbar",
        file: "parts/BarTopbar.tsx",
        slot: "buttonSimple3",
        type: "ButtonSimpleProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  menuDev: {
    component: "ButtonSimple",
    nodeId: "component-bar-EW9LJxSD",
    className: "sdn-button-simple sdn-button-simple--dbgs",
    views: [
      {
        component: "BarTopbar",
        file: "parts/BarTopbar.tsx",
        slot: "buttonSimple6",
        type: "ButtonSimpleProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  menuEdit: {
    component: "ButtonSimple",
    nodeId: "component-bar-8iQ7zRar",
    className: "sdn-button-simple sdn-button-simple--dbgs",
    views: [
      {
        component: "BarTopbar",
        file: "parts/BarTopbar.tsx",
        slot: "buttonSimple2",
        type: "ButtonSimpleProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  menuFile: {
    component: "ButtonSimple",
    nodeId: "component-bar-dBgSvhzY",
    className: "sdn-button-simple sdn-button-simple--dbgs",
    views: [
      {
        component: "BarTopbar",
        file: "parts/BarTopbar.tsx",
        slot: "buttonSimple",
        type: "ButtonSimpleProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  menuMode: {
    component: "ButtonMenu",
    nodeId: "component-bar-nWDgCHuH",
    className: "sdn-button-menu sdn-button-iconic--pgsr",
    views: [
      {
        component: "BarTopbar",
        file: "parts/BarTopbar.tsx",
        slot: "buttonMenu2",
        type: "ButtonMenuProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  menus: {
    component: "Frame",
    nodeId: "component-bar-DrSavE9B",
    className: "sdn-frame sdn-frame--drsa",
    views: [
      {
        component: "BarTopbar",
        file: "parts/BarTopbar.tsx",
        slot: "frame3",
        type: "FrameProps",
        rendersWhen: "unless-null",
      },
    ],
  },
  menuState: {
    component: "ButtonMenu",
    nodeId: "component-button-t1A2Kxjz",
    className: "sdn-button-menu sdn-button-menu--t1a2",
    views: [
      {
        component: "SidebarProperties",
        file: "modules/SidebarProperties.tsx",
        slot: "buttonMenu",
        type: "ButtonMenuProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  menuTheme: {
    component: "ButtonMenu",
    nodeId: "component-button-trucC1Xo",
    className: "sdn-button-menu sdn-button-iconic--pgsr",
    views: [
      {
        component: "BarTopbar",
        file: "parts/BarTopbar.tsx",
        slot: "buttonMenu",
        type: "ButtonMenuProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  menuView: {
    component: "ButtonSimple",
    nodeId: "component-bar-FUwSPfCT",
    className: "sdn-button-simple sdn-button-simple--dbgs",
    views: [
      {
        component: "BarTopbar",
        file: "parts/BarTopbar.tsx",
        slot: "buttonSimple4",
        type: "ButtonSimpleProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  nodeActions: {
    component: "ButtonIconic",
    nodeId: "component-item-CeZRPCDC",
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
    views: [
      {
        component: "ItemNode",
        file: "elements/ItemNode.tsx",
        slot: "buttonIconic3",
        type: "ButtonIconicProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  nodeDisclosure: {
    component: "ButtonIconic",
    nodeId: "component-item-HSgjhz6b",
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
    views: [
      {
        component: "ItemNode",
        file: "elements/ItemNode.tsx",
        slot: "buttonIconic",
        type: "ButtonIconicProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  nodeDisclosureIcon: {
    component: "Icon",
    nodeId: "component-item-zn8GFZsT",
    className: "sdn-icon sdn-icon--vsau",
    views: [
      {
        component: "ItemNode",
        file: "elements/ItemNode.tsx",
        slot: "icon",
        type: "IconProps",
        rendersWhen: "unless-null",
      },
    ],
  },
  nodeDisplay: {
    component: "ButtonIconic",
    nodeId: "component-item-A2qQLKuh",
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
    views: [
      {
        component: "ItemNode",
        file: "elements/ItemNode.tsx",
        slot: "buttonIconic2",
        type: "ButtonIconicProps",
        rendersWhen: "unless-null",
      },
    ],
  },
  nodeDisplayIcon: {
    component: "Icon",
    nodeId: "component-item-vfutzRjn",
    className: "sdn-icon sdn-icon--xi68",
    views: [
      {
        component: "ItemNode",
        file: "elements/ItemNode.tsx",
        slot: "icon3",
        type: "IconProps",
        rendersWhen: "unless-null",
      },
    ],
  },
  nodeIcon: {
    component: "Icon",
    nodeId: "component-item-zdDEhaL4",
    className: "sdn-icon sdn-icon--xi68",
    views: [
      {
        component: "ItemNode",
        file: "elements/ItemNode.tsx",
        slot: "icon2",
        type: "IconProps",
        rendersWhen: "unless-null",
      },
    ],
  },
  nodeLabel: {
    component: "Input",
    nodeId: "component-item-pZCfJ3k6",
    className: "sdn-input sdn-input--pzcf",
    views: [
      {
        component: "ItemNode",
        file: "elements/ItemNode.tsx",
        slot: "input",
        type: "InputProps",
        rendersWhen: "unless-null",
      },
    ],
  },
  objectsContainer: {
    component: "Frame",
    nodeId: "component-sidebar-ENPyLuzb",
    className: "sdn-frame sdn-frame--enpy",
    views: [
      {
        component: "SidebarObjects",
        file: "modules/SidebarObjects.tsx",
        slot: "frame3",
        type: "FrameProps",
        rendersWhen: "unless-null",
      },
    ],
  },
  optionIcon: {
    component: "Icon",
    nodeId: "component-icon-3QOuNmn2",
    className: "sdn-icon sdn-icon--3qou",
    views: [
      {
        component: "ListboxOption",
        file: "elements/ListboxOption.tsx",
        slot: "icon",
        type: "IconProps",
        rendersWhen: "unless-null",
      },
    ],
  },
  optionLabel: {
    component: "TextLabel",
    nodeId: "component-text-xOhbdtNu",
    className: "sdn-text-label sdn-text-label--xohb",
    views: [
      {
        component: "ListboxOption",
        file: "elements/ListboxOption.tsx",
        slot: "textLabel",
        type: "TextLabelProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  projectActions: {
    component: "ButtonIconic",
    nodeId: "component-comboboxField-Td9lePEX",
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
    views: [
      {
        component: "ComboboxFieldProject",
        file: "elements/ComboboxFieldProject.tsx",
        slot: "buttonIconic",
        type: "ButtonIconicProps",
        rendersWhen: "unless-null",
      },
    ],
  },
  projectIcon: {
    component: "Icon",
    nodeId: "component-comboboxField-h6DYE6Jl",
    className: "sdn-icon sdn-icon--xi68",
    views: [
      {
        component: "ComboboxFieldProject",
        file: "elements/ComboboxFieldProject.tsx",
        slot: "icon",
        type: "IconProps",
        rendersWhen: "unless-null",
      },
    ],
  },
  projectLabel: {
    component: "Input",
    nodeId: "component-comboboxField-Umc9UbAs",
    className: "sdn-input sdn-input--twyx",
    views: [
      {
        component: "ComboboxFieldProject",
        file: "elements/ComboboxFieldProject.tsx",
        slot: "input",
        type: "InputProps",
        rendersWhen: "unless-null",
      },
    ],
  },
  propertiesContainer: {
    component: "Frame",
    nodeId: "component-sidebar-evMwxVOP",
    className: "sdn-frame sdn-frame--evmw",
    views: [
      {
        component: "SidebarProperties",
        file: "modules/SidebarProperties.tsx",
        slot: "frame2",
        type: "FrameProps",
        rendersWhen: "unless-null",
      },
    ],
  },
  propertyActions: {
    component: "ButtonIconic",
    nodeId: "component-button-CGRbb6mm",
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
    views: [
      {
        component: "ItemProperty",
        file: "elements/ItemProperty.tsx",
        slot: "buttonIconic3",
        type: "ButtonIconicProps",
        rendersWhen: "unless-null",
      },
    ],
  },
  propertyDisclosure: {
    component: "ButtonIconic",
    nodeId: "component-button-iVVLVSBT",
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
    views: [
      {
        component: "ItemProperty",
        file: "elements/ItemProperty.tsx",
        slot: "buttonIconic",
        type: "ButtonIconicProps",
        rendersWhen: "unless-null",
      },
    ],
  },
  propertyDisclosureIcon: {
    component: "Icon",
    nodeId: "component-icon-Aa4AD1wO",
    className: "sdn-icon sdn-icon--vsau",
    views: [
      {
        component: "ItemProperty",
        file: "elements/ItemProperty.tsx",
        slot: "icon",
        type: "IconProps",
        rendersWhen: "unless-null",
      },
    ],
  },
  propertyFilter: {
    component: "Input",
    nodeId: "component-comboboxField-Lg6E5jtv",
    className: "sdn-input sdn-input--twyx",
    views: [
      {
        component: "SidebarProperties",
        file: "modules/SidebarProperties.tsx",
        slot: "input",
        type: "InputProps",
        rendersWhen: "unless-null",
      },
    ],
  },
  propertyFilterClear: {
    component: "ButtonIconic",
    nodeId: "component-comboboxField-xvQW1VQq",
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
    views: [
      {
        component: "SidebarProperties",
        file: "modules/SidebarProperties.tsx",
        slot: "buttonIconic",
        type: "ButtonIconicProps",
        rendersWhen: "unless-null",
      },
    ],
  },
  propertyLabel: {
    component: "Input",
    nodeId: "component-item-JvSW6JpE",
    className: "sdn-input sdn-input--jvsw",
    views: [
      {
        component: "ItemProperty",
        file: "elements/ItemProperty.tsx",
        slot: "input",
        type: "InputProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  propertyToggleActions: {
    component: "ButtonIconic",
    nodeId: "component-item-qeIxCmeu",
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
    views: [
      {
        component: "ItemPropertyToggle",
        file: "elements/ItemPropertyToggle.tsx",
        slot: "buttonIconic2",
        type: "ButtonIconicProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  propertyToggleDisclosure: {
    component: "ButtonIconic",
    nodeId: "component-item-HiKfAFK5",
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
    views: [
      {
        component: "ItemPropertyToggle",
        file: "elements/ItemPropertyToggle.tsx",
        slot: "buttonIconic",
        type: "ButtonIconicProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  propertyToggleDisclosureIcon: {
    component: "Icon",
    nodeId: "component-item-jmuthUmH",
    className: "sdn-icon sdn-icon--vsau",
    views: [
      {
        component: "ItemPropertyToggle",
        file: "elements/ItemPropertyToggle.tsx",
        slot: "icon",
        type: "IconProps",
        rendersWhen: "unless-null",
      },
    ],
  },
  propertyToggleIcon: {
    component: "Icon",
    nodeId: "component-item-YzeMLx3R",
    className: "sdn-icon sdn-icon--xi68",
    views: [
      {
        component: "ItemPropertyToggle",
        file: "elements/ItemPropertyToggle.tsx",
        slot: "icon2",
        type: "IconProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  propertyToggleLabel: {
    component: "Input",
    nodeId: "component-item-K7Y9jqAr",
    className: "sdn-input sdn-input--jvsw",
    views: [
      {
        component: "ItemPropertyToggle",
        file: "elements/ItemPropertyToggle.tsx",
        slot: "input",
        type: "InputProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  propertyToggleSwitch: {
    component: "ToggleSwitch",
    nodeId: "component-toggleSwitch-pelhFQXa",
    className: "sdn-toggle-switch sdn-toggle-switch--pelh",
    views: [
      {
        component: "ItemPropertyToggle",
        file: "elements/ItemPropertyToggle.tsx",
        slot: "toggleSwitch",
        type: "ToggleSwitchProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  propertyValueIcon: {
    component: "Icon",
    nodeId: "component-icon-V1g4W5fN",
    className: "sdn-icon sdn-icon--xi68",
    views: [
      {
        component: "ItemProperty",
        file: "elements/ItemProperty.tsx",
        slot: "icon2",
        type: "IconProps",
        rendersWhen: "unless-null",
      },
    ],
  },
  propertyValueLabel: {
    component: "Input",
    nodeId: "component-input-IeGTgo7S",
    className: "sdn-input sdn-input--iegt",
    views: [
      {
        component: "ItemProperty",
        file: "elements/ItemProperty.tsx",
        slot: "input2",
        type: "InputProps",
        rendersWhen: "unless-null",
      },
    ],
  },
  propertyValueMenu: {
    component: "ButtonIconic",
    nodeId: "component-button-HqmnST2I",
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
    views: [
      {
        component: "ItemProperty",
        file: "elements/ItemProperty.tsx",
        slot: "buttonIconic2",
        type: "ButtonIconicProps",
        rendersWhen: "unless-null",
      },
    ],
  },
  refCard: {
    component: "Frame",
    nodeId: "component-panel-lAd1YaBS",
    className: "sdn-frame sdn-frame--lad1",
    views: [
      {
        component: "PanelRefs",
        file: "modules/PanelRefs.tsx",
        slot: "frame",
        type: "FrameProps",
        rendersWhen: "unless-null",
      },
    ],
  },
  refCardCondition: {
    component: "Text",
    nodeId: "component-panel-mC6hCHqF",
    className: "sdn-text sdn-text--mc6h",
    views: [
      {
        component: "PanelRefs",
        file: "modules/PanelRefs.tsx",
        slot: "text3",
        type: "TextProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  refCardControllerFrom: {
    component: "Text",
    nodeId: "component-message-Ir92uzNa",
    className: "sdn-text sdn-text--ir92",
    views: [
      {
        component: "MessageRefController",
        file: "elements/MessageRefController.tsx",
        slot: "text4",
        type: "TextProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  refCardControllerItem: {
    component: "MessageRefController",
    nodeId: "component-message-pIx0Khnt",
    className: "sdn-message-ref-controller sdn-message",
    views: [
      {
        component: "MessageRefController",
        file: "elements/MessageRefController.tsx",
        slot: null,
        type: "MessageRefControllerProps",
        rendersWhen: "unless-null",
      },
    ],
  },
  refCardControllerName: {
    component: "Text",
    nodeId: "component-text-YDUPxtFS",
    className: "sdn-text sdn-text--ydup",
    views: [
      {
        component: "MessageRefController",
        file: "elements/MessageRefController.tsx",
        slot: "text",
        type: "TextProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  refCardControllerPass: {
    component: "Text",
    nodeId: "component-message-Y6NPSfwz",
    className: "sdn-text sdn-text--y6np",
    views: [
      {
        component: "MessageRefController",
        file: "elements/MessageRefController.tsx",
        slot: "text3",
        type: "TextProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  refCardControllerPath: {
    component: "Text",
    nodeId: "component-message-55WSaLzh",
    className: "sdn-text sdn-text--55ws",
    views: [
      {
        component: "MessageRefController",
        file: "elements/MessageRefController.tsx",
        slot: "text2",
        type: "TextProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  refCardControllers: {
    component: "Frame",
    nodeId: "component-panel-LV6neIkS",
    className: "sdn-frame sdn-frame--lv6n",
    views: [
      {
        component: "PanelRefs",
        file: "modules/PanelRefs.tsx",
        slot: "frame3",
        type: "FrameProps",
        rendersWhen: "unless-null",
      },
    ],
  },
  refCardPath: {
    component: "Text",
    nodeId: "component-panel-WVHEGm8i",
    className: "sdn-text sdn-text--wvhe",
    views: [
      {
        component: "PanelRefs",
        file: "modules/PanelRefs.tsx",
        slot: "text2",
        type: "TextProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  refCardView: {
    component: "Text",
    nodeId: "component-panel-9wfdKyZu",
    className: "sdn-text sdn-text--9wfd",
    views: [
      {
        component: "PanelRefs",
        file: "modules/PanelRefs.tsx",
        slot: "text",
        type: "TextProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  refChip: {
    component: "ChipAssist",
    nodeId: "component-chip-ik8RMteR",
    className: "sdn-chip sdn-chip-assist--ik8r",
    views: [
      {
        component: "PanelRefs",
        file: "modules/PanelRefs.tsx",
        slot: "chipAssist",
        type: "ChipAssistProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  refChipIcon: {
    component: "Icon",
    nodeId: "component-chip-afGp6Yh0",
    className: "sdn-icon sdn-icon--afgp",
    views: [
      {
        component: "PanelRefs",
        file: "modules/PanelRefs.tsx",
        slot: "icon",
        type: "IconProps",
        rendersWhen: "unless-null",
      },
    ],
  },
  refChipName: {
    component: "TextLabel",
    nodeId: "component-chip-LItzOEcN",
    className: "sdn-text-label sdn-text-label--litz",
    views: [
      {
        component: "PanelRefs",
        file: "modules/PanelRefs.tsx",
        slot: "textLabel",
        type: "TextLabelProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  searchActions: {
    component: "ButtonIconic",
    nodeId: "component-button-q7tCLRdW",
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
    views: [
      {
        component: "ComboboxFieldSearch",
        file: "elements/ComboboxFieldSearch.tsx",
        slot: "buttonIconic",
        type: "ButtonIconicProps",
        rendersWhen: "unless-null",
      },
    ],
  },
  searchIcon: {
    component: "Icon",
    nodeId: "component-icon-CHSbwIMc",
    className: "sdn-icon sdn-icon--xi68",
    views: [
      {
        component: "ComboboxFieldSearch",
        file: "elements/ComboboxFieldSearch.tsx",
        slot: "icon",
        type: "IconProps",
        rendersWhen: "unless-null",
      },
    ],
  },
  searchLabel: {
    component: "Input",
    nodeId: "component-input-w7F4idVF",
    className: "sdn-input sdn-input--yoqi",
    views: [
      {
        component: "ComboboxFieldSearch",
        file: "elements/ComboboxFieldSearch.tsx",
        slot: "input",
        type: "InputProps",
        rendersWhen: "unless-null",
      },
    ],
  },
  sectionActions: {
    component: "ButtonIconic",
    nodeId: "component-item-m1G2OAIO",
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
    views: [
      {
        component: "ItemSection",
        file: "elements/ItemSection.tsx",
        slot: "buttonIconic3",
        type: "ButtonIconicProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  sectionAdd: {
    component: "ButtonIconic",
    nodeId: "component-item-sDjvfAPl",
    className: "sdn-button-iconic sdn-button-iconic--sdjv",
    views: [
      {
        component: "ItemSection",
        file: "elements/ItemSection.tsx",
        slot: "buttonIconic2",
        type: "ButtonIconicProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  sectionDisclosure: {
    component: "ButtonIconic",
    nodeId: "component-item-OCtkZUuF",
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
    views: [
      {
        component: "ItemSection",
        file: "elements/ItemSection.tsx",
        slot: "buttonIconic",
        type: "ButtonIconicProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  sectionDisclosureIcon: {
    component: "Icon",
    nodeId: "component-item-7MKLAjub",
    className: "sdn-icon sdn-icon--umgs",
    views: [
      {
        component: "ItemSection",
        file: "elements/ItemSection.tsx",
        slot: "icon",
        type: "IconProps",
        rendersWhen: "unless-null",
      },
    ],
  },
  sectionLabel: {
    component: "TextLabel",
    nodeId: "component-item-Z34z7Dhr",
    className: "sdn-text-label sdn-text-label--z34z",
    views: [
      {
        component: "ItemSection",
        file: "elements/ItemSection.tsx",
        slot: "textLabel",
        type: "TextLabelProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  sidebarComponents: {
    component: "ButtonToggle",
    nodeId: "component-button-f2yi4eeO",
    className: "sdn-button-toggle sdn-button-iconic--pgsr",
    views: [
      {
        component: "SidebarObjects",
        file: "modules/SidebarObjects.tsx",
        slot: "buttonToggle",
        type: "ButtonToggleProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  sidebarResources: {
    component: "ButtonToggle",
    nodeId: "component-sidebar-9VESc1Om",
    className: "sdn-button-toggle sdn-button-iconic--pgsr",
    views: [
      {
        component: "SidebarObjects",
        file: "modules/SidebarObjects.tsx",
        slot: "buttonToggle2",
        type: "ButtonToggleProps",
        rendersWhen: "when-passed",
      },
    ],
  },
  tool: {
    component: "Frame",
    nodeId: "component-frame-RStcYvkF",
    className: "sdn-frame sdn-frame--rstc",
    views: [
      {
        component: "MessageTools",
        file: "elements/MessageTools.tsx",
        slot: "frame2",
        type: "FrameProps",
        rendersWhen: "unless-null",
      },
    ],
  },
  turns: {
    component: "Frame",
    nodeId: "component-panel-VoRnpuW2",
    className: "sdn-frame sdn-frame--vorn",
    views: [
      {
        component: "PanelHari",
        file: "modules/PanelHari.tsx",
        slot: "frame2",
        type: "FrameProps",
        rendersWhen: "unless-null",
      },
    ],
  },
  workspaceName: {
    component: "Input",
    nodeId: "component-comboboxField-spqmpmg5",
    className: "sdn-input sdn-input--twyx",
    views: [
      {
        component: "SidebarObjects",
        file: "modules/SidebarObjects.tsx",
        slot: "input",
        type: "InputProps",
        rendersWhen: "unless-null",
      },
    ],
  },
  workspaceSave: {
    component: "ButtonIconic",
    nodeId: "component-comboboxField-o9tr7uLV",
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
    views: [
      {
        component: "SidebarObjects",
        file: "modules/SidebarObjects.tsx",
        slot: "buttonIconic",
        type: "ButtonIconicProps",
        rendersWhen: "unless-null",
      },
    ],
  },
}

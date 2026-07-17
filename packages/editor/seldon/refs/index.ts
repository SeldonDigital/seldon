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
  | "filterActions"
  | "filterIcon"
  | "filterLabel"
  | "hariClamp"
  | "hariClose"
  | "hariInput"
  | "hariModel"
  | "hariOutcome"
  | "hariSelection"
  | "hariSend"
  | "hariThinking"
  | "hariTools"
  | "logo"
  | "menuComponent"
  | "menuDev"
  | "menuEdit"
  | "menuFile"
  | "menuMode"
  | "menus"
  | "menuTheme"
  | "menuView"
  | "nodeActions"
  | "nodeDisplay"
  | "nodeIcon"
  | "nodeLabel"
  | "nodeToggle"
  | "nodeToggleIcon"
  | "objectsContainer"
  | "optionIcon"
  | "optionLabel"
  | "projectActions"
  | "projectIcon"
  | "projectLabel"
  | "propertiesContainer"
  | "propertyActions"
  | "propertyFilter"
  | "propertyFilterClear"
  | "propertyLabel"
  | "propertyToggle"
  | "propertyToggleIcon"
  | "searchActions"
  | "searchIcon"
  | "searchLabel"
  | "sectionActions"
  | "sectionAdd"
  | "sectionLabel"
  | "sectionToggle"
  | "sectionToggleIcon"
  | "sidebarComponents"
  | "sidebarResources"
  | "toggleIcon"
  | "toggleValue"
  | "tool"
  | "turns"
  | "valueIcon"
  | "valueLabel"
  | "valueOptionsMenu"
  | "workspaceName"
  | "workspaceSave"

export interface SeldonRefEntry {
  component: string
  nodeId: string
  className: string
}

export const SELDON_REFS: Record<SeldonRef, SeldonRefEntry> = {
  catalogIcon: {
    component: "Icon",
    nodeId: "component-icon-meNEMxeY",
    className: "sdn-icon sdn-icon--mene",
  },
  catalogItem: {
    component: "ItemCatalog",
    nodeId: "component-item-product",
    className: "sdn-item-catalog sdn-item",
  },
  catalogItems: {
    component: "Container",
    nodeId: "component-container-x52OfMWH",
    className: "sdn-container sdn-container--x52o",
  },
  catalogLabel: {
    component: "TextTitle",
    nodeId: "component-text-noun68PK",
    className: "sdn-text-title sdn-text-title--noun",
  },
  catalogVariant: {
    component: "TextSubtitle",
    nodeId: "component-text-R4oTaXSN",
    className: "sdn-text-subtitle sdn-text-subtitle--r4ot",
  },
  createComponentContainer: {
    component: "ItemCatalog",
    nodeId: "component-panel-eFZLmrJg",
    className: "sdn-item-catalog sdn-item-catalog--xhyo",
  },
  createComponentFrame: {
    component: "ItemCatalog",
    nodeId: "component-item-xhYOpZp3",
    className: "sdn-item-catalog sdn-item-catalog--xhyo",
  },
  createComponentIntent: {
    component: "Input",
    nodeId: "component-panel-WC2KRJFl",
    className: "sdn-input sdn-input--qirj",
  },
  createComponentLevel: {
    component: "ComboboxField",
    nodeId: "component-formControl-HdymRu7r",
    className: "sdn-combobox-field sdn-combobox-field--hdym",
  },
  createComponentName: {
    component: "Input",
    nodeId: "component-formControl-QiRj1M64",
    className: "sdn-input sdn-input--qirj",
  },
  createComponentTags: {
    component: "Input",
    nodeId: "component-panel-1YblVT7S",
    className: "sdn-input sdn-input--qirj",
  },
  Default: {
    component: "ItemCatalog",
    nodeId: "component-item-hSnQ9Zqv",
    className: "sdn-item-catalog sdn-item-catalog--bg0n",
  },
  dialogCancel: {
    component: "Button",
    nodeId: "component-bar-oHXIPFr4",
    className: "sdn-button sdn-button--wjtm",
  },
  dialogConfirm: {
    component: "Button",
    nodeId: "component-bar-UpjLfdY0",
    className: "sdn-button sdn-button--upjl",
  },
  dialogContent: {
    component: "Frame",
    nodeId: "component-panel-2wWoLkwm",
    className: "sdn-frame sdn-frame--2wwo",
  },
  dialogTitle: {
    component: "TextTitle",
    nodeId: "component-panel-j8D9mUx4",
    className: "sdn-text-title sdn-text-title--eodu",
  },
  filterActions: {
    component: "ButtonIconic",
    nodeId: "component-comboboxField-egV44OiP",
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
  },
  filterIcon: {
    component: "Icon",
    nodeId: "component-comboboxField-ta9b5fTa",
    className: "sdn-icon sdn-icon--xi68",
  },
  filterLabel: {
    component: "Input",
    nodeId: "component-comboboxField-TWyxOQad",
    className: "sdn-input sdn-input--twyx",
  },
  hariClamp: {
    component: "ButtonToggle",
    nodeId: "component-button-N1pT65yh",
    className: "sdn-button-toggle sdn-button-iconic--pgsr",
  },
  hariClose: {
    component: "ButtonIconic",
    nodeId: "component-panel-dHCB3O1v",
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
  },
  hariInput: {
    component: "Textarea",
    nodeId: "component-textarea-2uPWguWV",
    className: "sdn-textarea sdn-textarea--2upw",
  },
  hariModel: {
    component: "ButtonMenu",
    nodeId: "component-panel-EqziYbqa",
    className: "sdn-button-menu sdn-button-menu--ipe0",
  },
  hariOutcome: {
    component: "ButtonToggle",
    nodeId: "component-panel-PMmBQIRj",
    className: "sdn-button-toggle sdn-button-iconic--pgsr",
  },
  hariSelection: {
    component: "Chip",
    nodeId: "component-chip-LO6kjXwm",
    className: "sdn-chip sdn-chip--lo6k",
  },
  hariSend: {
    component: "ButtonIconic",
    nodeId: "component-button-Wh0irV9y",
    className: "sdn-button-iconic sdn-button-iconic--wh0i",
  },
  hariThinking: {
    component: "ButtonMenu",
    nodeId: "component-panel-IpE0XEo6",
    className: "sdn-button-menu sdn-button-menu--ipe0",
  },
  hariTools: {
    component: "ButtonToggle",
    nodeId: "component-panel-ablPq3kW",
    className: "sdn-button-toggle sdn-button-iconic--pgsr",
  },
  logo: {
    component: "Frame",
    nodeId: "component-frame-AjNqkrLb",
    className: "sdn-frame sdn-frame--ajnq",
  },
  menuComponent: {
    component: "ButtonSimple",
    nodeId: "component-bar-tJLcDfnC",
    className: "sdn-button-simple sdn-button-simple--dbgs",
  },
  menuDev: {
    component: "ButtonSimple",
    nodeId: "component-bar-EW9LJxSD",
    className: "sdn-button-simple sdn-button-simple--dbgs",
  },
  menuEdit: {
    component: "ButtonSimple",
    nodeId: "component-bar-8iQ7zRar",
    className: "sdn-button-simple sdn-button-simple--dbgs",
  },
  menuFile: {
    component: "ButtonSimple",
    nodeId: "component-bar-dBgSvhzY",
    className: "sdn-button-simple sdn-button-simple--dbgs",
  },
  menuMode: {
    component: "ButtonMenu",
    nodeId: "component-bar-nWDgCHuH",
    className: "sdn-button-menu sdn-button-iconic--pgsr",
  },
  menus: {
    component: "Frame",
    nodeId: "component-bar-DrSavE9B",
    className: "sdn-frame sdn-frame--drsa",
  },
  menuTheme: {
    component: "ButtonMenu",
    nodeId: "component-button-trucC1Xo",
    className: "sdn-button-menu sdn-button-iconic--pgsr",
  },
  menuView: {
    component: "ButtonSimple",
    nodeId: "component-bar-FUwSPfCT",
    className: "sdn-button-simple sdn-button-simple--dbgs",
  },
  nodeActions: {
    component: "ButtonIconic",
    nodeId: "component-item-CeZRPCDC",
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
  },
  nodeDisplay: {
    component: "ButtonIconic",
    nodeId: "component-item-A2qQLKuh",
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
  },
  nodeIcon: {
    component: "Icon",
    nodeId: "component-item-zdDEhaL4",
    className: "sdn-icon sdn-icon--xi68",
  },
  nodeLabel: {
    component: "Input",
    nodeId: "component-item-pZCfJ3k6",
    className: "sdn-input sdn-input--pzcf",
  },
  nodeToggle: {
    component: "ButtonIconic",
    nodeId: "component-item-HSgjhz6b",
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
  },
  nodeToggleIcon: {
    component: "Icon",
    nodeId: "component-item-zn8GFZsT",
    className: "sdn-icon sdn-icon--vsau",
  },
  objectsContainer: {
    component: "Frame",
    nodeId: "component-sidebar-ENPyLuzb",
    className: "sdn-frame sdn-frame--enpy",
  },
  optionIcon: {
    component: "Icon",
    nodeId: "component-icon-3QOuNmn2",
    className: "sdn-icon sdn-icon--3qou",
  },
  optionLabel: {
    component: "TextLabel",
    nodeId: "component-text-xOhbdtNu",
    className: "sdn-text-label sdn-text-label--xohb",
  },
  projectActions: {
    component: "ButtonIconic",
    nodeId: "component-comboboxField-Td9lePEX",
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
  },
  projectIcon: {
    component: "Icon",
    nodeId: "component-comboboxField-h6DYE6Jl",
    className: "sdn-icon sdn-icon--xi68",
  },
  projectLabel: {
    component: "Input",
    nodeId: "component-comboboxField-Umc9UbAs",
    className: "sdn-input sdn-input--twyx",
  },
  propertiesContainer: {
    component: "Frame",
    nodeId: "component-sidebar-evMwxVOP",
    className: "sdn-frame sdn-frame--enpy",
  },
  propertyActions: {
    component: "ButtonIconic",
    nodeId: "component-button-CGRbb6mm",
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
  },
  propertyFilter: {
    component: "Input",
    nodeId: "component-comboboxField-Lg6E5jtv",
    className: "sdn-input sdn-input--twyx",
  },
  propertyFilterClear: {
    component: "ButtonIconic",
    nodeId: "component-comboboxField-xvQW1VQq",
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
  },
  propertyLabel: {
    component: "Input",
    nodeId: "component-item-JvSW6JpE",
    className: "sdn-input sdn-input--jvsw",
  },
  propertyToggle: {
    component: "ButtonIconic",
    nodeId: "component-button-iVVLVSBT",
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
  },
  propertyToggleIcon: {
    component: "Icon",
    nodeId: "component-icon-Aa4AD1wO",
    className: "sdn-icon sdn-icon--vsau",
  },
  searchActions: {
    component: "ButtonIconic",
    nodeId: "component-button-q7tCLRdW",
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
  },
  searchIcon: {
    component: "Icon",
    nodeId: "component-icon-CHSbwIMc",
    className: "sdn-icon sdn-icon--xi68",
  },
  searchLabel: {
    component: "Input",
    nodeId: "component-input-w7F4idVF",
    className: "sdn-input sdn-input--yoqi",
  },
  sectionActions: {
    component: "ButtonIconic",
    nodeId: "component-item-m1G2OAIO",
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
  },
  sectionAdd: {
    component: "ButtonIconic",
    nodeId: "component-item-sDjvfAPl",
    className: "sdn-button-iconic sdn-button-iconic--sdjv",
  },
  sectionLabel: {
    component: "TextLabel",
    nodeId: "component-item-Z34z7Dhr",
    className: "sdn-text-label sdn-text-label--z34z",
  },
  sectionToggle: {
    component: "ButtonIconic",
    nodeId: "component-item-OCtkZUuF",
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
  },
  sectionToggleIcon: {
    component: "Icon",
    nodeId: "component-item-7MKLAjub",
    className: "sdn-icon sdn-icon--umgs",
  },
  sidebarComponents: {
    component: "ButtonToggle",
    nodeId: "component-button-f2yi4eeO",
    className: "sdn-button-toggle sdn-button-iconic--pgsr",
  },
  sidebarResources: {
    component: "ButtonToggle",
    nodeId: "component-sidebar-9VESc1Om",
    className: "sdn-button-toggle sdn-button-iconic--pgsr",
  },
  toggleIcon: {
    component: "Icon",
    nodeId: "component-item-YzeMLx3R",
    className: "sdn-icon sdn-icon--xi68",
  },
  toggleValue: {
    component: "ToggleSwitch",
    nodeId: "component-toggleSwitch-pelhFQXa",
    className: "sdn-toggle-switch sdn-toggle-switch--pelh",
  },
  tool: {
    component: "Frame",
    nodeId: "component-frame-RStcYvkF",
    className: "sdn-frame sdn-frame--rstc",
  },
  turns: {
    component: "Frame",
    nodeId: "component-panel-VoRnpuW2",
    className: "sdn-frame sdn-frame--vorn",
  },
  valueIcon: {
    component: "Icon",
    nodeId: "component-icon-V1g4W5fN",
    className: "sdn-icon sdn-icon--xi68",
  },
  valueLabel: {
    component: "Input",
    nodeId: "component-input-IeGTgo7S",
    className: "sdn-input sdn-input--iegt",
  },
  valueOptionsMenu: {
    component: "ButtonIconic",
    nodeId: "component-button-HqmnST2I",
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
  },
  workspaceName: {
    component: "Input",
    nodeId: "component-comboboxField-spqmpmg5",
    className: "sdn-input sdn-input--twyx",
  },
  workspaceSave: {
    component: "ButtonIconic",
    nodeId: "component-comboboxField-o9tr7uLV",
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
  },
}

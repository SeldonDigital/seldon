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
  | "filterActions"
  | "filterIcon"
  | "filterLabel"
  | "menuStates"
  | "nodeActions"
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
  | "valueIcon"
  | "valueLabel"
  | "valueOptionsMenu"

export interface SeldonRefEntry {
  component: string
  nodeId: string
  className: string
}

export const SELDON_REFS: Record<SeldonRef, SeldonRefEntry> = {
  "filterActions": {"component":"ButtonIconic","nodeId":"component-comboboxField-egV44OiP","className":"sdn-button-iconic sdn-button-iconic--pgsr"},
  "filterIcon": {"component":"Icon","nodeId":"component-comboboxField-ta9b5fTa","className":"sdn-icon sdn-icon--xi68"},
  "filterLabel": {"component":"Input","nodeId":"component-comboboxField-TWyxOQad","className":"sdn-input sdn-input--twyx"},
  "menuStates": {"component":"ButtonMenu","nodeId":"component-button-OTbyoxbN","className":"sdn-button-menu sdn-button"},
  "nodeActions": {"component":"ButtonIconic","nodeId":"component-item-CeZRPCDC","className":"sdn-button-iconic sdn-button-iconic--pgsr"},
  "nodeIcon": {"component":"Icon","nodeId":"component-item-zdDEhaL4","className":"sdn-icon sdn-icon--xi68"},
  "nodeLabel": {"component":"Input","nodeId":"component-item-pZCfJ3k6","className":"sdn-input sdn-input--pzcf"},
  "nodeToggle": {"component":"ButtonIconic","nodeId":"component-item-HSgjhz6b","className":"sdn-button-iconic sdn-button-iconic--pgsr"},
  "nodeToggleIcon": {"component":"Icon","nodeId":"component-item-zn8GFZsT","className":"sdn-icon sdn-icon--vsau"},
  "objectsContainer": {"component":"Frame","nodeId":"component-sidebar-ENPyLuzb","className":"sdn-frame sdn-frame--enpy"},
  "optionIcon": {"component":"Icon","nodeId":"component-icon-3QOuNmn2","className":"sdn-icon sdn-icon--xi68"},
  "optionLabel": {"component":"TextLabel","nodeId":"component-text-xOhbdtNu","className":"sdn-text-label sdn-text-label--xohb"},
  "projectActions": {"component":"ButtonIconic","nodeId":"component-comboboxField-Td9lePEX","className":"sdn-button-iconic sdn-button-iconic--pgsr"},
  "projectIcon": {"component":"Icon","nodeId":"component-comboboxField-h6DYE6Jl","className":"sdn-icon sdn-icon--xi68"},
  "projectLabel": {"component":"Input","nodeId":"component-comboboxField-Umc9UbAs","className":"sdn-input sdn-input--twyx"},
  "propertiesContainer": {"component":"Frame","nodeId":"component-sidebar-evMwxVOP","className":"sdn-frame sdn-frame--enpy"},
  "propertyActions": {"component":"ButtonIconic","nodeId":"component-button-CGRbb6mm","className":"sdn-button-iconic sdn-button-iconic--pgsr"},
  "propertyLabel": {"component":"TextLabel","nodeId":"component-text-Xg6PReX9","className":"sdn-text-label sdn-text-label--xg6p"},
  "propertyToggle": {"component":"ButtonIconic","nodeId":"component-button-iVVLVSBT","className":"sdn-button-iconic sdn-button-iconic--pgsr"},
  "propertyToggleIcon": {"component":"Icon","nodeId":"component-icon-Aa4AD1wO","className":"sdn-icon sdn-icon--vsau"},
  "searchActions": {"component":"ButtonIconic","nodeId":"component-button-q7tCLRdW","className":"sdn-button-iconic sdn-button-iconic--pgsr"},
  "searchIcon": {"component":"Icon","nodeId":"component-icon-CHSbwIMc","className":"sdn-icon sdn-icon--xi68"},
  "searchLabel": {"component":"Input","nodeId":"component-input-w7F4idVF","className":"sdn-input sdn-input--yoqi"},
  "sectionActions": {"component":"ButtonIconic","nodeId":"component-item-m1G2OAIO","className":"sdn-button-iconic sdn-button-iconic--pgsr"},
  "sectionAdd": {"component":"ButtonIconic","nodeId":"component-item-sDjvfAPl","className":"sdn-button-iconic sdn-button-iconic--sdjv"},
  "sectionLabel": {"component":"TextLabel","nodeId":"component-item-Z34z7Dhr","className":"sdn-text-label sdn-text-label--z34z"},
  "sectionToggle": {"component":"ButtonIconic","nodeId":"component-item-OCtkZUuF","className":"sdn-button-iconic sdn-button-iconic--pgsr"},
  "sectionToggleIcon": {"component":"Icon","nodeId":"component-item-7MKLAjub","className":"sdn-icon sdn-icon--vsau"},
  "valueIcon": {"component":"Icon","nodeId":"component-icon-V1g4W5fN","className":"sdn-icon sdn-icon--xi68"},
  "valueLabel": {"component":"Input","nodeId":"component-input-IeGTgo7S","className":"sdn-input sdn-input--iegt"},
  "valueOptionsMenu": {"component":"ButtonIconic","nodeId":"component-button-HqmnST2I","className":"sdn-button-iconic sdn-button-iconic--pgsr"},
}

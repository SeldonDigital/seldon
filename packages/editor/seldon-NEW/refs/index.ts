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
  | "nodeActions"
  | "nodeIcon"
  | "nodeLabel"
  | "nodeToggle"
  | "nodeToggleIcon"
  | "propertyActions"
  | "propertyLabel"
  | "propertyToggle"
  | "propertyToggleIcon"
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
  "nodeActions": {"component":"ButtonIconic","nodeId":"component-item-CeZRPCDC","className":"sdn-button-iconic sdn-button-iconic--pgsr"},
  "nodeIcon": {"component":"Icon","nodeId":"component-item-zdDEhaL4","className":"sdn-icon sdn-icon--xi68"},
  "nodeLabel": {"component":"Input","nodeId":"component-item-pZCfJ3k6","className":"sdn-input sdn-input--n6aw"},
  "nodeToggle": {"component":"ButtonIconic","nodeId":"component-item-HSgjhz6b","className":"sdn-button-iconic sdn-button-iconic--pgsr"},
  "nodeToggleIcon": {"component":"Icon","nodeId":"component-item-zn8GFZsT","className":"sdn-icon sdn-icon--vsau"},
  "propertyActions": {"component":"ButtonIconic","nodeId":"component-button-CGRbb6mm","className":"sdn-button-iconic sdn-button-iconic--pgsr"},
  "propertyLabel": {"component":"TextLabel","nodeId":"component-text-Xg6PReX9","className":"sdn-text-label sdn-text-label--xg6p"},
  "propertyToggle": {"component":"ButtonIconic","nodeId":"component-button-iVVLVSBT","className":"sdn-button-iconic sdn-button-iconic--pgsr"},
  "propertyToggleIcon": {"component":"Icon","nodeId":"component-icon-Aa4AD1wO","className":"sdn-icon sdn-icon--vsau"},
  "sectionActions": {"component":"ButtonIconic","nodeId":"component-item-m1G2OAIO","className":"sdn-button-iconic sdn-button-iconic--pgsr"},
  "sectionAdd": {"component":"ButtonIconic","nodeId":"component-item-sDjvfAPl","className":"sdn-button-iconic sdn-button-iconic--sdjv"},
  "sectionLabel": {"component":"TextLabel","nodeId":"component-item-Z34z7Dhr","className":"sdn-text-label sdn-text-label--z34z"},
  "sectionToggle": {"component":"ButtonIconic","nodeId":"component-item-OCtkZUuF","className":"sdn-button-iconic sdn-button-iconic--pgsr"},
  "sectionToggleIcon": {"component":"Icon","nodeId":"component-item-7MKLAjub","className":"sdn-icon sdn-icon--vsau"},
  "valueIcon": {"component":"Icon","nodeId":"component-icon-V1g4W5fN","className":"sdn-icon sdn-icon--xi68"},
  "valueLabel": {"component":"Input","nodeId":"component-input-IeGTgo7S","className":"sdn-input sdn-input--n6aw"},
  "valueOptionsMenu": {"component":"ButtonIconic","nodeId":"component-button-HqmnST2I","className":"sdn-button-iconic sdn-button-iconic--pgsr"},
}

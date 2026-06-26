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
  | "nodeToggle"
  | "propertyActions"
  | "propertyToggle"
  | "sectionActions"
  | "sectionAdd"
  | "sectionToggle"
  | "valueIcon"
  | "valueOptionsMenu"

export interface SeldonRefEntry {
  component: string
  nodeId: string
  className: string
}

export const SELDON_REFS: Record<SeldonRef, SeldonRefEntry> = {
  "nodeActions": {"component":"ButtonIconic","nodeId":"component-item-CeZRPCDC","className":"sdn-button-iconic sdn-button-iconic--pgsr"},
  "nodeToggle": {"component":"ButtonIconic","nodeId":"component-item-HSgjhz6b","className":"sdn-button-iconic sdn-button-iconic--pgsr"},
  "propertyActions": {"component":"ButtonIconic","nodeId":"component-button-CGRbb6mm","className":"sdn-button-iconic sdn-button-iconic--pgsr"},
  "propertyToggle": {"component":"ButtonIconic","nodeId":"component-button-iVVLVSBT","className":"sdn-button-iconic sdn-button-iconic--pgsr"},
  "sectionActions": {"component":"ButtonIconic","nodeId":"component-item-m1G2OAIO","className":"sdn-button-iconic sdn-button-iconic--pgsr"},
  "sectionAdd": {"component":"ButtonIconic","nodeId":"component-item-sDjvfAPl","className":"sdn-button-iconic sdn-button-iconic--sdjv"},
  "sectionToggle": {"component":"ButtonIconic","nodeId":"component-item-OCtkZUuF","className":"sdn-button-iconic sdn-button-iconic--pgsr"},
  "valueIcon": {"component":"Icon","nodeId":"component-icon-V1g4W5fN","className":"sdn-icon sdn-icon--xi68"},
  "valueOptionsMenu": {"component":"ButtonIconic","nodeId":"component-button-HqmnST2I","className":"sdn-button-iconic sdn-button-iconic--pgsr"},
}

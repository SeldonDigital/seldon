import { getComponentSchema } from "../../../components/catalog"
import { ComponentId } from "../../../components/constants"
import { rules } from "../../../rules/config/rules.config"
import type { Entity } from "../../../rules/types/rule-config-types"
import { canNodeHaveChildren } from "../../helpers/nodes/can-node-have-children"
import { mapEntryNodeTypeToRulesEntity } from "../../helpers/rules/map-entry-node-type-to-rules-entity"
import {
  type DefaultVariant,
  type Instance,
  type RulesNodeOrComponent,
  type UserVariant,
  type Variant,
  isEntryNodeForRules,
} from "../../helpers/rules/rules-node-subject"
import type { Board, Workspace } from "../../types"

export class TypeCheckingService {
  /**
   * Gets the entity type of a node or board.
   * @param nodeOrBoard - The node or board to check
   * @returns The entity type
   */
  public getEntityType(nodeOrBoard: RulesNodeOrComponent): Entity {
    if (this.isBoard(nodeOrBoard)) {
      return "board"
    }

    if (isEntryNodeForRules(nodeOrBoard)) {
      return mapEntryNodeTypeToRulesEntity(nodeOrBoard.type)
    }

    return "instance"
  }

  /**
   * Type guard to check if a node is an instance.
   * @param node - The node to check
   * @returns True if the node is an instance
   */
  public isInstance(node: RulesNodeOrComponent | undefined): node is Instance {
    if (node === undefined) return false
    if (isEntryNodeForRules(node)) return node.type === "instance"
    return false
  }

  /**
   * Type guard to check if a node is a variant.
   * @param node - The node to check
   * @returns True if the node is a variant
   */
  public isVariant(node: RulesNodeOrComponent | undefined): node is Variant {
    if (node === undefined) return false
    if (this.isBoard(node)) return false
    if (isEntryNodeForRules(node)) {
      return node.type === "default" || node.type === "variant"
    }
    return false
  }

  /**
   * Type guard to check if a node is a default variant.
   * @param node - The node to check
   * @returns True if the node is a default variant
   */
  public isDefaultVariant(node: RulesNodeOrComponent): node is DefaultVariant {
    if (this.isBoard(node)) return false
    if (isEntryNodeForRules(node)) return node.type === "default"
    return false
  }

  /**
   * Type guard to check if a node is a user variant.
   * @param node - The node to check
   * @returns True if the node is a user variant
   */
  public isUserVariant(node: RulesNodeOrComponent): node is UserVariant {
    if (this.isBoard(node)) return false
    if (isEntryNodeForRules(node)) return node.type === "variant"
    return false
  }

  /**
   * Type guard to check if a node is a board.
   * @param node - The node to check
   * @returns True if the node is a board
   */
  public isBoard(node: RulesNodeOrComponent | undefined): node is Board {
    return node !== undefined && "variants" in node
  }

  /**
   * Type guard to check if a node is a variant or instance.
   * @param node - The node to check
   * @returns True if the node is a variant or instance
   */
  public isNode(node: RulesNodeOrComponent): node is Variant | Instance {
    return !("variants" in node)
  }

  /**
   * Checks if an instance is schema-defined. Reads the engine-maintained
   * `origin` classification set when the instance was created.
   * @param node - The instance to check
   * @returns True when the instance originated from a component schema
   */
  public isSchemaDefinedInstance(node: Instance): boolean {
    return node.origin === "schema"
  }

  /**
   * Checks if a node can have children based on its resolved component catalog
   * template, following `node:` template chains to the catalog root.
   * @param node - The node to check
   * @param workspace - Workspace that contains the node chain
   * @returns True if the node resolves to a component catalog id
   */
  public canNodeHaveChildren(
    node: RulesNodeOrComponent,
    workspace: Workspace,
  ): boolean {
    if (this.isBoard(node)) return false
    if (!isEntryNodeForRules(node)) return false
    return canNodeHaveChildren(node, workspace)
  }

  /**
   * Validates if a component can be a parent of another component based on component level rules.
   * @param parentId - The parent component ID
   * @param childId - The child component ID
   * @returns True if the parent can contain the child
   */
  public canComponentBeParentOf(
    parentId: ComponentId,
    childId: ComponentId,
  ): boolean {
    try {
      const parentLevel = getComponentSchema(parentId).level
      const childLevel = getComponentSchema(childId).level

      return rules.componentLevels[parentLevel].mayContain.includes(childLevel)
    } catch {
      return false
    }
  }
}

export const typeCheckingService = new TypeCheckingService()

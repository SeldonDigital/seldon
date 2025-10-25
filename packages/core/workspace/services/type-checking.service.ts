import { getComponentSchema } from "../../components/catalog"
import { ComponentId } from "../../components/constants"
import { rules } from "../../rules/config/rules.config"
import { Board, DefaultVariant, Instance, UserVariant, Variant } from "../types"

export class TypeCheckingService {
  /**
   * Gets the entity type of a node or board.
   * @param nodeOrBoard - The node or board to check
   * @returns The entity type
   */
  public getEntityType(
    nodeOrBoard: Variant | Instance | Board,
  ): "board" | "userVariant" | "defaultVariant" | "instance" {
    if (this.isBoard(nodeOrBoard)) {
      return "board"
    }

    if (this.isVariant(nodeOrBoard)) {
      return this.isUserVariant(nodeOrBoard) ? "userVariant" : "defaultVariant"
    }

    return "instance"
  }

  /**
   * Type guard to check if a node is an instance.
   * @param node - The node to check
   * @returns True if the node is an instance
   */
  public isInstance(
    node: Variant | Instance | Board | undefined,
  ): node is Instance {
    return node !== undefined && "variant" in node
  }

  /**
   * Type guard to check if a node is a variant.
   * @param node - The node to check
   * @returns True if the node is a variant
   */
  public isVariant(
    node: Variant | Instance | Board | undefined,
  ): node is Variant {
    return node !== undefined && !("variant" in node)
  }

  /**
   * Type guard to check if a node is a default variant.
   * @param node - The node to check
   * @returns True if the node is a default variant
   */
  public isDefaultVariant(node: Variant | Instance): node is DefaultVariant {
    return this.isVariant(node) && node.type === "defaultVariant"
  }

  /**
   * Type guard to check if a node is a user variant.
   * @param node - The node to check
   * @returns True if the node is a user variant
   */
  public isUserVariant(node: Variant | Instance): node is UserVariant {
    return this.isVariant(node) && node.type === "userVariant"
  }

  /**
   * Type guard to check if a node is a board.
   * @param node - The node to check
   * @returns True if the node is a board
   */
  public isBoard(node: Variant | Instance | Board): node is Board {
    return "variants" in node
  }

  /**
   * Type guard to check if a node is a variant or instance.
   * @param node - The node to check
   * @returns True if the node is a variant or instance
   */
  public isNode(node: Variant | Instance | Board): node is Variant | Instance {
    return !("variants" in node)
  }

  /**
   * Checks if an instance is schema-defined (auto-generated from component schema).
   * @param node - The instance to check
   * @returns True if the instance is schema-defined
   */
  public isSchemaDefinedInstance(node: Instance): boolean {
    return node.fromSchema === true
  }

  /**
   * Checks if a node can have children based on component schema restrictions.
   * @param node - The node to check
   * @returns True if the node can have children
   */
  public canNodeHaveChildren(node: Variant | Instance | Board): boolean {
    if (this.isBoard(node)) return false

    try {
      const schema = getComponentSchema(node.component)
      return schema.restrictions?.addChildren !== false
    } catch (error) {
      return false
    }
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
    } catch (error) {
      return false
    }
  }
}

export const typeCheckingService = new TypeCheckingService()

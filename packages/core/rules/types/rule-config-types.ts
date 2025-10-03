/**
 * Rule Configuration Types
 *
 * This file contains precise TypeScript types for all rule configurations,
 * matching the structure in rules.config.ts
 */
import { ComponentLevel } from "../../components/constants"

export type Entity = "board" | "userVariant" | "defaultVariant" | "instance"

/**
 * Base rule interface with conditional config based on appliesTo
 */
export interface Config {
  board: EntityConfig
  userVariant: EntityConfig
  defaultVariant: EntityConfig
  instance: EntityConfig
}

/**
 * Base configuration for all entity rules
 */
export type Propagation = "none" | "downstream" | "bidirectional"

export interface EntityConfig {
  allowed: boolean
  propagation: Propagation
}

/**
 * Delete Rule Logic
 */
export type RemovalBehavior =
  | "delete"
  | "hide"
  | {
      schemaDefined: "delete" | "hide"
      manuallyAdded: "delete" | "hide"
    }

export type DeleteEntityConfig = EntityConfig & {
  removalBehavior: RemovalBehavior
}

export interface DeleteConfig {
  board: DeleteEntityConfig
  userVariant: DeleteEntityConfig
  defaultVariant: DeleteEntityConfig
  instance: DeleteEntityConfig
}

/**
 * Root rules configuration type
 */
export type RuleId = "setProperties" | "rename" | "delete" | "reorder"

export interface MutationRules {
  create: Config
  insertInto: Config
  instantiate: Config
  duplicate: Config
  delete: DeleteConfig
  setProperties: Config
  setTheme: Config
  rename: Config
  reorder: Config
  move: Config
}

export interface ComponentLevelConfig {
  mayContain: ComponentLevel[]
}

export type RulesConfig = {
  mutations: MutationRules
  componentLevels: Record<ComponentLevel, ComponentLevelConfig>
}

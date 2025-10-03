import { ComponentLevel } from "../../components/constants"
import { RulesConfig } from "../types/rule-config-types"

/**
 * Rule Configuration
 */
export const rules: RulesConfig = {
  /**
   * Configuration for component level hierarchy.
   * Each level defines which other levels it can contain as children.
   */
  componentLevels: {
    // Primitives cannot have children
    [ComponentLevel.PRIMITIVE]: {
      mayContain: [],
    },
    // Frames can contain anything except screens
    [ComponentLevel.FRAME]: {
      mayContain: [
        ComponentLevel.PRIMITIVE,
        ComponentLevel.ELEMENT,
        ComponentLevel.PART,
        ComponentLevel.MODULE,
        ComponentLevel.FRAME,
      ],
    },
    // Elements can contain primitives, elements, and frames
    [ComponentLevel.ELEMENT]: {
      mayContain: [
        ComponentLevel.PRIMITIVE,
        ComponentLevel.ELEMENT,
        ComponentLevel.FRAME,
      ],
    },
    // Parts can contain primitives, elements, parts, and frames
    [ComponentLevel.PART]: {
      mayContain: [
        ComponentLevel.PRIMITIVE,
        ComponentLevel.ELEMENT,
        ComponentLevel.PART,
        ComponentLevel.FRAME,
      ],
    },
    // Modules can contain primitives, elements, parts, modules, and frames
    [ComponentLevel.MODULE]: {
      mayContain: [
        ComponentLevel.PRIMITIVE,
        ComponentLevel.ELEMENT,
        ComponentLevel.PART,
        ComponentLevel.MODULE,
        ComponentLevel.FRAME,
      ],
    },
    // Screens can contain anything
    [ComponentLevel.SCREEN]: {
      mayContain: [
        ComponentLevel.PRIMITIVE,
        ComponentLevel.ELEMENT,
        ComponentLevel.PART,
        ComponentLevel.MODULE,
        ComponentLevel.FRAME,
        ComponentLevel.SCREEN,
      ],
    },
  },

  mutations: {
    /**
     * Rules for creating entities
     */
    create: {
      board: {
        allowed: true,
        propagation: "none",
      },
      userVariant: {
        allowed: true,
        propagation: "none",
      },
      defaultVariant: {
        allowed: false,
        propagation: "none",
      },
      instance: {
        allowed: true,
        propagation: "downstream",
      },
    },

    /**
     * Rules for insert entities
     */
    insertInto: {
      board: {
        allowed: false,
        propagation: "none",
      },
      userVariant: {
        allowed: true,
        propagation: "downstream",
      },
      defaultVariant: {
        allowed: true,
        propagation: "downstream",
      },
      instance: {
        allowed: true,
        propagation: "downstream",
      },
    },

    /**
     * Rules for instantiating entities
     */
    instantiate: {
      board: {
        allowed: false,
        propagation: "none",
      },
      userVariant: {
        allowed: true,
        propagation: "downstream",
      },
      defaultVariant: {
        allowed: true,
        propagation: "downstream",
      },
      instance: {
        allowed: true,
        propagation: "downstream",
      },
    },

    /**
     * Rules for duplicating entities
     */
    duplicate: {
      board: {
        allowed: false,
        propagation: "none",
      },
      userVariant: {
        allowed: true,
        propagation: "none",
      },
      defaultVariant: {
        allowed: true,
        propagation: "none",
      },
      instance: {
        allowed: true,
        propagation: "downstream",
      },
    },

    /**
     * Rules for removing entities
     */
    delete: {
      board: {
        allowed: true,
        propagation: "downstream",
        removalBehavior: "delete",
      },
      userVariant: {
        allowed: true,
        propagation: "downstream",
        removalBehavior: "delete",
      },
      defaultVariant: {
        allowed: false,
        propagation: "downstream",
        removalBehavior: "delete",
      },
      instance: {
        allowed: true,
        propagation: "downstream",
        removalBehavior: {
          schemaDefined: "hide", // Auto-generated from parent component schema
          manuallyAdded: "delete", // User manually added this instance
        },
      },
    },

    /**
     * Rules for changing entity properties.
     *
     * Note that even when the propagation is set to none,
     * source properties will still be included when resolving properties for a specific node.
     * This is because properties on instances are considered overrides.
     * Check the `getNodeProperties` function for more details.
     */
    setProperties: {
      board: {
        allowed: true,
        propagation: "none",
      },
      userVariant: {
        allowed: true,
        propagation: "none",
      },
      defaultVariant: {
        allowed: true,
        propagation: "none",
      },
      instance: {
        allowed: true,
        propagation: "none",
      },
    },

    /**
     * Rules for changing the theme of an entity
     */
    setTheme: {
      board: {
        allowed: true,
        propagation: "downstream",
      },
      userVariant: {
        allowed: true,
        propagation: "downstream",
      },
      defaultVariant: {
        allowed: true,
        propagation: "downstream",
      },
      instance: {
        allowed: true,
        propagation: "downstream",
      },
    },

    /**
     * Rules for renaming entities
     */
    rename: {
      board: {
        allowed: false,
        propagation: "none",
      },
      userVariant: {
        allowed: true,
        propagation: "downstream",
      },
      defaultVariant: {
        allowed: false,
        propagation: "downstream",
      },
      instance: {
        allowed: false,
        propagation: "downstream",
      },
    },

    /**
     * Rules for reordering entities
     */
    reorder: {
      board: {
        allowed: true,
        propagation: "none",
      },
      userVariant: {
        allowed: true,
        propagation: "none",
      },
      defaultVariant: {
        allowed: false,
        propagation: "none",
      },
      instance: {
        allowed: true,
        propagation: "downstream",
      },
    },

    /**
     * Rules for moving entities to a new parent
     */
    move: {
      board: {
        allowed: false,
        propagation: "none",
      },
      userVariant: {
        allowed: false,
        propagation: "none",
      },
      defaultVariant: {
        allowed: false,
        propagation: "none",
      },
      instance: {
        allowed: true,
        propagation: "downstream",
      },
    },
  },
}

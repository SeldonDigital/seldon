import { getComponentSchema } from "@seldon/core/components/catalog"
import { isComplexSchema } from "@seldon/core/components/types"
import { ComponentId } from "@seldon/core/components/constants"
import { ComponentToExport, JSONTreeNode } from "../../types"

/**
 * Validation result for component props.
 *
 * Splits proposed children into valid (matching schema) and invalid (not matching schema) groups,
 * and indicates if the component uses fewer props than specified in its schema.
 */
export interface ComponentPropsValidation {
  /** Children that match the component's schema */
  validProps: JSONTreeNode[]
  /** Children that don't match the component's schema */
  invalidProps: JSONTreeNode[]
  /** Whether the component has fewer props than its schema specifies */
  componentHasFewerPropsThanSchema: boolean
}

/**
 * Validates proposed children against a component's schema.
 *
 * Compares proposed children with the component's schema to determine which are valid
 * (match expected component types and counts) and which are invalid (extra props not in schema).
 * This validation determines rendering strategy: valid props are imported as components,
 * invalid props are rendered inline wrapped in Frame components.
 *
 * @param componentName - Name of the component being validated
 * @param componentId - ID of the component to validate against
 * @param proposedChildren - Array of JSONTreeNode children to validate
 * @returns Validation result with valid/invalid props split and schema compliance flag
 */
export function validateComponentProps(
  componentName: string,
  componentId: ComponentId,
  proposedChildren: JSONTreeNode[],
): ComponentPropsValidation {
  try {
    const schema = getComponentSchema(componentId)

    // Get expected children component IDs from schema
    const expectedChildren: ComponentId[] = []

    if (isComplexSchema(schema)) {
      const walk = (children: typeof schema.default.children) => {
        if (!children) return
        for (const child of children) {
          expectedChildren.push(child.component)
          walk(child.children)
        }
      }
      walk(schema.default.children)
      for (const variant of schema.variants ?? []) {
        walk(variant.children)
      }
    }

    // Special handling for Frame: Frame has no schema restrictions (children: []),
    // which means any children are allowed. Treat all children as valid.
    if (componentId === ComponentId.FRAME && expectedChildren.length === 0) {
      return {
        validProps: proposedChildren,
        invalidProps: [],
        componentHasFewerPropsThanSchema: false,
      }
    }

    // Separate valid and invalid props based on type compatibility
    const validProps: JSONTreeNode[] = []
    const invalidProps: JSONTreeNode[] = []

    // Create a map of expected component types and their counts
    const expectedComponentCounts = new Map<ComponentId, number>()
    expectedChildren.forEach((componentId) => {
      expectedComponentCounts.set(
        componentId,
        (expectedComponentCounts.get(componentId) || 0) + 1,
      )
    })

    // Track how many of each component type we've used
    const usedComponentCounts = new Map<ComponentId, number>()

    for (const child of proposedChildren) {
      // Convert component name to ComponentId for comparison
      const childComponentId = getComponentIdFromName(child.name)

      if (childComponentId) {
        const expectedCount = expectedComponentCounts.get(childComponentId) || 0
        const usedCount = usedComponentCounts.get(childComponentId) || 0

        // If this component type is expected in the schema and we haven't exceeded the expected count
        if (expectedCount > 0 && usedCount < expectedCount) {
          validProps.push(child)
          usedComponentCounts.set(childComponentId, usedCount + 1)
        } else {
          // Component type not in schema or we've exceeded the expected count
          invalidProps.push(child)
        }
      } else {
        // Unknown component type
        invalidProps.push(child)
      }
    }

    // Check if component uses fewer props than specified in schema
    const expectedChildrenCount = expectedChildren.length
    const componentHasFewerPropsThanSchema =
      validProps.length < expectedChildrenCount

    return {
      validProps,
      invalidProps,
      componentHasFewerPropsThanSchema,
    }
  } catch (error) {
    // If we can't find the schema, treat all props as valid to maintain existing behavior
    return {
      validProps: proposedChildren,
      invalidProps: [],
      componentHasFewerPropsThanSchema: false,
    }
  }
}

/**
 * Maps component names (PascalCase) to ComponentIds.
 *
 * Provides a lookup table for converting human-readable component names to their
 * internal ComponentId constants. Covers all standard components and variations.
 *
 * @param componentName - PascalCase component name (e.g., "Button", "BarButtons")
 * @returns Corresponding ComponentId or null if not found
 */
export function getComponentIdFromName(
  componentName: string,
): ComponentId | null {
  // Create a mapping from component names to IDs
  const nameToIdMap: Record<string, ComponentId> = {
    Button: ComponentId.BUTTON,
    Icon: ComponentId.ICON,
    Title: ComponentId.TITLE,
    Subtitle: ComponentId.SUBTITLE,
    Text: ComponentId.TEXT,
    Tagline: ComponentId.TAGLINE,
    Description: ComponentId.DESCRIPTION,
    Input: ComponentId.INPUT,
    Label: ComponentId.LABEL,
    Avatar: ComponentId.AVATAR,
    Checkbox: ComponentId.CHECKBOX,
    Image: ComponentId.IMAGE,
    Radio: ComponentId.RADIO,
    Select: ComponentId.SELECT,
    Option: ComponentId.OPTION,
    Fieldset: ComponentId.FIELDSET,
    Legend: ComponentId.LEGEND,
    Hr: ComponentId.HR,
    Nav: ComponentId.NAV,
    Frame: ComponentId.FRAME,
    Heading: ComponentId.HEADING,
    Subheading: ComponentId.SUBHEADING,
    Display: ComponentId.DISPLAY,
    Blockquote: ComponentId.BLOCKQUOTE,
    Cite: ComponentId.CITE,
    Codeblock: ComponentId.CODEBLOCK,
    Table: ComponentId.TABLE,
    Video: ComponentId.VIDEO,
    Footer: ComponentId.FOOTER,
    Source: ComponentId.SOURCE,
    Track: ComponentId.TRACK,
    TextblockDetails: ComponentId.TEXTBLOCK_DETAILS,
    TextblockTitle: ComponentId.TEXTBLOCK_TITLE,
    TextblockHeader: ComponentId.TEXTBLOCK_HEADER,
    TextblockAvatar: ComponentId.TEXTBLOCK_AVATAR,
    Textblock: ComponentId.TEXTBLOCK,
    // Button variations
    BarButtons: ComponentId.BAR_BUTTONS,
    // Input variations
    InputCheckbox: ComponentId.INPUT_CHECKBOX,
    InputRadio: ComponentId.INPUT_RADIO,
    InputIconic: ComponentId.INPUT_ICONIC,
    InputDropdown: ComponentId.INPUT_DROPDOWN,
    InputSearch: ComponentId.INPUT_SEARCH,
    InputText: ComponentId.INPUT_TEXT,
    // List variations
    ListItem: ComponentId.LIST_ITEM,
    ListStandard: ComponentId.LIST_STANDARD,
    ListGrid: ComponentId.LIST_GRID,
    ListItemStandard: ComponentId.LIST_ITEM_STANDARD,
    ListItemAvatar: ComponentId.LIST_ITEM_AVATAR,
    ListItemProduct: ComponentId.LIST_ITEM_PRODUCT,
    ListItemGeneral: ComponentId.LIST_ITEM_GENERAL,
    ListItemTodo: ComponentId.LIST_ITEM_TODO,
    // Header variations
    HeaderAction: ComponentId.HEADER_ACTION,
    HeaderCard: ComponentId.HEADER_CARD,
    // Card variations
    CardProduct: ComponentId.CARD_PRODUCT,
    CardStacked: ComponentId.CARD_STACKED,
    CardHorizontal: ComponentId.CARD_HORIZONTAL,
    // Frame variations (Frame already defined above)
    TableData: ComponentId.TABLE_DATA,
    TableHeader: ComponentId.TABLE_HEADER,
    TableInput: ComponentId.TABLE_INPUT,
    TableRowData: ComponentId.TABLE_ROW_DATA,
    Calendar: ComponentId.CALENDAR,
    // Other components
    Chip: ComponentId.CHIP,
    ChipCount: ComponentId.CHIP_COUNT,
    Screen: ComponentId.SCREEN,
    PanelDialog: ComponentId.PANEL_DIALOG,
    // Add more mappings as needed
  }

  return nameToIdMap[componentName] || null
}

/**
 * Extracts the ComponentId from a ComponentToExport object.
 *
 * First attempts to use the componentId property directly, then falls back to
 * name-based lookup if needed.
 *
 * @param component - The ComponentToExport object to extract ComponentId from
 * @returns The ComponentId or null if not found
 */
export function getComponentIdFromComponent(
  component: ComponentToExport,
): ComponentId | null {
  // Try to extract ComponentId from the component's tree
  if (component.componentId) {
    return component.componentId
  }

  // Fallback: try to map from name
  return getComponentIdFromName(component.name)
}

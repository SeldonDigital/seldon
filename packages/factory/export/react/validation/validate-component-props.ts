import { getComponentSchema } from "@seldon/core/components/catalog"
import { ComponentId } from "@seldon/core/components/constants"
import { ComponentToExport, JSONTreeNode } from "../../types"

/**
 * Validates if props are valid for a component and splits them into valid and invalid groups
 */
export interface ComponentPropsValidation {
  validProps: JSONTreeNode[]
  invalidProps: JSONTreeNode[]
  componentHasFewerPropsThanSchema: boolean
}

export function validateComponentProps(
  componentName: string,
  componentId: ComponentId,
  proposedChildren: JSONTreeNode[],
): ComponentPropsValidation {
  try {
    const schema = getComponentSchema(componentId)

    // Get expected children component IDs from schema
    const expectedChildren: ComponentId[] = []

    // Only complex components have children
    if ("children" in schema && schema.children) {
      schema.children.forEach((child) => {
        expectedChildren.push(child.component)
      })
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
 * Maps component names to ComponentIds
 * This mapping should cover the most common component name patterns
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
    ButtonSegmented: ComponentId.BUTTON_SEGMENTED,
    ButtonTools: ComponentId.BUTTON_TOOLS,
    // Input variations
    InputCheckbox: ComponentId.INPUT_CHECKBOX,
    InputRadio: ComponentId.INPUT_RADIO,
    InputIconic: ComponentId.INPUT_ICONIC,
    InputDropdown: ComponentId.INPUT_DROPDOWN,
    InputSearch: ComponentId.INPUT_SEARCH,
    InputText: ComponentId.INPUT_TEXT,
    // Avatar variations
    AvatarIcon: ComponentId.AVATAR_ICON,
    AvatarProduct: ComponentId.AVATAR_PRODUCT,
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
    // Table variations
    TableBody: ComponentId.TABLE_BODY,
    TableData: ComponentId.TABLE_DATA,
    TableFoot: ComponentId.TABLE_FOOT,
    TableHead: ComponentId.TABLE_HEAD,
    TableHeader: ComponentId.TABLE_HEADER,
    TableInput: ComponentId.TABLE_INPUT,
    TableRowData: ComponentId.TABLE_ROW_DATA,
    TableRowFooter: ComponentId.TABLE_FOOT,
    TableRowHeader: ComponentId.TABLE_ROW_HEADER,
    // Calendar variations
    Calendar: ComponentId.CALENDAR,
    CalendarHeader: ComponentId.CALENDAR_HEADER,
    CalendarMonth: ComponentId.CALENDAR_MONTH,
    CalendarWeek: ComponentId.CALENDAR_WEEK,
    CalendarWeekdays: ComponentId.CALENDAR_WEEKDAYS,
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
 * Gets the ComponentId for a given component name by looking it up in the component tree
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

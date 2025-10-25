# Core Workspace System - Technical Reference

This document provides technical implementation details, code examples, and specifications for the Core Workspace System.

## Quick Start

### For Engineers

```typescript
import { Sdn, Workspace, coreReducer } from "@seldon/core"

// Create a workspace
const workspace: Workspace = {
  version: 1,
  boards: {},
  byId: {},
  customTheme: customTheme,
}

// Add a component board
const updatedWorkspace = coreReducer(workspace, {
  type: "add_board",
  payload: { componentId: Sdn.ComponentId.BUTTON },
})
```

### For Designers

- **Hierarchical Structure**: Workspace → Boards → Variants → Instances
- **Component Management**: Create, modify, and organize design components
- **Property Inheritance**: Changes propagate through the component hierarchy
- **Theme Integration**: Apply themes across entire component systems

## Workspace Structure Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        WORKSPACE                            │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                    BOARD                            │    │
│  │  (Button Component Type)                            │    │
│  │  ┌─────────────────────────────────────────────┐    │    │
│  │  │                VARIANT                      │    │    │
│  │  │  (Default Button)                           │    │    │
│  │  │  ┌─────────────────────────────────────┐    │    │    │
│  │  │  │              INSTANCE               │    │    │    │
│  │  │  │  (Button in ProductCard)            │    │    │    │
│  │  │  │  ┌─────────────────────────────┐    │    │    │    │
│  │  │  │  │         INSTANCE            │    │    │    │    │
│  │  │  │  │  (Icon in Button)           │    │    │    │    │
│  │  │  │  └─────────────────────────────┘    │    │    │    │
│  │  │  └─────────────────────────────────────┘    │    │    │
│  │  └─────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

## Entry Points and Samples

### Main Entry Points

#### 1. Core Workspace Reducer

```typescript
import { coreReducer } from "./reducers/core/reducer"

const updatedWorkspace = coreReducer(workspace, action)
```

#### 2. AI Workspace Reducer

```typescript
import { processAiActions } from "./reducers/ai/helpers/process-ai-actions"

const updatedWorkspace = processAiActions(workspace, actions)
```

#### 3. Workspace Service

```typescript
import { workspaceService } from "./services/workspace.service"

// Direct workspace manipulation
const node = workspaceService.getNode(nodeId, workspace)
const updatedWorkspace = workspaceService.setNodeProperties(
  nodeId,
  properties,
  workspace,
)
```

#### 4. Theme Service

```typescript
import { themeService } from "./services/theme.service"

// Theme management
const theme = themeService.getNodeTheme(nodeId, workspace)
const updatedWorkspace = themeService.setNodeTheme(nodeId, themeId, workspace)
```

### Sample Workspace Structure

```typescript
const workspace: Workspace = {
  version: 1,
  customTheme: customTheme,
  boards: {
    [ComponentId.BUTTON]: {
      id: ComponentId.BUTTON,
      label: "Buttons",
      order: 0,
      theme: "default",
      properties: {},
      variants: ["variant-button-default", "variant-button-custom"],
    },
  },
  byId: {
    "variant-button-default": {
      id: "variant-button-default",
      type: "defaultVariant",
      component: ComponentId.BUTTON,
      level: ComponentLevel.ELEMENT,
      label: "Button",
      isChild: false,
      fromSchema: true,
      theme: null,
      properties: {},
      children: ["child-icon-1", "child-label-1"],
    },
    "child-icon-1": {
      id: "child-icon-1",
      type: "defaultVariant",
      component: ComponentId.ICON,
      level: ComponentLevel.ELEMENT,
      label: "Icon",
      isChild: true,
      fromSchema: true,
      theme: null,
      variant: "variant-icon-default",
      instanceOf: "variant-icon-default",
      properties: {},
      children: [],
    },
  },
}
```

### Sample Actions

#### Core Actions

```typescript
// Board Management
const addBoardAction = {
  type: "add_board",
  payload: { componentId: ComponentId.BUTTON },
}

// Node Operations
const setPropertiesAction = {
  type: "set_node_properties",
  payload: {
    nodeId: "variant-button-default",
    properties: {
      screenWidth: {
        type: ValueType.EXACT,
        value: { value: 600, unit: Unit.PX },
      },
    },
  },
}

// Structural Changes
const insertNodeAction = {
  type: "insert_node",
  payload: {
    nodeId: "variant-icon-default",
    target: {
      parentId: "variant-button-default",
      index: 0,
    },
  },
}
```

#### AI Actions

```typescript
const aiActions = [
  {
    type: "ai_add_component",
    payload: {
      componentId: ComponentId.CARD_PRODUCT,
      ref: "$ref1",
    },
  },
  {
    type: "ai_set_node_properties",
    payload: {
      nodeId: "$ref1.0.1",
      properties: {
        content: { type: ValueType.EXACT, value: "NewTextValue" },
      },
    },
  },
]
```

## Data Processing and Architecture

### 1. Middleware Pipeline Architecture

The workspace system uses a middleware pipeline for all operations:

```typescript
// Middleware execution order
const middlewares = [
  validationMiddleware, // 1. Validate action payload
  sentryBreadcrumbMiddleware, // 2. Log for debugging
  // ... action processing ...
  migrationMiddleware, // 3. Apply data migrations
  workspaceVerificationMiddleware, // 4. Verify workspace integrity
]
```

#### Validation Middleware

Validates action payloads before processing:

- Node existence checks
- Parent-child relationship validation
- Component level hierarchy enforcement
- Board and variant constraint validation
- Custom theme swatch existence

#### Verification Middleware

Validates workspace integrity after processing:

- All children exist in workspace
- All variants exist in boards
- All instances reference valid parents
- No duplicate IDs
- No dangling variants or child nodes
- Board order consistency
- One default variant per board

### 2. Action Processing Flow

#### Core Actions Flow

```typescript
// 1. Validation - Ensures action payload is valid
// 2. Sentry Breadcrumb - Logs action for debugging
// 3. Action Processing - Core reducer logic with rules-based authorization
// 4. Migration - Applies any necessary data migrations
// 5. Verification - Validates workspace integrity
// 6. Debug Logging - (Development only) Logs state changes
```

#### AI Actions Flow

```typescript
// 1. Preprocessing - Analyze required structures and create missing variants
// 2. Reference Mapping - Build reference map for AI action targeting
// 3. Schema-Workspace Reconciliation - Handle mismatches between AI expectations and workspace
// 4. Action Processing - Process each action with reference resolution
// 5. Middleware Pipeline - Same as core actions
```

### 3. Rules-Based Authorization System

All operations are controlled by a rules system:

```typescript
// Example: Property setting with propagation control
const { allowed, propagation } = rules.mutations.setProperties[entityType]
if (allowed) {
  return workspaceService.propagateNodeOperation({
    nodeId: payload.nodeId,
    propagation,
    apply: (node, workspace) => {
      return workspaceService.setNodeProperties(
        node.id,
        payload.properties,
        workspace,
        payload.options
      )
    },
    workspace,
  })
}
```

#### Propagation Types

- **none**: Operation applies only to target node
- **downstream**: Operation propagates to all instances
- **bidirectional**: Operation propagates in both directions

#### Entity Types

- **board**: Component boards containing variants
- **userVariant**: User-created variants
- **defaultVariant**: System-generated default variants
- **instance**: Instances of variants within other components

### 4. Component Instantiation System

System for creating component hierarchies:

#### Bottom-Up Creation Strategy

```typescript
// Process components in reverse order to ensure parent components
// have access to their children's variant IDs
for (const componentId of components.reverse()) {
  if (draft.boards[componentId]) {
    // Use existing board
    registry[componentId] = createRegisterFromExistingBoard(componentId, draft)
  } else {
    // Create new board with all child components
    const { newInstancesById, newVariantId } = instantiateComponent(
      componentId,
      registry,
    )

    draft.byId = { ...draft.byId, ...newInstancesById }
    draft.boards[componentId] = {
      label: workspaceService.getInitialBoardLabel(componentId),
      id: componentId,
      theme: "default",
      variants: [newVariantId],
      properties: {},
      order,
    }
  }
}
```

#### Nested Overrides Processing

Handles complex property inheritance patterns:

```typescript
// Example: ButtonBar with multiple buttons
// "button1.icon.symbol" -> First button's icon symbol
// "button2.label.content" -> Second button's label content
// "button3.background.color" -> Third button's background color
```

### 5. Reference Mapping System (AI)

AI actions use reference IDs for targeting specific nodes:

```typescript
// Example reference map for a ProductCard component:
{
  "$ref": "variant-cardProduct-default",
  "$ref.0": "child-textblockDetails-x",
  "$ref.0.1": "child-title-x",
  "$ref.1": "child-buttonBar-x",
  "$ref.1.0": "child-button-x",
  "$ref.1.0.0": "child-labelButton-x",
  "$ref.1.0.1": "child-icon-x"
}
```

### 6. Schema-Workspace Reconciliation (AI)

Handling of mismatches between AI expectations and workspace state:

#### Reconciliation Logic

1. **Exact Match**: If workspace matches schema → use existing variant
2. **Partial Match**: If existing variant can be used → reuse it
3. **Instance Analysis**: Check if existing instances can be reused or if their patterns suggest a different approach
   - Analyze existing instance structures for reuse opportunities
   - Consider instance property patterns and inheritance
   - Evaluate if existing instances can be modified instead of creating new variants
4. **No Match**: If no suitable variant or instance exists → create new custom variant

### 7. Immutable State Management

All operations use Immer for immutable state updates:

```typescript
return produce(workspace, (draft) => {
  // All modifications are made to the draft
  // Immer ensures immutability
  draft.boards[componentId] = newBoard
  draft.byId[nodeId] = newNode
})
```

## Available Action Types

### Core Actions

#### Workspace Management

- `set_workspace` - Completely replaces the workspace with a new state

#### Board Management

- `add_board` - Creates a new component board with default variant
- `add_board_and_insert_default_variant` - Creates board and inserts default variant into target
- `remove_board` - Removes a component board and all its variants
- `reorder_board` - Changes the order of component boards
- `set_board_properties` - Sets properties on a component board
- `reset_board_property` - Resets a specific board property to default
- `set_board_theme` - Applies a theme to a component board

#### Variant Management

- `add_variant` - Creates a new variant by duplicating the default variant

#### Node Operations

- `insert_node` - Inserts a node into another node at a specific position
- `remove_node` - Removes a node from the workspace
- `duplicate_node` - Creates a copy of a node
- `move_node` - Moves a node to a different parent/position
- `reorder_node` - Changes the order of a node within its parent

#### Property Management

- `set_node_properties` - Sets multiple properties on a node
- `reset_node_property` - Resets a specific node property to default
- `set_node_label` - Updates a node's display label
- `set_node_theme` - Applies a theme to a node

#### Custom Theme Management

- `reset_custom_theme` - Resets the custom theme to defaults
- `add_custom_theme_swatch` - Adds a new color swatch
- `remove_custom_theme_swatch` - Removes a color swatch
- `update_custom_theme_swatch` - Updates an existing swatch

#### Custom Theme Property Setters (40+ actions)

- `set_custom_theme_core_ratio` - Sets the core ratio
- `set_custom_theme_core_font_size` - Sets the core font size
- `set_custom_theme_core_size` - Sets the core size
- `set_custom_theme_base_color` - Sets the base color
- `set_custom_theme_harmony` - Sets the color harmony
- `set_custom_theme_color_value` - Sets color system values
- `set_custom_theme_default_icon_color` - Sets default icon color
- `set_custom_theme_default_icon_size` - Sets default icon size
- `set_custom_theme_border_width_value` - Sets border width values
- `set_custom_theme_corners_value` - Sets corner radius values
- `set_custom_theme_font_family_value` - Sets font family values
- `set_custom_theme_font_value` - Sets font parameters
- `set_custom_theme_font_size_value` - Sets font size values
- `set_custom_theme_font_weight_value` - Sets font weight values
- `set_custom_theme_size_value` - Sets size values
- `set_custom_theme_dimension_value` - Sets dimension values
- `set_custom_theme_margin_value` - Sets margin values
- `set_custom_theme_padding_value` - Sets padding values
- `set_custom_theme_gap_value` - Sets gap values
- `set_custom_theme_line_height_value` - Sets line height values
- `set_custom_theme_shadow_value` - Sets shadow parameters
- `set_custom_theme_border_value` - Sets border parameters
- `set_custom_theme_blur_value` - Sets blur values
- `set_custom_theme_spread_value` - Sets spread values
- `set_custom_theme_gradient_value` - Sets gradient parameters
- `set_custom_theme_background_value` - Sets background parameters
- `set_custom_theme_scrollbar_value` - Sets scrollbar parameters

#### Transcript Management

- `transcript_add_message` - Adds messages to the transcript

### AI Actions

#### Component Management

- `ai_add_component` - Creates a new component board
- `ai_remove_component` - Removes a component board
- `ai_reorder_board` - Reorders component boards

#### Variant Management

- `ai_add_variant` - Creates a new variant for a component
- `ai_duplicate_node` - Duplicates a node structure
- `ai_insert_node` - Inserts a node at a specific position

#### Node Operations

- `ai_remove_node` - Removes a node from the workspace
- `ai_move_node` - Moves a node to a different parent/position
- `ai_reorder_node` - Changes the order of a node within its parent

#### Property Management

- `ai_set_node_properties` - Sets multiple properties on a node
- `ai_reset_node_property` - Resets a specific property to default
- `ai_set_node_label` - Updates a node's display label
- `ai_set_node_theme` - Applies a theme to a node

#### Board Operations

- `ai_set_board_properties` - Sets properties on a component board
- `ai_set_board_theme` - Applies a theme to a component board

#### Custom Theme Management

- `ai_reset_custom_theme` - Resets the custom theme to defaults
- `ai_add_custom_theme_swatch` - Adds a new color swatch
- `ai_remove_custom_theme_swatch` - Removes a color swatch
- `ai_update_custom_theme_swatch` - Updates an existing swatch
- `ai_set_custom_theme_*` - Various theme property setters (40+ actions)

#### Transcript Management

- `ai_transcript_add_message` - Adds messages to the AI transcript

## Workspace Service Functions

### Node Retrieval Methods

```typescript
// Get a board from the workspace
workspaceService.getBoard(componentId, workspace): Board

// Get a node from the workspace
workspaceService.getNode(nodeId, workspace): Variant | Instance

// Get a node or board from the workspace
workspaceService.getObject(objectId, workspace): Variant | Instance | Board

// Get all nodes from the workspace
workspaceService.getNodes(workspace): (Variant | Instance)[]
```

### Node Manipulation Methods

```typescript
// Set properties on a node
workspaceService.setNodeProperties(nodeId, properties, workspace, options): Workspace

// Move a node to a new parent and position
workspaceService.moveNode(nodeId, target, workspace): Workspace

// Insert a node into another node
workspaceService.insertNode(nodeId, target, workspace): Workspace

// Remove a node from the workspace
workspaceService.removeNode(nodeId, workspace): Workspace

// Duplicate a node
workspaceService.duplicateNode(nodeId, workspace): Workspace
```

### Component Instantiation

```typescript
// Create a new component board with all child components
workspaceService.createBoard(componentId, workspace): Workspace

// Instantiate a component with all its children
workspaceService.instantiateComponent(componentId, registry): { newInstancesById, newVariantId }
```

### Property Management

```typescript
// Merge properties with existing node properties
workspaceService.mergeNodeProperties(nodeId, properties, workspace): Workspace

// Reset a specific property to default
workspaceService.resetNodeProperty(nodeId, propertyKey, workspace): Workspace

// Process nested overrides for child components
workspaceService.processNestedOverridesProps(childProperties, parentNestedOverrides, componentId): Properties
```

## Theme Service Functions

### Theme Retrieval

```typescript
// Get the theme ID of an object (board, variant, or instance)
themeService.getObjectThemeId(object, workspace): ThemeId

// Get the theme of an object
themeService.getObjectTheme(object, workspace): Theme

// Get the theme ID of a node with inheritance
themeService.getNodeThemeId(nodeId, workspace): ThemeId

// Get the theme of a node with inheritance
themeService.getNodeTheme(nodeId, workspace): Theme
```

### Theme Management

```typescript
// Set a theme on a node
themeService.setNodeTheme(nodeId, themeId, workspace): Workspace

// Set a theme on a board
themeService.setBoardTheme(componentId, themeId, workspace): Workspace

// Get the next available custom swatch ID
themeService.getNextCustomSwatchId(workspace): string
```

## Helper Functions

### Node Operations

```typescript
// Node retrieval and traversal
getNodeById(nodeId, workspace): Variant | Instance
getNodeByParentIdAndIndex(parentId, index, workspace): Variant | Instance
findParentNode(node, workspace): Variant | Instance
findNodeByVariant(variantId, workspace): Variant | Instance

// Node manipulation
duplicateNode(node): Variant | Instance
moveItemInArray(array, itemId, newIndex): void

// Node validation
canNodeHaveChildren(nodeId, workspace): boolean
nodeAllowsReordering(nodeId, workspace): boolean
isOnlyChild(nodeId, workspace): boolean
```

### Board Operations

```typescript
// Board retrieval
getBoardById(componentId, workspace): Board
getAllVariants(workspace): Variant[]
getDefaultVariant(componentId, workspace): Variant

// Board validation
hasMultipleBoards(workspace): boolean
areBoardVariantsInUse(board, workspace): boolean
```

### Variant Operations

```typescript
// Variant retrieval
getVariantById(variantId, workspace): Variant
getVariantIndex(variantId, workspace): number
getVariantSiblings(variantId, workspace): Variant[]

// Variant validation
isDefaultVariant(variant): boolean
isUserVariant(variant): boolean
isVariantInUse(variantId, workspace): boolean
isVariantNode(node): boolean
```

### Component Operations

```typescript
// Component instantiation
getChildrenFromSchema(componentId): Component[]
componentToChildNode(componentId, parentId, workspace): Instance

// Component validation
canComponentBeParentOf(parentComponentId, childComponentId): boolean
```

## Error Handling

The system handles various error conditions gracefully:

```typescript
// Rule-based operation blocking
if (!rules.mutations.create.board.allowed) {
  return workspace
}

// Entity type validation
const { allowed, propagation } = rules.mutations.setProperties[entityType]
if (!allowed) {
  return workspace
}

// Node existence validation
const node = workspaceService.getNode(payload.nodeId, workspace)
if (!node) {
  throw new Error(`Node ${payload.nodeId} not found`)
}

// Skip actions referencing non-existent nodes (AI)
if (isActionReferencingNonExistentNode(action, workspace)) {
  return workspace
}
```

## Advanced Features

### 1. Indexed Nested Overrides

The system supports complex property inheritance patterns:

```typescript
// Example: ButtonBar with multiple buttons
// "button1.icon.symbol" -> First button's icon symbol
// "button2.label.content" -> Second button's label content
// "button3.background.color" -> Third button's background color
```

### 2. Component Registry System

During board creation, a registry maintains component relationships:

```typescript
type NodeRegistry = Partial<Record<ComponentId, NodeRegister>>

type NodeRegister = {
  id: VariantId | InstanceId
  component: ComponentId
  children?: NodeRegister[]
}
```

### 3. Path-Based Node Finding

The system can find nodes by their hierarchical path:

```typescript
// Find node by path: ["ButtonBar", "Button", "Icon"]
const node = workspaceService.findNodeByPath(
  rootNode,
  ["ButtonBar", "Button", "Icon"],
  workspace,
)
```

### 4. Migration System

Automatic data migration for workspace format changes:

```typescript
// Migration middleware applies necessary transformations
const migrationMiddleware: Middleware = (next) => (workspace, action) => {
  const migratedWorkspace = applyMigrations(workspace)
  return next(migratedWorkspace, action)
}
```

### 5. Component Level Hierarchy

Enforces strict component containment rules:

```typescript
// Component levels and what they can contain
componentLevels: {
  [ComponentLevel.PRIMITIVE]: { mayContain: [] },
  [ComponentLevel.ELEMENT]: { mayContain: [PRIMITIVE, ELEMENT, FRAME] },
  [ComponentLevel.PART]: { mayContain: [PRIMITIVE, ELEMENT, PART, FRAME] },
  [ComponentLevel.MODULE]: { mayContain: [PRIMITIVE, ELEMENT, PART, MODULE, FRAME] },
  [ComponentLevel.SCREEN]: { mayContain: [PRIMITIVE, ELEMENT, PART, MODULE, FRAME, SCREEN] },
  [ComponentLevel.FRAME]: { mayContain: [PRIMITIVE, ELEMENT, PART, MODULE, FRAME] }
}
```

## System Architecture

### Directory Structure

```
packages/core/workspace/
├── constants.ts              # Error messages and constants
├── types.ts                  # Core type definitions
├── helpers/                  # Utility functions
│   ├── are-board-variants-in-use.ts
│   ├── find-parent-node.ts
│   ├── get-node-by-id.ts
│   └── ... (40+ helper functions)
├── middleware/               # Middleware system
│   ├── apply-middleware.ts
│   ├── validation.ts
│   ├── verification.ts
│   ├── debug.ts
│   └── migration/           # Data migration system
├── reducers/                # Action reducers
│   ├── core/               # Core workspace actions
│   │   ├── reducer.ts
│   │   ├── types.ts
│   │   └── handlers/       # 98 action handlers
│   └── ai/                 # AI workspace actions
│       ├── reducer.ts
│       ├── types.ts
│       ├── handlers/       # 48 action handlers
│       └── helpers/        # AI-specific helpers
└── services/               # Core services
    ├── workspace.service.ts # Main workspace service
    └── theme.service.ts     # Theme management service
```

### Key Subsystems

#### 1. Core Reducer System

- Handles direct user interactions
- 98 action handlers for workspace operations
- Rules-based authorization
- Propagation control
- Component instantiation

#### 2. AI Reducer System

- Processes AI-generated actions
- 48 action handlers for AI operations
- Schema-workspace reconciliation
- Reference mapping
- Custom variant creation

#### 3. Middleware System

- Validation middleware
- Verification middleware
- Migration middleware
- Debug middleware
- Sentry breadcrumb middleware

#### 4. Service Layer

- Workspace service (1735 lines)
- Theme service (180 lines)
- Centralized business logic
- Type-safe operations

#### 5. Helper System

- 40+ utility functions
- Node manipulation
- Board management
- Variant operations
- Type checking

## Return Value

The system returns an updated `Workspace` object with all changes applied:

```typescript
interface Workspace {
  version: number
  boards: Record<ComponentId, Board>
  byId: Record<string, Node>
  customTheme: CustomTheme
}
```

All actions result in structural changes, property updates, and consistency maintenance as described in the action categories.

## Key Results

### 1. Structural Changes

- New component boards created with proper hierarchy
- Variants added, removed, or modified
- Node hierarchies restructured (moved, inserted, duplicated)
- Board ordering updated
- Custom variants created when schema doesn't match workspace

### 2. Property Updates

- Node properties updated with validation
- Board properties modified
- Custom theme properties applied
- Property inheritance maintained
- Theme applications applied

### 3. Consistency Maintenance

- All instances updated through propagation
- Variant relationships preserved
- Schema compliance maintained
- Workspace integrity verified
- Reference IDs resolved to actual node IDs

## Usage as Source of Truth

This technical reference serves as the authoritative documentation for the Core Workspace System implementation. When making changes:

1. **Update this document first** to reflect the intended behavior
2. **Implement changes** to match the documented behavior
3. **Update tests** to verify the documented behavior
4. **Validate** that the system behaves as documented

The system is designed to be:

- **Predictable**: Behavior should match documentation exactly
- **Robust**: Handle edge cases gracefully without breaking
- **Extensible**: Easy to add new action types and behaviors
- **Debuggable**: Clear error messages and logging
- **Performant**: Efficient state updates with minimal re-renders
- **Consistent**: All subsystems follow the same patterns and principles
- **Type-Safe**: TypeScript types throughout
- **Validated**: Multiple layers of validation and verification

# Core Workspace Reducer System

## Overview

The Core Workspace Reducer System is a real-time state processor that handles all workspace actions as they occur. It processes user interactions, programmatic modifications, and system events through a middleware pipeline that validates, executes, and verifies each action in real-time. The system manages workspace structure, component boards, variants, nodes, and custom themes with consistency guarantees.

## Core Concepts

### Variants vs Instances

**Variants** are the template definitions for components:
- Each component board has one or more variants (including a default variant)
- Variants define the structure, properties, and behavior of a component
- Variants are stored at the board level and can be referenced by multiple instances
- Variant IDs follow the pattern: `variant-{componentId}-{variantName}`

**Instances** are the actual usage of variants within the workspace:
- Instances are created when a variant is inserted into another component
- Each instance references a specific variant via the `instanceOf` property
- Instances can have their own property overrides that differ from the variant
- Instance IDs are generated dynamically and are unique across the workspace
- Instances form the actual component hierarchy in the workspace

**Key Relationships**:
- One variant can have many instances
- Each instance belongs to exactly one variant
- Changes to a variant affect all its instances (unless overridden)
- Changes to an instance only affect that specific instance
- Instances can be moved, duplicated, and removed independently
- Variants can only be modified, not moved or duplicated

**Example**:
```typescript
// Variant definition (template)
const buttonVariant = {
  id: "variant-button-primary",
  component: "BUTTON",
  properties: { 
    background: { color: "blue" },
    label: { content: "Click me" }
  },
  children: ["instance-icon-123"]
}

// Instance usage (actual component in workspace)
const buttonInstance = {
  id: "instance-button-456",
  component: "BUTTON", 
  instanceOf: "variant-button-primary", // References the variant
  properties: {
    // Can override variant properties
    label: { content: "Custom text" }
    // background color inherits from variant
  },
  children: ["instance-icon-789"] // Can have different children
}
```
The Core Workspace Reducer System is the foundational state management layer that handles direct user interactions and programmatic workspace modifications. It provides the core functionality for managing workspace structure, component boards, variants, nodes, and custom themes through a set of actions and handlers.

## Entry Points and Samples

### Main Entry Point
```typescript
import { coreReducer } from './reducer'

const updatedWorkspace = coreReducer(workspace, action)
```

### Sample Core Actions
```typescript
// Board Management
const addBoardAction = {
  type: "add_board",
  payload: {
    componentId: ComponentId.BUTTON
  }
}

// Node Operations
const setPropertiesAction = {
  type: "set_node_properties",
  payload: {
    nodeId: "variant-button-default",
    properties: {
      screenWidth: {
        type: ValueType.EXACT,
        value: { value: 600, unit: Unit.PX }
      }
    }
  }
}

// Structural Changes
const insertNodeAction = {
  type: "insert_node",
  payload: {
    nodeId: "variant-icon-default",
    target: {
      parentId: "variant-button-default",
      index: 0
    }
  }
}

// Custom Theme Management
const setThemeAction = {
  type: "set_custom_theme_base_color",
  payload: {
    value: { h: 200, s: 50, l: 60 }
  }
}
```


## Real-Time Processing Architecture

The core reducer processes actions through a middleware pipeline that ensures validation, execution, and verification. For detailed information about the middleware system, see the [Middleware README](../../middleware/README.md).

### Key Processing Characteristics
- **Immediate Processing**: Actions are processed synchronously as they occur
- **Real-Time Validation**: Each action is validated before execution
- **Immediate Verification**: Workspace integrity is verified after each action
- **Fail-Fast**: Invalid actions are rejected immediately with detailed error messages
- **Consistency Guarantees**: All state changes maintain workspace consistency

## Action Categories and Processing

The system handles multiple categories of actions, each with validation and processing requirements:

### Workspace Management Actions
- **`set_workspace`**: Complete workspace replacement with migration support

### Board Management Actions
- **`add_board`**: Creates new component board with default variant (no instances created yet)
- **`add_board_and_insert_default_variant`**: Creates board and inserts default variant into target (creates first instance)
- **`remove_board`**: Removes component board and all its variants (all instances become orphaned)
- **`reorder_board`**: Changes the order of component boards (affects board display order only)
- **`set_board_properties`**: Sets properties on a component board (affects all instances of all variants)
- **`reset_board_property`**: Resets a specific board property to default (affects all instances)
- **`set_board_theme`**: Applies a theme to a component board (affects all instances of all variants)

### Variant Management Actions
- **`add_variant`**: Creates a new variant by duplicating the default variant (no instances created yet)
- **`set_node_label`**: Updates a variant's display label (affects all instances of that variant)

### Node Operations Actions
- **`insert_node`**: Inserts a variant or instance into another node (creates new instance if variant inserted)
- **`remove_node`**: Removes a variant or instance from the workspace (removes instance, variant stays)
- **`duplicate_node`**: Creates a copy of a variant or instance (creates new instance with same properties)
- **`move_node`**: Moves an instance to a different parent/position (variants cannot be moved)
- **`reorder_node`**: Changes the order of an instance within its parent (variants cannot be reordered)

### Property Management Actions
- **`set_node_properties`**: Sets multiple properties on a variant or instance (affects all instances if variant)
- **`reset_node_property`**: Resets a specific property to default (removes instance override, inherits from variant)
- **`set_node_theme`**: Applies a theme to a variant or instance (affects all instances if variant)

### Custom Theme Actions
- **40+ theme property setters**: Update specific theme parameters
- **`add_custom_theme_swatch`**: Adds a new color swatch
- **`remove_custom_theme_swatch`**: Removes a color swatch
- **`update_custom_theme_swatch`**: Updates an existing swatch

## System Architecture

The system uses rules-based authorization, node operation propagation, component instantiation, and immutable state management. See the [Middleware README](../../middleware/README.md) for detailed implementation information.

## Return Value

### Available Action Types

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

## Data Processing Rules and Flow

### 1. Middleware Pipeline
The core reducer uses a middleware system for cross-cutting concerns:

```typescript
// Pre-reducer middleware (applied before action processing)
let preReducerMiddlewares = [validationMiddleware, sentryBreadcrumbMiddleware]

// Post-reducer middleware (applied after action processing)
const postReducerMiddlewares = [
  migrationMiddleware,
  workspaceVerificationMiddleware,
]

// Development middleware (only in development)
if (process.env.NODE_ENV === "development") {
  preReducerMiddlewares.push(debugMiddleware)
}
```

### 2. Action Processing Flow
Each action goes through a processing pipeline:

```typescript
// 1. Validation - Ensures action payload is valid
// 2. Sentry Breadcrumb - Logs action for debugging
// 3. Action Processing - Core reducer logic
// 4. Migration - Applies any necessary data migrations
// 5. Verification - Validates workspace integrity
// 6. Debug Logging - (Development only) Logs state changes
```

### 3. Rules-Based Authorization
The system uses a rules-based approach to control what operations are allowed:

```typescript
// Example: Property setting rules
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

### 4. Node Operation Propagation
Many operations support propagation to maintain consistency across variants and instances:

```typescript
// Example: Move operation with propagation
return workspaceService.propagateNodeOperation({
  nodeId: rootVariant.id,
  propagation,
  apply: (node, workspace) => {
    // Find the instance of the subject node within the current operation's node
    const subjectNode = workspaceService.findNodeByPath(
      node,
      subjectNodePath,
      workspace,
    )
    
    // Apply the operation to the found instance
    if (subjectNode && workspaceService.isInstance(subjectNode)) {
      return workspaceService.moveNode(
        subjectNode.id,
        { parentId: targetNode.id, index },
        workspace,
      )
    }
    
    return workspace
  },
  workspace,
})
```

### 5. Component Instantiation System
The system includes a component instantiation system for creating boards:

#### Bottom-Up Creation Strategy
When adding a complex component, the system creates all necessary child components first:

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

#### Overrides Processing
The system handles property overrides defined in component schemas:

### Override Structure
Overrides use **full property structure** with explicit `type` and `value`:

```typescript
// Component schema with overrides
children: [{
  component: ComponentId.ICON,
  overrides: {
    symbol: { 
      type: ValueType.PRESET, 
      value: "material-add" 
    },
    size: { 
      type: ValueType.COMPUTED, 
      value: { 
        function: "AUTO_FIT", 
        input: { basedOn: "#parent.buttonSize", factor: 0.8 } 
      } 
    }
  }
}]
```

### Supported Value Types
- **EXACT**: Simple values (`string`, `number`, `boolean`)
- **PRESET**: Predefined values (icon IDs, display modes, etc.)
- **THEME_ORDINAL**: Theme values with ordinal scale (`@fontSize.large`)
- **THEME_CATEGORICAL**: Theme values with categorical scale (`@swatch.primary`)
- **COMPUTED**: Calculated values with functions and references
- **INHERIT**: Values inherited from parent components
- **EMPTY**: Null/undefined values

### Processing Flow
1. **Schema Definition**: Overrides defined in component schemas
2. **Instantiation**: Applied during component instantiation
3. **Property Merging**: Merged with schema defaults and instance properties
4. **Validation**: Validated against component schema property definitions

#### Nested Overrides Processing
The system handles nested property overrides with support for simplified value syntax:

### Value Type Processing

NestedOverrides uses **simplified value syntax** that gets automatically converted to full property structures:

```typescript
// Input: Simplified values
nestedOverrides: {
  title: {
    content: "Custom Title",     // string
    fontSize: "@fontSize.large", // theme value
    width: 200,                 // number
    visible: true               // boolean
  }
}

// Output: Full property structures
processedProperties: {
  content: { type: ValueType.EXACT, value: "Custom Title" },
  fontSize: { type: ValueType.THEME_ORDINAL, value: "@fontSize.large" },
  width: { type: ValueType.EXACT, value: 200 },
  visible: { type: ValueType.EXACT, value: true }
}
```

### Supported Value Types

- **Simple values**: `string`, `number`, `boolean` → `ValueType.EXACT`
- **Theme values**: `"@fontSize.large"` → Auto-detected type (THEME_ORDINAL, THEME_CATEGORICAL, etc.)
- **Icon IDs**: `"material-add"` → `ValueType.PRESET`
- **Complex values**: `{ unit: "rem", value: 2 }` → `ValueType.EXACT` (preserved as-is)

### Indexed Processing

```typescript
// Process indexed nestedOverrides props by mapping them to the correct child component instances
function processIndexedNestedOverrides(
  nestedOverrides: NestedOverrides,
  childComponentId: string,
  childIndex: number,
  parentComponentId?: string,
): Record<string, any> {
  // Handle patterns like "label2.content", "icon1.size", "tableHeader2.content"
  const indexedPath = parseIndexedPropertyPath(key)
  
  if (indexedPath) {
    // Find the actual child component at the specified index
    const targetIndex = indexedPath.index - 1 // Convert to 0-based
    
    // Apply the override to the correct child instance
    if (targetChild && targetChild.component === childComponentId) {
      processedNestedOverrides[newKey] = value
    }
  }
}
```

### Processing Pipeline

1. **Flattening**: Nested objects converted to dot notation (`title.content` → `"title.content"`)
2. **Type Detection**: Values analyzed and assigned appropriate `ValueType`
3. **Property Validation**: Only properties declared in child schema can be overridden
4. **Override Application**: Valid properties wrapped in `{ type, value }` structure

### Key Differences: Overrides vs NestedOverrides

| Aspect | Overrides | NestedOverrides |
|--------|-----------|-----------------|
| **Syntax** | Full property structure | Simplified value syntax |
| **Definition** | In component schemas | Applied at runtime |
| **Value Types** | All ValueType variants | Limited to basic types + auto-detection |
| **Processing** | During instantiation | During property processing |
| **Use Case** | Schema-level defaults | Runtime customization |

```typescript
// Overrides: Full structure
overrides: {
  symbol: { type: ValueType.PRESET, value: "material-add" }
}

// NestedOverrides: Simplified syntax
nestedOverrides: {
  icon: { symbol: "material-add" }
}
```

### 6. Immutable State Management
All operations use Immer for immutable state updates:

```typescript
return produce(workspace, (draft) => {
  // All modifications are made to the draft
  // Immer ensures immutability
  draft.boards[componentId] = newBoard
  draft.byId[nodeId] = newNode
})
```

## Exit Point and Results

### Return Value
The system returns an updated `Workspace` object with all changes applied:

```typescript
interface Workspace {
  version: number
  boards: Record<ComponentId, Board>
  byId: Record<string, Node>
  customTheme: CustomTheme
}
```

All actions result in structural changes, property updates, and consistency maintenance as described in the action categories above. For detailed error handling and performance information, see the [Middleware README](../../middleware/README.md).
### Key Results

#### 1. Structural Changes
- New component boards created with proper hierarchy
- Variants added, removed, or modified
- Node hierarchies restructured (moved, inserted, duplicated)
- Board ordering updated

#### 2. Property Updates
- Node properties updated with validation
- Board properties modified
- Custom theme properties applied
- Property inheritance maintained

#### 3. Consistency Maintenance
- All instances updated through propagation
- Variant relationships preserved
- Schema compliance maintained
- Workspace integrity verified

### Error Handling
The system handles error conditions gracefully:

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
```

## Key Functions and Behavior

### Core Functions

#### `coreReducer(workspace, action)`
Main entry point that processes core actions through the middleware pipeline.

#### `handleAddBoard(payload, workspace)`
Creates a new component board with all necessary child components and default variants.

#### `handleSetNodeProperties(payload, workspace)`
Sets properties on a node with optional propagation to instances.

#### `handleInsertNode(payload, workspace)`
Inserts a node into another node at a specific position with validation.

#### `handleMoveNode(payload, workspace)`
Moves a node to a new parent and position with propagation to all instances.

#### `handleAddVariant(payload, workspace)`
Creates a new variant by duplicating the default variant.

### Behavior Patterns

The system follows consistent patterns for propagation, instantiation, property management, error recovery, and state consistency. These patterns ensure reliable real-time processing with validation and verification. See the [Middleware README](../../middleware/README.md) for detailed implementation patterns.


## Usage as Source of Truth

This README serves as the documentation for the Core workspace real-time processing system. When making changes:
#### 1. Propagation Strategy
- **Variant Operations**: Changes to variants propagate to all instances
- **Instance Operations**: Changes to instances may propagate to variants
- **Board Operations**: Changes to boards affect all variants and instances

#### 2. Component Instantiation
- **Bottom-Up Creation**: Child components created before parents
- **Registry System**: Maintains references between components during creation
- **Schema Compliance**: All components follow their defined schemas

#### 3. Property Management
- **Validation**: Properties validated against component schemas
- **Inheritance**: Child properties inherit from parent overrides
- **Merging**: New properties merged with existing properties

#### 4. Error Recovery
- **Rule-Based Blocking**: Operations blocked by configuration rules
- **Graceful Degradation**: Invalid operations return unchanged workspace
- **Validation**: Comprehensive validation at multiple levels

#### 5. State Consistency
- **Immutability**: All state changes are immutable
- **Verification**: Workspace integrity verified after each operation
- **Migration**: Automatic data migration when needed

### Advanced Features

#### 1. Indexed Nested Overrides
The system supports property inheritance patterns:

```typescript
// Example: ButtonBar with multiple buttons
// "button1.icon.symbol" -> First button's icon symbol
// "button2.label.content" -> Second button's label content
// "button3.background.color" -> Third button's background color
```

#### 2. Component Registry System
During board creation, a registry maintains component relationships:

```typescript
type NodeRegistry = Partial<Record<ComponentId, NodeRegister>>

type NodeRegister = {
  id: VariantId | InstanceId
  component: ComponentId
  children?: NodeRegister[]
}
```

#### 3. Path-Based Node Finding
The system can find nodes by their hierarchical path:

```typescript
// Find node by path: ["ButtonBar", "Button", "Icon"]
const node = workspaceService.findNodeByPath(
  rootNode,
  ["ButtonBar", "Button", "Icon"],
  workspace
)
```

## Usage as Source of Truth

This README serves as the documentation for the Core workspace system. When making changes:

1. **Update this README first** to reflect the intended behavior
2. **Implement changes** to match the documented behavior  
3. **Update tests** to verify the documented behavior
4. **Validate** that the system behaves as documented

The system is designed to be:
- **Real-Time**: Immediate processing of all workspace actions
- **Predictable**: Behavior should match documentation exactly
- **Robust**: Handle edge cases gracefully without breaking
- **Extensible**: Easy to add new action types and behaviors
- **Debuggable**: Clear error messages and comprehensive logging
- **Performant**: Efficient state updates with minimal re-renders
- **Consistent**: Maintains workspace integrity across all operations

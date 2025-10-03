# Seldon Workspace - LLM Reference

## Quick Start for LLMs

**Core Purpose**: Real-time state management architecture for component-based workspaces with hierarchical structure, variant/instance relationships, and sophisticated middleware processing.

**Key Features**:
- **Hierarchical Structure**: Workspace → Boards → Variants → Instances
- **Real-Time Processing**: Immediate action processing with middleware pipeline
- **Variant/Instance System**: Templates (variants) and actual usage (instances)
- **Rules-Based Authorization**: Controlled operations with propagation rules
- **Middleware Pipeline**: Validation, verification, migration, and debugging
- **Type Safety**: Full TypeScript support with comprehensive validation

## Workspace Structure (CRITICAL)

```
Workspace → Boards → Variants → Instances
```

- **Workspaces**: Top-level containers with multiple component boards
- **Boards**: One per component type, containing variants and instances
- **Variants**: Template definitions for components (default and user-created)
- **Instances**: Actual usage of variants within other components

**Rules**: Instances reference variants, variants define structure, boards organize by component type.

### Hierarchy Enforcement

- **Workspace**: Contains multiple boards (one per component type)
- **Board**: Contains variants and manages component-level properties
- **Variant**: Template definition with properties and children
- **Instance**: Actual usage referencing a variant with potential overrides

## Variant vs Instance System

### Variants (Templates)
```typescript
const buttonVariant = {
  id: "variant-button-primary",
  component: "BUTTON",
  properties: {
    background: { color: "blue" },
    label: { content: "Click me" }
  },
  children: ["instance-icon-123"]
}
```

### Instances (Actual Usage)
```typescript
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

**Key Relationships**:
- Instances reference variants via `instanceOf` property
- Instances can override variant properties
- Changes to variants propagate to all instances
- Instances can have different children than their variants

## Action Categories

### Workspace Management Actions
- **`set_workspace`**: Replace entire workspace (with migration)
- **`set_workspace_version`**: Update workspace version
- **`set_custom_theme`**: Apply custom theme to workspace

### Board Management Actions
- **`add_board`**: Creates new component board with default variant (no instances created yet)
- **`add_board_and_insert_default_variant`**: Creates board and inserts default variant into target (creates first instance)
- **`remove_board`**: Removes component board and all its variants (all instances become orphaned)
- **`reorder_board`**: Changes the order of component boards (affects board display order only)
- **`set_board_properties`**: Sets properties on a component board (affects all instances of all variants)
- **`reset_board_property`**: Resets a specific board property to default (affects all instances)
- **`set_board_theme`**: Applies a theme to a component board (affects all instances of all variants)

### Variant Management Actions
- **`add_variant`**: Creates new variant by duplicating default variant
- **`remove_variant`**: Removes variant (all instances become orphaned)
- **`duplicate_variant`**: Creates copy of existing variant
- **`set_variant_properties`**: Sets properties on a variant (affects all instances)
- **`reset_variant_property`**: Resets variant property to default (affects all instances)
- **`set_variant_theme`**: Applies theme to variant (affects all instances)

### Node Operations Actions
- **`insert_node`**: Inserts node into another node at specific position
- **`move_node`**: Moves node to new parent and position
- **`remove_node`**: Removes node from workspace
- **`duplicate_node`**: Creates copy of existing node
- **`set_node_properties`**: Sets properties on a node
- **`reset_node_property`**: Resets node property to default
- **`set_node_theme`**: Applies theme to node

### Property Management Actions
- **`set_properties`**: Sets multiple properties on a node
- **`reset_properties`**: Resets multiple properties to defaults
- **`set_property`**: Sets single property on a node
- **`reset_property`**: Resets single property to default

### Custom Theme Actions
- **`add_custom_swatch`**: Adds new custom color swatch
- **`remove_custom_swatch`**: Removes custom color swatch
- **`set_custom_swatch`**: Updates custom color swatch
- **`reorder_custom_swatches`**: Changes order of custom swatches

## Middleware Pipeline

### Processing Flow
1. **Validation Middleware**: Validates action payload and workspace constraints
2. **Sentry Breadcrumb Middleware**: Logs actions for debugging
3. **Action Processing**: Core reducer logic with rules-based authorization
4. **Migration Middleware**: Applies data migrations when needed
5. **Verification Middleware**: Validates workspace integrity after processing
6. **Debug Middleware**: (Development only) Logs state changes

### Key Characteristics
- **Real-Time**: Immediate processing of all workspace actions
- **Validated**: Comprehensive validation at multiple pipeline stages
- **Reliable**: Robust error handling and recovery mechanisms
- **Performant**: Minimal overhead with optimized processing
- **Extensible**: Easy to add new middleware following documented patterns

## Rules-Based Authorization

### Propagation Types
- **none**: Operation applies only to target node
- **downstream**: Operation propagates to all instances
- **bidirectional**: Operation propagates in both directions

### Entity Types
- **board**: Component boards containing variants
- **userVariant**: User-created variants
- **defaultVariant**: System-generated default variants
- **instance**: Instances of variants within other components

### Example Usage
```typescript
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

## Component Instantiation System

### Bottom-Up Creation Strategy
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

### Nested Overrides Processing
Handles complex property inheritance patterns:
```typescript
// Example: ButtonBar with multiple buttons
// "button1.icon.symbol" -> First button's icon symbol
// "button2.label.content" -> Second button's label content
// "button3.background.color" -> Third button's background color
```

## Workspace Data Structure

```typescript
interface Workspace {
  version: number
  boards: Record<ComponentId, Board>
  byId: Record<string, Node>
  customTheme: CustomTheme
}

interface Board {
  id: ComponentId
  label: string
  order: number
  theme: string
  properties: Properties
  variants: string[]
}

interface Node {
  id: string
  type: "defaultVariant" | "userVariant" | "instance"
  component: ComponentId
  level: ComponentLevel
  label: string
  isChild: boolean
  fromSchema: boolean
  theme: string | null
  properties: Properties
  children: string[]
  instanceOf?: string // For instances
  variant?: string    // For instances
}
```

## AI-Specific Features

### Reference Mapping System
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

### Schema-Workspace Reconciliation
Intelligent handling of mismatches between AI expectations and workspace state:
1. **Exact Match**: If workspace matches schema → use existing variant
2. **Partial Match**: If existing variant can be used → reuse it
3. **No Match**: If no suitable variant exists → create new custom variant
4. **Schema Mismatch**: If schema doesn't match workspace → create new variant

## LLM Guidelines

### ✅ DO
- Understand variant vs instance relationships before making changes
- Use appropriate action types for the intended operation
- Consider propagation effects when modifying variants
- Validate workspace operations before execution
- Use middleware pipeline for validation and verification
- Handle propagation between variants and instances correctly
- Preserve workspace integrity after all operations

### ❌ DON'T
- Modify variants that have active instances without considering propagation
- Bypass validation middleware in production
- Ignore workspace validation errors
- Create circular references between components
- Skip workspace version migrations
- Use invalid action payloads
- Ignore component hierarchy rules

## Common Patterns

**Proper Workspace Structure**:
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
      variants: ["variant-button-default", "variant-button-custom"]
    }
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
      children: ["child-icon-1", "child-label-1"]
    }
  }
}
```

**Effective Action Usage**:
```typescript
// Board Management
const addBoardAction = {
  type: "add_board",
  payload: { componentId: ComponentId.BUTTON }
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
```

## Integration Points

**Core Dependencies**: `@seldon/core` - Property system, themes, constants

**Key Imports**:
```typescript
import { coreReducer } from './reducers/core/reducer'
import { workspaceService } from './services/workspace.service'
import { themeService } from './services/theme.service'
```

## Quick Reference

**Workspace Structure**: Workspace → Boards → Variants → Instances
**Action Types**: Workspace Management, Board Management, Variant Management, Node Operations, Property Management, Custom Theme Actions
**Middleware Pipeline**: Validation → Sentry → Action Processing → Migration → Verification → Debug
**Propagation Types**: none, downstream, bidirectional
**Entity Types**: board, userVariant, defaultVariant, instance

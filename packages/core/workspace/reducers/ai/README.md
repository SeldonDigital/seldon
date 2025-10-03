# AI Workspace Reducer System

## Overview

The AI Workspace Reducer System processes AI-generated actions to modify workspace structures. It handles schema-workspace reconciliation, reference mapping, and variant creation for AI-driven workspace modifications with enhanced validation and preprocessing capabilities.

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

## Entry Points and Samples

### Main Entry Point
```typescript
import { processAiActions } from './helpers/process-ai-actions'

const updatedWorkspace = processAiActions(workspace, actions)
```

### Sample AI Actions
```typescript
const actions: AIAction[] = [
  {
    type: "ai_add_component",
    payload: {
      componentId: ComponentId.CARD_PRODUCT,
      ref: "$ref1",
    },
  },
  {
    type: "ai_add_variant", 
    payload: {
      componentId: ComponentId.CARD_PRODUCT,
      ref: "$ref2",
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
  {
    type: "ai_remove_node",
    payload: {
      nodeId: "$ref1.1.0.1",
    },
  },
]
```

### Available Action Types

#### Component Management
- `ai_add_component` - Creates a new component board
- `ai_remove_component` - Removes a component board
- `ai_reorder_board` - Reorders component boards

#### Variant Management  
- `ai_add_variant` - Creates a new variant for a component

#### Node Operations
- `ai_insert_node` - Inserts a variant or instance at a specific position (creates new instance if variant inserted)
- `ai_duplicate_node` - Duplicates a variant or instance structure (creates new instance)
- `ai_remove_node` - Removes a variant or instance from the workspace (removes instance, variant stays)
- `ai_move_node` - Moves an instance to a different parent/position (variants cannot be moved)
- `ai_reorder_node` - Changes the order of an instance within its parent (variants cannot be reordered)

#### Property Management
- `ai_set_node_properties` - Sets multiple properties on a variant or instance (affects all instances if variant)
- `ai_reset_node_property` - Resets a specific property to default (removes instance override, inherits from variant)
- `ai_set_node_label` - Updates a variant or instance's display label (affects all instances if variant)
- `ai_set_node_theme` - Applies a theme to a variant or instance (affects all instances if variant)

#### Board Operations
- `ai_set_board_properties` - Sets properties on a component board
- `ai_set_board_theme` - Applies a theme to a component board

#### Custom Theme Management
- `ai_reset_custom_theme` - Resets the custom theme to defaults
- `ai_add_custom_theme_swatch` - Adds a new color swatch
- `ai_remove_custom_theme_swatch` - Removes a color swatch
- `ai_update_custom_theme_swatch` - Updates an existing swatch

#### Custom Theme Property Setters (40+ actions)
- `ai_set_custom_theme_core_ratio` - Sets the core ratio
- `ai_set_custom_theme_core_font_size` - Sets the core font size
- `ai_set_custom_theme_core_size` - Sets the core size
- `ai_set_custom_theme_base_color` - Sets the base color
- `ai_set_custom_theme_harmony` - Sets the color harmony
- `ai_set_custom_theme_color_value` - Sets color system values
- `ai_set_custom_theme_default_icon_color` - Sets default icon color
- `ai_set_custom_theme_default_icon_size` - Sets default icon size
- `ai_set_custom_theme_border_width_value` - Sets border width values
- `ai_set_custom_theme_corners_value` - Sets corner radius values
- `ai_set_custom_theme_font_family_value` - Sets font family values
- `ai_set_custom_theme_font_value` - Sets font parameters
- `ai_set_custom_theme_font_size_value` - Sets font size values
- `ai_set_custom_theme_font_weight_value` - Sets font weight values
- `ai_set_custom_theme_size_value` - Sets size values
- `ai_set_custom_theme_dimension_value` - Sets dimension values
- `ai_set_custom_theme_margin_value` - Sets margin values
- `ai_set_custom_theme_padding_value` - Sets padding values
- `ai_set_custom_theme_gap_value` - Sets gap values
- `ai_set_custom_theme_line_height_value` - Sets line height values
- `ai_set_custom_theme_shadow_value` - Sets shadow parameters
- `ai_set_custom_theme_border_value` - Sets border parameters
- `ai_set_custom_theme_blur_value` - Sets blur values
- `ai_set_custom_theme_spread_value` - Sets spread values
- `ai_set_custom_theme_gradient_value` - Sets gradient parameters
- `ai_set_custom_theme_background_value` - Sets background parameters
- `ai_set_custom_theme_scrollbar_value` - Sets scrollbar parameters

#### Transcript Management
- `ai_transcript_add_message` - Adds messages to the build transcript

## Data Processing Rules and Flow

### 1. Preprocessing Phase
Analyzes build actions to determine required component structures:

```typescript
// Analyzes what component structures are needed
const requiredStructures = analyzeRequiredStructures(actions)

// Creates missing variants if workspace doesn't match desired structure
const { workspace: preprocessedWorkspace, createdVariants } = createMissingVariants(requiredStructures, workspace)
```

### 2. Reference Mapping System
Build actions use reference IDs (e.g., `$ref1.0.1`) to target specific nodes. References can point to both variants and instances:

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

### 3. Schema-Workspace Reconciliation
Handles mismatches between build expectations and workspace state:

#### Reconciliation Logic
1. **Exact Match**: If workspace matches schema → use existing variant
2. **Partial Match**: If existing variant can be used → reuse it
3. **No Match**: If no suitable variant exists → create new custom variant

#### Structure Comparison
```typescript
// Compares component structures for equality
function compareStructures(schema: ComponentStructure, workspace: ComponentStructure | null): boolean {
  // Compares component types, children count, and recursively compares children
}
```

### 4. Action Processing Pipeline
Each action goes through a pipeline. The system handles both variants and instances, with different behaviors for each:

```typescript
// 1. Filter build actions from mixed action list
const buildActions = filterBuildActions(actions)

// 2. Preprocess to handle schema mismatches
const { workspace: preprocessedWorkspace, createdVariants } = preprocessBuildActions(buildActions, workspace)

// 3. Process each action with reference resolution
return buildActions.reduce((workspace, baseAction, index) => {
  // Replace reference IDs with actual IDs
  const action = replaceReferenceId(referenceMap, baseAction)
  
  // Skip ai_add_component actions for components that already exist
  if (action.type === "ai_add_component") {
    const componentId = action.payload.componentId
    if (workspace.boards[componentId]) {
      // Board already exists, skip this action but update reference map
      const variants = workspace.boards[componentId]!.variants
      if (variants.length > 0) {
        const existingVariantId = variants[0]
        const newReferenceMap = getSchemaAwareReferenceMap(
          action.payload.ref,
          existingVariantId,
          workspace,
        )
        referenceMap = { ...referenceMap, ...newReferenceMap }
      }
      return workspace
    }
  }
  
  // Skip actions referencing non-existent nodes
  if (isActionReferencingNonExistentNode(action, workspace)) {
    return workspace
  }
  
  // Apply the action
  let result = buildReducer(workspace, action)
  
  // Update reference map for newly created nodes
  if (actionCreatesNewNode(action)) {
    const addedNodeId = getNodeIdAddedByAction(action, result)
    const ref = getRefFromAction(action)
    if (ref) {
      const newReferenceMap = getSchemaAwareReferenceMap(ref, addedNodeId, result)
      referenceMap = { ...referenceMap, ...newReferenceMap }
    }
  }
  
  return result
}, preprocessedWorkspace)
```

### 5. Middleware Integration
Uses middleware for cross-cutting concerns:

```typescript
// Pre-reducer middleware
let preReducerMiddlewares = [validationMiddleware, sentryBreadcrumbMiddleware]

// Post-reducer middleware  
const postReducerMiddlewares = [migrationMiddleware]

// Development middleware
if (process.env.NODE_ENV === "development") {
  preReducerMiddlewares.push(debugMiddleware)
}

// Create the enhanced reducer with middleware
export const buildReducer = applyMiddleware<BuildAction>(
  reducer,
  ...preReducerMiddlewares,
  // Reverse the order of the post-reducer middlewares so that the verification middleware runs last
  ...postReducerMiddlewares.reverse(),
)
```

## Exit Point and Results

### Return Value
The system returns an updated `Workspace` object with all build actions applied:

```typescript
interface Workspace {
  version: number
  boards: Record<ComponentId, Board>
  byId: Record<string, Node>
  customTheme: CustomTheme
}
```

### Key Results

#### 1. Structural Changes
- New component boards created
- New variants added to existing boards
- Node hierarchies modified (added/removed/reordered)
- Custom variants created when schema doesn't match workspace

#### 2. Property Updates
- Node properties updated according to build instructions
- Theme applications applied
- Custom theme modifications persisted

#### 3. Reference Resolution
- All reference IDs resolved to actual node IDs
- Reference map maintained for subsequent actions
- Invalid references filtered out gracefully

### Error Handling
Handles error conditions:

```typescript
// Skip actions referencing non-existent nodes
if (isActionReferencingNonExistentNode(action, workspace)) {
  return workspace
}

// Skip actions that reference "missing-" nodes (schema-expected but not in workspace)
if (nodeId.startsWith('missing-')) {
  return true
}

// Handle invalid component IDs gracefully
try {
  const schema = getComponentSchema(componentId)
  // ... process normally
} catch (error) {
  console.warn(`Failed to analyze desired structure for component ${componentId}:`, error)
  return fallbackStructure
}
```

## Key Functions and Behavior

### Core Functions

#### `processBuildActions(workspace, actions)`
Main entry point that processes build actions through preprocessing, reference mapping, and action execution.

#### `analyzeRequiredStructures(actions)`
Analyzes build actions to determine required component structures, returning a map of component IDs to their required structures.

#### `createMissingVariants(requiredStructures, workspace)`
Creates custom variants when the workspace doesn't match the desired structure from build actions.

#### `reconcileSchemaWithWorkspace(componentId, workspace)`
Compares component schema with actual workspace structure and determines the reconciliation strategy.

#### `getSchemaAwareReferenceMap(ref, addedNodeId, workspace)`
Generates a reference map that includes expected reference IDs even if some nodes don't exist in the workspace.

### Behavior Patterns

#### 1. Variant Creation Strategy
- **Prefer Existing**: Try to reuse existing variants when possible
- **Create Custom**: Create new variants when no suitable existing variant exists
- **Preserve User Changes**: Respect user modifications to existing variants

#### 2. Reference ID Resolution
- **Hierarchical Mapping**: Reference IDs follow a hierarchical pattern (`$ref.0.1.2`)
- **Schema Awareness**: Reference maps include expected structure for missing nodes
- **Graceful Degradation**: Invalid references are filtered out without errors

#### 3. Property Validation
- **Schema Compliance**: Properties are validated against component schemas
- **Type Safety**: Property values are checked against allowed values
- **Compound Properties**: Properties (fonts, backgrounds) are validated recursively

#### 4. Error Recovery
- **Non-Blocking**: Individual action failures don't stop the entire process
- **Logging**: Errors are logged with context for debugging
- **Fallback Behavior**: Graceful fallbacks for invalid inputs

## Usage as Source of Truth

This README serves as the authoritative documentation for the Build Workspace Reducer System. When making changes to the build reducer functionality:

1. **Update this README first** to reflect the intended build processing behavior and workflow
2. **Implement changes** to match the documented specifications and processing stages
3. **Update build reducer tests** to verify the documented behavior
4. **Validate that the build processing pipeline** follows the documented workflow from preprocessing through reference resolution
5. **Ensure schema-workspace reconciliation** maintains the documented variant creation and reference mapping strategies

The build reducer system is designed to be:
- **Schema-Aware**: Handles mismatches between build expectations and workspace state
- **Reference-Based**: Uses reference IDs for targeting specific nodes in the workspace
- **Reconciliation-Focused**: Creates custom variants when workspace doesn't match desired structure
- **Non-Blocking**: Individual action failures don't stop the entire process
- **Extensible**: Easy to add new build action types and behaviors
- **Predictable**: Build processing behavior should match documentation exactly
- **Robust**: Handle edge cases gracefully without breaking workspace integrity

### Build Reducer Development Workflow

When creating or modifying build reducer functionality:

1. **Define Build Actions**: Document the build action types and their processing requirements
2. **Implement Preprocessing**: Handle schema-workspace reconciliation and variant creation
3. **Update Reference Mapping**: Ensure reference ID resolution works correctly
4. **Test Integration**: Verify build actions work with the core reducer and middleware
5. **Update Documentation**: Keep this README current with build reducer changes

### Build Processing Validation

All build processing must validate against documented specifications:
- **Action Types**: Must follow documented build action type specifications
- **Reference Resolution**: Must implement documented reference ID mapping patterns
- **Schema Reconciliation**: Must follow documented variant creation and reuse strategies
- **Error Handling**: Must implement documented non-blocking error recovery patterns

This ensures consistency across the entire build reducer system and maintains the reliability of build-driven workspace modifications.

For detailed implementation information, see the specific subsystem documentation:
- [Core Reducer README](./core/README.md) - Core workspace processing and action handling
- [Middleware README](../middleware/README.md) - Middleware pipeline and validation
- [Core Workspace README](../README.md) - Workspace state management and structure
- [Core README](../../../README.md) - Core engine and system integration

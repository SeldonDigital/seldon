# Core Workspace System

## Quick Start

### For Engineers
```typescript
import { Workspace, coreReducer, Sdn } from "@seldon/core"

// Create a workspace
const workspace: Workspace = {
  version: 1,
  boards: {},
  byId: {},
  customTheme: customTheme
}

// Add a component board
const updatedWorkspace = coreReducer(workspace, {
  type: "add_board",
  payload: { componentId: Sdn.ComponentId.BUTTON }
})
```

### For Designers
- **Hierarchical Structure**: Workspace → Boards → Variants → Instances
- **Component Management**: Create, modify, and organize design components
- **Property Inheritance**: Changes propagate through the component hierarchy
- **Theme Integration**: Apply themes across entire component systems

## Overview

The Core Workspace System is a state management architecture that provides the foundation for managing component-based workspaces. It consists of multiple interconnected subsystems that handle workspace structure, component boards, variants, nodes, custom themes, and validation and middleware systems.

The system is built around a hierarchical workspace structure where:
- **Workspaces** contain multiple **Boards** (one per component type)
- **Boards** contain multiple **Variants** (default and user-created)
- **Variants** can contain **Instances** (child components)
- **Instances** can contain other **Instances** (nested components)

### Workspace Structure Diagram
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

For detailed information about variants vs instances, see the [Core Reducer README](./reducers/core/README.md#core-concepts).

## Entry Points and Samples

### Main Entry Points

#### 1. Core Workspace Reducer
```typescript
import { coreReducer } from './reducers/core/reducer'

const updatedWorkspace = coreReducer(workspace, action)
```

#### 2. AI Workspace Reducer
```typescript
import { processAiActions } from './reducers/ai/helpers/process-ai-actions'

const updatedWorkspace = processAiActions(workspace, actions)
```

#### 3. Workspace Service
```typescript
import { workspaceService } from './services/workspace.service'

// Direct workspace manipulation
const node = workspaceService.getNode(nodeId, workspace)
const updatedWorkspace = workspaceService.setNodeProperties(nodeId, properties, workspace)
```

#### 4. Theme Service
```typescript
import { themeService } from './services/theme.service'

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
      children: []
    }
  }
}
```

### Sample Actions

#### Core Actions
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
```

#### AI Actions
```typescript
const aiActions = [
  {
    type: "ai_add_component",
    payload: {
      componentId: ComponentId.CARD_PRODUCT,
      ref: "$ref1"
    }
  },
  {
    type: "ai_set_node_properties",
    payload: {
      nodeId: "$ref1.0.1",
      properties: {
        content: { type: ValueType.EXACT, value: "NewTextValue" }
      }
    }
  }
]
```

## Data Processing and Architecture

The workspace system uses a middleware pipeline for processing of all actions. For detailed information about:

- **Middleware Pipeline**: See [Middleware README](./middleware/README.md)
- **Action Processing Flow**: See [Core Reducer README](./reducers/core/README.md#real-time-processing-architecture)
- **Rules-Based Authorization**: See [Middleware README](./middleware/README.md#rules-based-authorization)
- **Component Instantiation**: See [Middleware README](./middleware/README.md#component-instantiation-system)
- **Node Operation Propagation**: See [Middleware README](./middleware/README.md#node-operation-propagation)

### AI-Specific Features

For detailed information about AI workspace processing:

- **Reference Mapping System**: AI actions use reference IDs for targeting specific nodes
- **Schema-Workspace Reconciliation**: Handles mismatches between AI expectations and workspace
- **AI Action Processing**: See [AI Reducer README](./reducers/ai/README.md) for AI action types and processing details

### Schema-Workspace Reconciliation (AI)
Handles mismatches between AI expectations and workspace state. For detailed implementation, see the [AI Reducer README](./reducers/ai/README.md).

### Immutable State Management
All operations use Immer for immutable state updates. For detailed patterns and implementation, see [Middleware README](./middleware/README.md#immutable-state-management).

## Return Value

## Data Processing Rules and Flow

### 1. Middleware Pipeline Architecture
The workspace system uses a middleware pipeline for all operations:

```typescript
// Middleware execution order
const middlewares = [
  validationMiddleware,        // 1. Validate action payload
  sentryBreadcrumbMiddleware,  // 2. Log for debugging
  // ... action processing ...
  migrationMiddleware,         // 3. Apply data migrations
  workspaceVerificationMiddleware // 4. Verify workspace integrity
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

All actions result in structural changes, property updates, and consistency maintenance as described in the action categories. For detailed error handling and performance information, see [Middleware README](./middleware/README.md).

## Key Functions and Behavior

For detailed information about core functions and behavior patterns:

- **Core Functions**: See [Core Reducer README](./reducers/core/README.md#key-functions-and-behavior)
- **Behavior Patterns**: See [Middleware README](./middleware/README.md#behavior-patterns)
- **Service Layer**: Workspace service and theme service provide centralized business logic
- **Helper Functions**: 40+ utility functions for node manipulation, board management, and type checking
- **Advanced Features**: See [Middleware README](./middleware/README.md) for detailed implementation patterns

## System Architecture

### Key Results

#### 1. Structural Changes
- New component boards created with proper hierarchy
- Variants added, removed, or modified
- Node hierarchies restructured (moved, inserted, duplicated)
- Board ordering updated
- Custom variants created when schema doesn't match workspace

#### 2. Property Updates
- Node properties updated with validation
- Board properties modified
- Custom theme properties applied
- Property inheritance maintained
- Theme applications applied

#### 3. Consistency Maintenance
- All instances updated through propagation
- Variant relationships preserved
- Schema compliance maintained
- Workspace integrity verified
- Reference IDs resolved to actual node IDs

#### 4. Error Handling
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

## Key Functions and Behavior

### Core Functions

#### Workspace Service
- `getNode(nodeId, workspace)` - Retrieve a node by ID
- `getBoard(componentId, workspace)` - Retrieve a board by component ID
- `setNodeProperties(nodeId, properties, workspace)` - Set node properties
- `insertNode(nodeId, parentId, index, workspace)` - Insert a node
- `moveNode(nodeId, target, workspace)` - Move a node
- `duplicateNode(nodeId, workspace)` - Duplicate a node
- `propagateNodeOperation(nodeId, propagation, apply, workspace)` - Apply operation with propagation

#### Theme Service
- `getNodeTheme(nodeId, workspace)` - Get theme for a node
- `setNodeTheme(nodeId, themeId, workspace)` - Set theme for a node
- `getObjectTheme(object, workspace)` - Get theme for any object
- `getNextCustomSwatchId(workspace)` - Generate next custom swatch ID

#### Helper Functions
- `findParentNode(nodeId, workspace)` - Find parent of a node
- `getAllVariants(workspace)` - Get all variants in workspace
- `isVariantNode(node)` - Check if node is a variant
- `isInstance(node)` - Check if node is an instance
- `canNodeHaveChildren(node)` - Check if node can have children

### Behavior Patterns

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
- **Validation**: Validation at multiple levels

#### 5. State Consistency
- **Immutability**: All state changes are immutable
- **Verification**: Workspace integrity verified after each operation
- **Migration**: Automatic data migration when needed

#### 6. AI-Specific Behaviors
- **Variant Creation Strategy**: Prefer existing variants, create custom when needed
- **Reference ID Resolution**: Hierarchical mapping with schema awareness
- **Property Validation**: Schema compliance with type safety
- **Error Recovery**: Non-blocking failures with graceful fallbacks

### Advanced Features

#### 1. Indexed Nested Overrides
The system supports complex property inheritance patterns:

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

#### 4. Migration System
Automatic data migration for workspace format changes:

```typescript
// Migration middleware applies necessary transformations
const migrationMiddleware: Middleware = (next) => (workspace, action) => {
  const migratedWorkspace = applyMigrations(workspace)
  return next(migratedWorkspace, action)
}
```

#### 5. Component Level Hierarchy
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
│   ├── sentry.ts
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

## Usage as Source of Truth

This README serves as the authoritative documentation for the Core Workspace System. When making changes:

1. **Update this README first** to reflect the intended behavior
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

For detailed implementation information, see the specific subsystem documentation:
- [Core Reducer README](./reducers/core/README.md) - Action processing and core functionality
- [Middleware README](./middleware/README.md) - Processing pipeline and validation
- [Components README](../../components/README.md) - Component hierarchy and schemas

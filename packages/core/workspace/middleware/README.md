# Workspace Middleware System

## Overview

The Workspace Middleware System provides a pipeline for processing workspace actions with real-time validation, execution, and verification. The middleware ensures consistency, error handling, and debugging capabilities for all workspace operations.

## Middleware Pipeline

The core reducer processes actions through a real-time middleware pipeline that ensures validation, execution, and verification:

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

## Real-Time Action Processing Flow

Each action is processed through a pipeline:

```typescript
// 1. Validation - Real-time validation of action payload and constraints
// 2. Sentry Breadcrumb - Immediate logging for debugging and monitoring
// 3. Action Processing - Core reducer logic with immediate state updates
// 4. Migration - Automatic data migration when workspace version changes
// 5. Verification - Real-time workspace integrity validation
// 6. Debug Logging - (Development only) Immediate state change logging
```

## Processing Characteristics

- **Immediate Processing**: Actions are processed synchronously as they occur
- **Real-Time Validation**: Each action is validated before execution
- **Immediate Verification**: Workspace integrity is verified after each action
- **Fail-Fast**: Invalid actions are rejected with detailed error messages
- **Consistency Guarantees**: All state changes maintain workspace consistency

## Middleware Components

### 1. Validation Middleware (`validation.ts`)

**Purpose**: Validates action payloads and constraints before execution.

**Key Features**:
- **Immediate Validation**: Actions validated before execution
- **Constraint Checking**: Parent-child relationships, component compatibility
- **Usage Validation**: Prevents removal of nodes/variants in use
- **Schema Compliance**: Property validation against component schemas

**Validation Rules**:
- Node existence and accessibility
- Parent-child relationship constraints
- Component compatibility checks
- Variant usage validation
- Board existence and state validation

### 2. Sentry Breadcrumb Middleware (`sentry.ts`)

**Purpose**: Provides logging for debugging and monitoring.

**Key Features**:
- **Action Logging**: Logs every action with payload details
- **Debug Support**: Logging in development mode
- **Error Tracking**: Integrates with Sentry for error monitoring
- **Performance Monitoring**: Tracks action processing times

### 3. Debug Middleware (`debug.ts`)

**Purpose**: Development-only middleware for debugging and state inspection.

**Key Features**:
- **Redux DevTools Integration**: Connects to browser DevTools
- **State Inspection**: State change visualization
- **Action Tracking**: Complete action history and state transitions
- **Development Only**: Automatically disabled in production

### 4. Migration Middleware (`migration/middleware.ts`)

**Purpose**: Handles automatic data migration when workspace versions change.

**Key Features**:
- **Version Management**: Tracks and updates workspace versions
- **Automatic Migration**: Applies migrations in sequence
- **Rollback Safety**: Maintains data integrity during migration
- **Selective Application**: Only runs on `set_workspace` actions for performance

**Migration Process**:
1. Check current workspace version
2. Apply migrations in sequence if needed
3. Update workspace version
4. Verify migration success

### 5. Workspace Verification Middleware (`verification.ts`)

**Purpose**: Validates workspace integrity after each action.

**Key Features**:
- **Comprehensive Validation**: Checks workspace relationships
- **Consistency Verification**: Ensures no dangling references
- **Schema Compliance**: Validates all components follow schemas
- **Error Recovery**: Provides detailed error messages for failures

**Verification Checks**:
- All children exist and are accessible
- All variants exist and are properly referenced
- All instances have valid variant references
- Unique IDs across all nodes
- No dangling variants or child nodes
- Proper board ordering and structure
- Single default variant per board

## Rules-Based Authorization

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

### Authorization Rules
- **Operation Blocking**: Prevents invalid operations based on configuration rules
- **Entity Type Validation**: Ensures operation compatibility with entity types
- **Propagation Control**: Determines how changes propagate through the system
- **Permission Checking**: Validates user permissions for specific operations

## Node Operation Propagation

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

### Propagation Strategy
- **Variant Operations**: Changes to variants propagate to all instances
- **Instance Operations**: Changes to instances may propagate to variants
- **Board Operations**: Changes to boards affect all variants and instances
- **Selective Propagation**: Only applies to operations that support it

## Component Instantiation System

The system includes a component instantiation system for creating boards:

### Bottom-Up Creation Strategy
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

### Nested Overrides Processing
The system handles nested property overrides:

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

### Instantiation Patterns
- **Bottom-Up Creation**: Child components created before parents
- **Registry System**: Maintains references between components during creation
- **Schema Compliance**: All components follow their defined schemas
- **Indexed Overrides**: Handles property inheritance patterns

## Immutable State Management

All operations use Immer for immutable state updates:

```typescript
return produce(workspace, (draft) => {
  // All modifications are made to the draft
  // Immer ensures immutability
  draft.boards[componentId] = newBoard
  draft.byId[nodeId] = newNode
})
```

### State Management Patterns
- **Structural Sharing**: Immer reduces memory overhead for large workspaces
- **Reference Integrity**: Maintains object references to prevent memory leaks
- **Garbage Collection**: Automatic cleanup of removed nodes and variants
- **Immutability Guarantees**: All state changes are immutable

## Behavior Patterns

The system follows consistent patterns for real-time processing:

### Propagation Strategy
- **Variant Operations**: Changes to variants propagate to all instances
- **Instance Operations**: Changes to instances may propagate to variants
- **Board Operations**: Changes to boards affect all variants and instances

### Component Instantiation
- **Bottom-Up Creation**: Child components created before parents
- **Registry System**: Maintains references between components during creation
- **Schema Compliance**: All components follow their defined schemas

### Property Management
- **Validation**: Properties validated against component schemas
- **Inheritance**: Child properties inherit from parent overrides
- **Merging**: New properties merged with existing properties

### Error Recovery
- **Rule-Based Blocking**: Operations blocked by configuration rules
- **Graceful Degradation**: Invalid operations return unchanged workspace
- **Validation**: Validation at multiple levels

### State Consistency
- **Immutability**: All state changes are immutable
- **Verification**: Workspace integrity verified after each operation
- **Migration**: Automatic data migration when needed

## Real-Time Error Handling and Recovery

### Pre-Execution Validation
```typescript
// Rule-based operation blocking - prevents invalid operations
if (!rules.mutations.create.board.allowed) {
  return workspace // Graceful degradation
}

// Entity type validation - ensures operation compatibility
const { allowed, propagation } = rules.mutations.setProperties[entityType]
if (!allowed) {
  return workspace // Operation blocked, workspace unchanged
}

// Node existence validation - prevents null reference errors
const node = workspaceService.getNode(payload.nodeId, workspace)
if (!node) {
  throw new WorkspaceValidationError(`Node ${payload.nodeId} not found`, action)
}
```

### Error Types and Handling
- **`WorkspaceValidationError`**: Validation failures with action context
- **Graceful Degradation**: Invalid operations return unchanged workspace
- **Fail-Fast**: Error detection and reporting
- **Debug Support**: Logging in development mode

## Performance Considerations

### Processing Optimization
- **Synchronous Processing**: All actions processed for consistent state
- **Middleware Efficiency**: Minimal overhead validation and verification
- **Immutable Updates**: Immer-based state updates with structural sharing
- **Selective Migration**: Migrations only applied to `set_workspace` actions

### Memory Management
- **Structural Sharing**: Immer reduces memory overhead for large workspaces
- **Reference Integrity**: Maintains object references to prevent memory leaks
- **Garbage Collection**: Automatic cleanup of removed nodes and variants

### Real-Time Constraints
- **Immediate Response**: Actions must complete within UI frame budget
- **Consistency Guarantees**: All state changes maintain workspace integrity
- **Error Propagation**: Validation errors must be handled immediately
- **State Synchronization**: Multiple clients must see consistent state

## Usage

The middleware system is automatically applied to the core reducer:

```typescript
import { coreReducer } from './reducer'

// Middleware is automatically applied
const updatedWorkspace = coreReducer(workspace, action)
```

## Development and Debugging

### Development Mode Features
- **Debug Middleware**: Redux DevTools integration
- **Verbose Logging**: Action and state change logging
- **Error Details**: Error messages and stack traces

### Production Mode Features
- **Minimal Logging**: Only essential error logging
- **Performance Optimized**: Reduced overhead for production use
- **Error Monitoring**: Sentry integration for error tracking

## Extending the Middleware

To add new middleware:

1. **Create Middleware Function**: Implement the middleware pattern
2. **Add to Pipeline**: Include in pre-reducer or post-reducer arrays
3. **Test Thoroughly**: Ensure it doesn't break existing functionality
4. **Document Behavior**: Update this README with new middleware details

```typescript
// Example middleware
export const customMiddleware: Middleware = (next) => (workspace, action) => {
  // Pre-processing logic
  const result = next(workspace, action)
  // Post-processing logic
  return result
}
```

## Usage as Source of Truth

This README serves as the documentation for the Workspace Middleware System. When making changes to middleware:

1. **Update this README first** to reflect the intended middleware behavior and processing flow
2. **Implement middleware functions** to match the documented specifications
3. **Update middleware tests** to verify the documented behavior
4. **Validate pipeline integration** to ensure middleware works correctly in the processing pipeline
5. **Update error handling** to maintain documented error recovery patterns
6. **Test performance impact** to ensure middleware doesn't degrade system performance

The middleware system is designed to be:
- **Real-Time**: Immediate processing of all workspace actions
- **Validated**: Validation at multiple pipeline stages
- **Reliable**: Robust error handling and recovery mechanisms
- **Performant**: Minimal overhead with optimized processing
- **Extensible**: Easy to add new middleware following documented patterns
- **Debuggable**: Logging and monitoring capabilities
- **Consistent**: Maintains workspace integrity across all operations

### Middleware Development Workflow

When creating or modifying middleware:

1. **Define Purpose**: Document the middleware's role in the processing pipeline
2. **Implement Pattern**: Follow the documented middleware pattern structure
3. **Add Validation**: Include proper validation and error handling
4. **Test Integration**: Verify middleware works correctly in the pipeline
5. **Update Documentation**: Keep this README current with middleware changes
6. **Monitor Performance**: Ensure middleware doesn't impact system performance

### Middleware Validation

All middleware must validate against documented patterns:
- **Pipeline Integration**: Must work correctly in pre-reducer or post-reducer positions
- **Error Handling**: Must implement proper error handling and recovery
- **Performance**: Must not significantly impact processing performance
- **Logging**: Must provide appropriate logging for debugging and monitoring

### Pipeline Integrity

The middleware pipeline must maintain:
- **Processing Order**: Middleware must execute in the documented order
- **State Consistency**: All middleware must preserve workspace integrity
- **Error Propagation**: Errors must be handled appropriately at each stage
- **Performance**: Pipeline must complete within real-time constraints

This ensures the middleware system remains reliable, performant, and maintainable while providing comprehensive processing capabilities for the workspace system.

## Related Documentation

- [Core Reducer README](../reducers/core/README.md) - Main reducer documentation
- [Migration README](./migration/README.md) - Detailed migration system documentation
- [Workspace Service Documentation](../services/workspace.service.md) - Workspace service utilities

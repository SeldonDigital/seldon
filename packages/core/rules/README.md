# Rules Configuration System

## Quick Start

### For Engineers
```typescript
import { rules } from "@seldon/core/rules"

// Check if an operation is allowed
const { allowed, propagation } = rules.mutations.setProperties[entityType]
if (allowed) {
  // Perform the operation with specified propagation
}

// Check component hierarchy constraints
const allowedChildren = rules.componentLevels[parentLevel].mayContain
const canContain = allowedChildren.includes(childLevel)
```

### For Designers
- **Operation Control**: Rules determine what actions are allowed on different component types
- **Hierarchy Enforcement**: Components can only contain appropriate child components
- **Change Propagation**: Rules control how changes flow through the component hierarchy
- **Consistency Maintenance**: Ensures workspace integrity and prevents invalid states

## Overview

The Rules Configuration System is a declarative configuration layer that defines the behavior and constraints for workspace operations. It controls what operations are allowed, how changes propagate through the workspace hierarchy, and what component types can contain other component types. This system ensures consistency, prevents invalid operations, and maintains workspace integrity.

## Entry Points and Samples

### Main Entry Point
```typescript
import { rules } from './config/rules.config'

// Check if an operation is allowed
const { allowed, propagation } = rules.mutations.setProperties[entityType]
if (allowed) {
  // Perform the operation
}

// Check component hierarchy constraints
const allowedChildren = rules.componentLevels[parentLevel].mayContain
const canContain = allowedChildren.includes(childLevel)
```

### Sample Rule Usage
```typescript
// Example: Property setting with propagation
const node = workspaceService.getNode(nodeId, workspace)
const entityType = workspaceService.getEntityType(node)
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

// Example: Component hierarchy validation
const parentLevel = getComponentSchema(parentId).level
const childLevel = getComponentSchema(childId).level
const allowedChildren = rules.componentLevels[parentLevel].mayContain
const canBeParent = allowedChildren.includes(childLevel)
```

### Available Rule Categories

#### 1. Component Level Hierarchy Rules
Controls which component levels can contain other component levels:

```typescript
componentLevels: {
  [ComponentLevel.PRIMITIVE]: {
    mayContain: [], // Primitives cannot have children
  },
  [ComponentLevel.FRAME]: {
    mayContain: [
      ComponentLevel.PRIMITIVE,
      ComponentLevel.ELEMENT,
      ComponentLevel.PART,
      ComponentLevel.MODULE,
      ComponentLevel.FRAME,
    ],
  },
  [ComponentLevel.ELEMENT]: {
    mayContain: [
      ComponentLevel.PRIMITIVE,
      ComponentLevel.ELEMENT,
      ComponentLevel.FRAME,
    ],
  },
  [ComponentLevel.PART]: {
    mayContain: [
      ComponentLevel.PRIMITIVE,
      ComponentLevel.ELEMENT,
      ComponentLevel.PART,
      ComponentLevel.FRAME,
    ],
  },
  [ComponentLevel.MODULE]: {
    mayContain: [
      ComponentLevel.PRIMITIVE,
      ComponentLevel.ELEMENT,
      ComponentLevel.PART,
      ComponentLevel.MODULE,
      ComponentLevel.FRAME,
    ],
  },
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
}
```

#### 2. Mutation Rules
Controls what operations are allowed on different entity types:

##### Create Operations
```typescript
create: {
  board: { allowed: true, propagation: "none" },
  userVariant: { allowed: true, propagation: "none" },
  defaultVariant: { allowed: false, propagation: "none" },
  instance: { allowed: true, propagation: "downstream" },
}
```

##### Insert Operations
```typescript
insertInto: {
  board: { allowed: false, propagation: "none" },
  userVariant: { allowed: true, propagation: "downstream" },
  defaultVariant: { allowed: true, propagation: "downstream" },
  instance: { allowed: true, propagation: "downstream" },
}
```

##### Instantiate Operations
```typescript
instantiate: {
  board: { allowed: false, propagation: "none" },
  userVariant: { allowed: true, propagation: "downstream" },
  defaultVariant: { allowed: true, propagation: "downstream" },
  instance: { allowed: true, propagation: "downstream" },
}
```

##### Duplicate Operations
```typescript
duplicate: {
  board: { allowed: false, propagation: "none" },
  userVariant: { allowed: true, propagation: "none" },
  defaultVariant: { allowed: true, propagation: "none" },
  instance: { allowed: true, propagation: "downstream" },
}
```

##### Delete Operations
```typescript
delete: {
  board: { 
    allowed: true, 
    propagation: "downstream",
    removalBehavior: "delete"
  },
  userVariant: { 
    allowed: true, 
    propagation: "downstream",
    removalBehavior: "delete"
  },
  defaultVariant: { 
    allowed: false, 
    propagation: "downstream",
    removalBehavior: "delete"
  },
  instance: { 
    allowed: true, 
    propagation: "downstream",
    removalBehavior: {
      schemaDefined: "hide",    // Auto-generated from parent component schema
      manuallyAdded: "delete",  // User manually added this instance
    }
  },
}
```

##### Property Setting Operations
```typescript
setProperties: {
  board: { allowed: true, propagation: "none" },
  userVariant: { allowed: true, propagation: "none" },
  defaultVariant: { allowed: true, propagation: "none" },
  instance: { allowed: true, propagation: "none" },
}
```

##### Theme Setting Operations
```typescript
setTheme: {
  board: { allowed: true, propagation: "downstream" },
  userVariant: { allowed: true, propagation: "downstream" },
  defaultVariant: { allowed: true, propagation: "downstream" },
  instance: { allowed: true, propagation: "downstream" },
}
```

##### Rename Operations
```typescript
rename: {
  board: { allowed: false, propagation: "none" },
  userVariant: { allowed: true, propagation: "downstream" },
  defaultVariant: { allowed: false, propagation: "downstream" },
  instance: { allowed: false, propagation: "downstream" },
}
```

##### Reorder Operations
```typescript
reorder: {
  board: { allowed: true, propagation: "none" },
  userVariant: { allowed: true, propagation: "none" },
  defaultVariant: { allowed: false, propagation: "none" },
  instance: { allowed: true, propagation: "downstream" },
}
```

##### Move Operations
```typescript
move: {
  board: { allowed: false, propagation: "none" },
  userVariant: { allowed: false, propagation: "none" },
  defaultVariant: { allowed: false, propagation: "none" },
  instance: { allowed: true, propagation: "downstream" },
}
```

## Data Processing Rules and Flow

### 1. Rule Evaluation Flow
The rules system follows an evaluation process:

```typescript
// 1. Determine entity type
const entityType = workspaceService.getEntityType(node)

// 2. Get rule configuration
const { allowed, propagation } = rules.mutations[operationType][entityType]

// 3. Check if operation is allowed
if (!allowed) {
  return workspace // Operation blocked
}

// 4. Apply operation with propagation
return workspaceService.propagateNodeOperation({
  nodeId,
  propagation,
  apply: (node, workspace) => {
    // Perform the actual operation
  },
  workspace,
})
```

### 2. Propagation Types
The system supports three types of propagation:

#### None Propagation
```typescript
case "none":
  // Operation applies only to the target node
  // No changes propagate to other nodes
  return this._applyWithoutPropagation(node, workspace, apply)
```

#### Downstream Propagation
```typescript
case "downstream":
  // Operation applies to the target node and all its instances
  // Changes flow from variants to their instances
  return this._applyWithDownstreamPropagation(node, workspace, apply)
```

#### Bidirectional Propagation
```typescript
case "bidirectional":
  // Operation applies to the target node and all related nodes
  // Changes flow both up and down the hierarchy
  return this._applyWithBidirectionalPropagation(node, workspace, apply)
```

### 3. Component Level Validation
The system enforces component hierarchy constraints:

```typescript
public canComponentBeParentOf(parentId: ComponentId, childId: ComponentId): boolean {
  const parentLevel = getComponentSchema(parentId).level
  const childLevel = getComponentSchema(childId).level
  
  // Get the allowed children for the parent level
  const allowedChildren = rules.componentLevels[parentLevel].mayContain
  
  // Check if the child level is in the allowed children list
  return allowedChildren.includes(childLevel)
}
```

### 4. Entity Type Classification
The system classifies entities into four types:

- **board**: Component boards that contain variants
- **userVariant**: User-created variants
- **defaultVariant**: System-generated default variants
- **instance**: Instances of variants within other components

### 5. Removal Behavior Logic
For delete operations, the system supports removal behaviors:

```typescript
// Simple removal behavior
removalBehavior: "delete" | "hide"

// Conditional removal behavior based on how the instance was created
removalBehavior: {
  schemaDefined: "delete" | "hide",  // Auto-generated from schema
  manuallyAdded: "delete" | "hide",  // User manually added
}
```

### 6. Rule Application Patterns
The system uses patterns for applying rules:

#### Operation Blocking
```typescript
// Block operations that aren't allowed
if (!rules.mutations.create.board.allowed) {
  return workspace
}
```

#### Conditional Execution
```typescript
// Execute operations only if allowed
const { allowed, propagation } = rules.mutations.setProperties[entityType]
if (allowed) {
  return workspaceService.propagateNodeOperation({
    nodeId: payload.nodeId,
    propagation,
    apply: (node, workspace) => {
      // Perform operation
    },
    workspace,
  })
}
```

#### Propagation Control
```typescript
// Control how changes propagate
const { propagation } = rules.mutations.duplicate[entityType]
return workspaceService.propagateNodeOperation({
  nodeId: payload.nodeId,
  propagation,
  apply: (node, workspace) => {
    // Perform operation
  },
  workspace,
})
```

## Exit Point and Results

### Return Values
The rules system doesn't directly return values but controls the behavior of workspace operations:

#### Operation Results
- **Allowed Operations**: Return updated workspace with changes applied
- **Blocked Operations**: Return unchanged workspace
- **Propagated Operations**: Return workspace with changes applied to multiple nodes

#### Validation Results
- **Valid Hierarchies**: Allow component relationships
- **Invalid Hierarchies**: Block component relationships
- **Constraint Violations**: Prevent invalid operations

### Key Results

#### 1. Operation Control
- Operations are allowed or blocked based on entity type and operation type
- Invalid operations return unchanged workspace
- Valid operations proceed with appropriate propagation

#### 2. Hierarchy Enforcement
- Component relationships are validated against level constraints
- Invalid parent-child relationships are prevented
- Workspace structure remains consistent

#### 3. Change Propagation
- Changes propagate according to configured rules
- Variant changes flow to instances when configured
- Instance changes may flow to variants in bidirectional mode

#### 4. Consistency Maintenance
- Workspace integrity is maintained through rule enforcement
- Invalid states are prevented before they occur
- System behavior is predictable and consistent

### Error Handling
The rules system handles various scenarios:

```typescript
// Invalid propagation type
default:
  throw new Error(`Invalid propagation: ${propagation}`)

// Missing rule configuration
const config = rules.mutations.delete[entityType]
if (!config) {
  throw new Error(`No delete rules configured for entity type: ${entityType}`)
}

// Invalid entity type
const entityType = workspaceService.getEntityType(node)
if (!rules.mutations.setProperties[entityType]) {
  throw new Error(`No property rules configured for entity type: ${entityType}`)
}
```

## Key Functions and Behavior

### Core Functions

#### `rules.mutations[operationType][entityType]`
Returns the rule configuration for a specific operation and entity type.

#### `rules.componentLevels[level].mayContain`
Returns the list of component levels that can be contained by the specified level.

#### `workspaceService.propagateNodeOperation()`
Applies an operation with the specified propagation behavior.

#### `workspaceService.canComponentBeParentOf()`
Validates whether one component can be a parent of another based on level rules.

### Behavior Patterns

#### 1. Rule-Based Authorization
- **Entity-Specific Rules**: Different rules for different entity types
- **Operation-Specific Rules**: Different rules for different operations
- **Conditional Logic**: Rules can have complex conditional behaviors

#### 2. Propagation Control
- **None**: Changes apply only to the target node
- **Downstream**: Changes flow from variants to instances
- **Bidirectional**: Changes flow in both directions

#### 3. Hierarchy Enforcement
- **Level-Based Constraints**: Component levels define what they can contain
- **Validation**: All parent-child relationships are validated
- **Prevention**: Invalid relationships are blocked before creation

#### 4. Removal Behavior
- **Delete**: Remove the entity completely
- **Hide**: Hide the entity but keep it in the workspace
- **Conditional**: Different behavior based on how the entity was created

#### 5. Consistency Maintenance
- **Predictable Behavior**: Rules ensure consistent system behavior
- **State Validation**: Workspace state remains valid
- **Error Prevention**: Invalid operations are prevented

### Advanced Features

#### 1. Conditional Removal Behavior
The system supports removal behaviors based on how an instance was created:

```typescript
removalBehavior: {
  schemaDefined: "hide",    // Auto-generated instances are hidden
  manuallyAdded: "delete",  // User-added instances are deleted
}
```

#### 2. Propagation Strategies
Operations use propagation strategies:

- **Property Changes**: Usually "none" - properties are overrides
- **Theme Changes**: Usually "downstream" - themes affect instances
- **Structural Changes**: Usually "downstream" - structure changes propagate

#### 3. Entity Type Hierarchy
The system maintains a clear hierarchy of entity types:

```
Board
├── UserVariant (user-created)
├── DefaultVariant (system-generated)
└── Instance (instantiated from variants)
```

#### 4. Component Level Hierarchy
Components are organized in a hierarchy:

```
Screen (can contain everything)
├── Module (can contain modules, parts, elements, primitives, frames)
├── Part (can contain parts, elements, primitives, frames)
├── Element (can contain elements, primitives, frames)
├── Frame (can contain frames, modules, parts, elements, primitives)
└── Primitive (cannot contain anything)
```

## Usage as Source of Truth

This README serves as the documentation for the Rules configuration system. When making changes:

1. **Update this README first** to reflect the intended behavior
2. **Update the rule configuration** to match the documented behavior
3. **Update type definitions** to ensure type safety
4. **Update tests** to verify the documented behavior
5. **Validate** that the system behaves as documented

The system is designed to be:
- **Declarative**: Rules are defined and easy to understand
- **Consistent**: Same rules apply consistently across the system
- **Extensible**: Easy to add new rules and modify existing ones
- **Type-Safe**: All rules are strongly typed
- **Testable**: Rules can be tested and validated
- **Maintainable**: Clear separation between rules and implementation



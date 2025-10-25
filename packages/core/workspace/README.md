# Seldon Workspace

The Workspace is the state management architecture that serves as the foundation for managing component-based design systems. It provides a hierarchical structure for organizing components, managing their properties, and maintaining consistency across the entire design system.

## What is a Workspace?

A workspace is a state container that organizes and manages all components in a design system. Think of it as the central database that tracks every component, its properties, relationships, and how they all fit together. The workspace maintains the complete state of your design system, from individual component properties to the overall structure and organization.

The workspace serves different purposes for different users:

**For Designers**: The workspace is a tool for organizing, customizing, and building component libraries. It allows you to create variants of components, customize their properties, apply themes, and organize everything into a coherent design system.

**For Engineers**: The workspace functions as a state management system with hierarchical architecture. It tracks component relationships, manages property inheritance, handles theme application, and maintains data integrity throughout the system.

## Workspace Architecture

The workspace organizes components into a four-level hierarchy:

### Hierarchy

**Projects** (workspace in code) contain **Boards** (one per component). Each **Board** can contain multiple **Variants** (default and user-created). **Variants** can be used directly as components in exported code or serve as templates to create **Instances** (optional uses of variants for design system flexibility), and **Instances** can contain other **Instances** (nested components).

This hierarchy creates a natural organization where:
- Each component type gets its own board, where a default variant is always present
- Variants can be used directly as components in production code, or serve as customizable templates for Instances
- Instances provide optional flexibility for design system creation when needed
- The system maintains relationships between all these entities

### Component Relationships

The workspace manages several key relationships:

**Variant-Instance Relationships**: Variants can be used directly as components in exported code or serve as templates for creating instances. Instances are optional uses of variants that provide flexibility for design system creation. Each instance references a specific variant via the `instanceOf` property. When you modify a variant, those changes can propagate to all its instances, ensuring consistency across the design system.

**Parent-Child Relationships**: Components can contain other components, creating hierarchical structures. The workspace maintains these relationships and ensures they follow the component hierarchy rules (Screens can contain Modules, Modules can contain Parts, etc.).

**Property Inheritance**: Properties flow from parent components to children, and from variants to their instances. This inheritance system allows you to set properties at the appropriate level and have them cascade down through the hierarchy.

**Theme Integration**: Themes are applied and inherited through the component hierarchy. When you switch themes, the system applies the new theme to variants first, then instances inherit those changes unless they have specific overrides. This ensures that theme changes propagate correctly through the design system.

## Core Concepts

### Boards

Boards are organizational containers that group all variants of a specific component type. Each component type (Button, Card, Header, etc.) gets exactly one board in the workspace. Boards serve as the top-level organization for components and contain metadata about the component type, its default theme, and any board-level properties.

### Variants

Variants are component definitions that can be used directly in exported code or serve as templates for creating instances. There are two types of variants:

**Default Variants**: Created automatically from component schemas when a board is first created. These represent the "canonical" version of a component as defined by its schema and can be used directly as components.

**Custom Variants**: Created by users when they need a component to behave differently from the default. Custom variants allow for component customization while preserving the original design and can also be used directly as components.

### Instances

Instances are optional uses of variants that provide flexibility for design system creation. When a Button variant is used inside a Card component, that usage becomes an instance. Each instance references a specific variant via the `instanceOf` property and inherits properties from that variant, but can have their own overrides for specific cases. Instances are not always needed - variants can be used directly as components in exported code.

### Property Precedence

The workspace follows a strict precedence order for properties:

1. **Instance overrides** always take precedence over variant properties
2. **Variant properties** take precedence over schema defaults
3. **Schema defaults** are used when no other values are set

This precedence system is crucial for theme switching and property inheritance. When you switch themes, the system applies the new theme to variants first, then instances inherit those changes unless they have specific overrides.

## System Components

The workspace system consists of several interconnected subsystems that work together to manage the design system state:

### Reducers

Reducers are the core processing engines that handle all workspace operations. There are two main reducer systems:

**Core Reducer**: Handles direct user interactions and programmatic modifications. This includes operations like adding boards, setting properties, moving components, and managing the workspace structure.

**AI Reducer**: Processes AI-generated actions and complex transformations. This system handles operations that come from AI systems, including reference-based targeting and schema-workspace reconciliation.

### Services

Services provide centralized business logic for workspace operations:

**Workspace Service**: The main service that handles all workspace manipulation operations. It provides functions for getting nodes, setting properties, moving components, and managing the workspace structure.

**Theme Service**: Manages theme application and inheritance throughout the workspace. It handles theme switching, theme inheritance, and ensures themes are applied consistently across the component hierarchy.

### Middleware

The middleware system provides cross-cutting concerns and data integrity:

**Validation Middleware**: Validates actions before processing to ensure they're safe and valid. This includes checking node existence, validating parent-child relationships, and ensuring operations comply with component hierarchy rules.

**Verification Middleware**: Validates workspace integrity after processing to ensure the workspace remains consistent. This includes checking that all references are valid, no duplicate IDs exist, and the workspace structure is coherent.

**Migration Middleware**: Handles data migration between workspace versions, ensuring that older workspaces can be upgraded to newer formats.

**Debug Middleware**: Provides development debugging and logging for troubleshooting workspace operations.

### Rules System

The rules system controls what operations are allowed and how they propagate through the workspace:

**Operation Authorization**: Determines which operations are allowed for different entity types (boards, variants, instances).

**Propagation Control**: Controls how operations propagate through the component hierarchy. Some operations affect only the target node, while others propagate to all instances or in both directions.

**Entity Type Management**: Different rules apply to different entity types, ensuring that operations are appropriate for the type of entity being modified.

## Component Instantiation

The workspace includes a component instantiation workflow that creates component hierarchies from schemas:

### Bottom-Up Creation

When creating complex components, the system creates all necessary child components first, then builds the parent components. This ensures that parent components have access to their children's variant IDs and can establish proper relationships.

### Registry System

During component creation, a registry maintains references between components, ensuring that all relationships are properly established and that the component hierarchy is coherent.

### Overrides System

The workspace supports two types of overrides that work at different stages of the component lifecycle:

**Regular Overrides**: These can be set on variants or instances at any time. They use full property structures with explicit type and value definitions, and they follow the standard property precedence system where instance overrides take precedence over variant properties.

**Nested Overrides**: These are processed during component instantiation, not during general property management. When a component is instantiated from a schema, any nested overrides defined in the schema are applied to child components at that moment. This system allows parent components to establish default styling for their children during the instantiation process.

Nested overrides use simplified value syntax that gets automatically converted to full property structures, and they support indexed references for targeting specific child components (e.g., "button1.icon.symbol" for the first button's icon symbol). They are processed once during instantiation and then become part of the component's properties, following the normal property precedence system from that point forward.

### Schema Compliance

All components follow their defined schemas, ensuring that the workspace maintains consistency with the component system's rules and constraints.

## AI Integration

The workspace system includes specialized support for AI-generated operations:

### Reference Mapping

AI actions use reference IDs for targeting specific nodes in the workspace. This system allows AI systems to work with components without needing to know the actual node IDs.

### Schema-Workspace Reconciliation

When AI systems expect certain component structures that don't exist in the workspace, the system can create missing variants or reconcile differences between AI expectations and workspace state.

### Custom Variant Creation

When AI systems need components that don't exist in the workspace, the system can create custom variants that match the AI's requirements while maintaining workspace integrity.

## Data Integrity

The workspace system maintains data integrity through multiple layers of validation and verification:

### Validation

All operations are validated before processing to ensure they're safe and valid. This includes checking node existence, validating relationships, and ensuring operations comply with system rules.

### Verification

After each operation, the workspace is verified to ensure it remains consistent and valid. This includes checking that all references are valid, no duplicate IDs exist, and the workspace structure is coherent.

### Error Handling

The system handles various error conditions gracefully, including missing nodes, invalid operations, and constraint violations. Operations that would break workspace integrity are blocked, and the system provides clear error messages for troubleshooting.

## State Management

The workspace uses immutable state management to ensure predictable behavior and enable features like undo/redo:

### Immutable Updates

All workspace operations use immutable state updates, ensuring that the original workspace is never modified and that changes are predictable and reversible.

### Middleware Pipeline

All operations flow through a middleware pipeline that handles validation, logging, migration, and verification. This pipeline ensures that all operations are processed consistently and that the workspace remains in a valid state.

### Propagation

Many operations support propagation through the component hierarchy, ensuring that changes affect all relevant entities. The system uses rules to control how operations propagate, allowing for flexible and predictable behavior.

## Integration with Other Systems

The workspace serves as the central hub that coordinates with other parts of Seldon to create a cohesive design system platform. Each integration point serves a specific purpose in the overall workflow.

### Component Integration

The workspace works closely with the component system to ensure that all workspace operations respect component schemas and hierarchy rules. When components are instantiated in the workspace, the system validates that the component structure matches its schema definition. The workspace enforces component level hierarchy rules, ensuring that screens can contain modules, modules can contain parts, and so on. This integration ensures that the workspace maintains consistency with the component system's design principles while providing the flexibility needed for design system creation.

### Properties Integration

The workspace manages the complete lifecycle of properties defined by the properties system. It handles the complex inheritance chains that flow from variants to instances, processes property overrides and nested overrides, and ensures that theme integration works correctly throughout the component hierarchy. The workspace serves as the state container that tracks all property changes and maintains the relationships between different property sources, from schema defaults to user customizations.

### Themes Integration

The workspace applies and manages themes, ensuring that theme changes propagate correctly through the component hierarchy. When themes are switched, the workspace coordinates the application of new theme values to variants first, then manages how those changes flow to instances. This integration ensures that theme changes are applied consistently across the entire design system while respecting the property precedence system.

### Factory Integration

The workspace provides the complete state data that the factory uses to generate production code. The factory reads the workspace state, including all component structures, property values, and theme applications, to create production-ready components, styles, and other assets. This integration ensures that the exported code accurately reflects the current workspace state and maintains consistency between the design system and the production application.

The workspace system is designed to be predictable, robust, and extensible. It provides a solid foundation for managing complex design systems while maintaining consistency and integrity throughout the development process.
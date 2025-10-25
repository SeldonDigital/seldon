# Seldon Components

## Overview

Components are the fundamental building blocks. They are reusable UI elements that combine visual design with functional behavior to create consistent, maintainable user interfaces. Each component is defined by a schema that specifies its structure, capabilities, and how it can be customized.

The component system operates on a hierarchical architecture where complex components are built from simpler ones. This hierarchy ensures that components can be combined in predictable ways while maintaining design consistency and enabling efficient development workflows.

## What Are Components?

Components in Seldon are more than just visual elements. They are complete UI building blocks that include:

- **Visual appearance** defined through properties and themes
- **Structural behavior** governed by schemas and hierarchy rules
- **Customization capabilities** through property overrides and inheritance
- **Integration points** with the broader design system

Each component serves a specific purpose in the user interface, from simple text elements to complex interactive modules. The system ensures that all components work together cohesively while remaining individually customizable.

## Component Schemas

Every component is defined by a schema that acts as its blueprint. The schema specifies what the component can do, how it looks, and how it behaves. This schema-driven approach ensures consistency and provides a clear contract for how components should be used.

### Schema Structure

Component schemas define several key aspects:

**Identity and Classification**: Each component has a unique identifier, name, and classification level that determines where it fits in the hierarchy.

**Properties**: The schema declares all properties that can be customized on the component. This includes visual properties like colors and sizes, as well as behavioral properties like interaction states.

**Child Components**: For components that can contain other components, the schema specifies what child components are allowed and how they should be configured.

**Constraints and Restrictions**: The schema can impose limitations on how the component can be used, such as preventing certain child components or restricting property values.

### Schema-Driven Architecture

The schema-driven approach means that component capabilities are defined by their schemas rather than hardcoded in the system. This provides several benefits:

- **Consistency**: All components follow the same definition patterns
- **Validation**: The system can verify that components are used correctly
- **Extensibility**: New components can be added by defining new schemas
- **Documentation**: Schemas serve as living documentation of component capabilities

## Five-Level Hierarchy

Components are organized into a strict five-level hierarchy that governs how they can be nested and combined. This hierarchy creates a natural progression from simple building blocks to complex user interfaces.

### Hierarchy Levels

**Screens** are complete user interfaces that contain everything needed for a full page or major application section. They can contain any other component type.

**Modules** are complex functional units that combine multiple parts and elements. They represent major sections of an interface like headers, sidebars, or navigation systems.

**Parts** are reusable UI sections that combine multiple elements and primitives. They represent common patterns like cards, forms, or content blocks that appear throughout an application.

**Elements** are interactive components built from primitives. They include buttons, inputs, toggles, and other components that users can interact with. Elements can contain primitives and other elements.

**Primitives** are the most basic components. They represent atomic UI elements like text, icons, or images. Primitives cannot contain other components and serve as the foundation for all other component types.

**Frames** are special containers that can hold any component level. They serve as universal layout containers that provide structure without imposing content restrictions and are not part of the main hierarchy levels.

### Nesting Rules

The hierarchy enforces strict nesting rules that ensure components can only be combined in logical ways:

- Components can only contain equal or lower-level components
- Primitives cannot contain any children
- Frames can contain any component level as a special exception
- The system validates all nesting operations to maintain hierarchy integrity

These rules create a natural building pattern where you start with primitives, combine them into elements, group elements into parts, organize parts into modules, and assemble modules into complete screens. Frames can be used at any level to provide additional structure.

## Component Variants

Components exist in the workspace as variants, which are customizable configurations of component schemas. Variants can be used directly or serve as templates for creating instances, providing a way to customize components while maintaining their core structure.

### Default Variants

Every component type has a default variant that is automatically created from the component's schema. The default variant serves as the baseline configuration for that component type, containing all the default properties and child components defined in the schema.

Default variants are automatically created from the component's schema and serve as the baseline configuration. While they can have overrides applied to them just like custom variants, they maintain a direct relationship with the schema definition. Component schemas are rarely changed, but when they are updated, the workspace uses the schema to resolve default component values throughout the system.

### Custom Variants

Custom variants are user-created variations of components that extend or modify the default variant. They allow designers and developers to create specialized versions of components for specific use cases while maintaining the component's core structure and behavior.

Custom variants can:
- Override default properties with new values
- Add or remove child components
- Apply different themes
- Create specialized configurations for specific contexts

### Variant-Instance Relationship

The relationship between variants and instances is fundamental to how the component system works:

**Variants as Configurations**: Variants are complete, usable configurations that can be used directly in applications. When instances are created from variants, they inherit all the variant's properties and child configurations.

**Instance Customization**: While instances inherit from their variants, they can be further customized for specific use cases. Instance-level customizations override variant-level settings, providing fine-grained control when needed.

**Change Propagation**: Changes to variants automatically propagate to all instances created from those variants, ensuring consistency across the design system. However, instance-level customizations are preserved, allowing for both global consistency and local flexibility.

**Variant Hierarchy**: The system maintains a clear hierarchy where schemas define capabilities, variants provide configurations, and instances represent actual usage. This hierarchy ensures that changes flow in the correct direction while preserving customization flexibility.

### Variant Management

The component system provides sophisticated variant management capabilities:

**Variant Creation**: New custom variants can be created by duplicating existing variants and modifying their properties. This allows for incremental customization while preserving the original configuration. Variants can be used directly in applications without needing to create instances.

**Variant Organization**: Variants are organized by component hierarchy levels, making it easier to find and manage different variations of the same component.

**Variant Validation**: All variants are validated against their component schemas, ensuring that customizations don't violate component constraints.

This variant system provides the flexibility needed for complex design systems while maintaining the structure and consistency that makes components reliable and maintainable.

### Variant to Instance Transformation

When a component instance is created from a variant, several key transformations occur:

**Variant Property Inheritance**: The instance inherits all properties from its variant, including any customizations made to the variant beyond the schema defaults.

**Child Component Creation**: If the variant defines child components, those children are instantiated according to the variant's specifications, including their customized properties and relationships.

**Schema Validation**: The instance is validated against the component's schema to ensure all variant customizations are valid and don't violate schema constraints.

**Theme Integration**: The instance is prepared to work with the theme system, with theme references ready to be resolved when the component is used.

### Instance Customization

Component instances support multiple layers of customization that work together to provide flexible configuration:

**Direct Property Overrides**: Individual properties can be set to different values than the variant defaults. This is the most straightforward customization method, allowing direct control over specific aspects of the component instance.

**Child Component Customization**: For components with children, the child components can be customized or replaced entirely. This includes changing child properties, replacing children with different component types, or adding additional children.

**Nested Override System**: Parent components can override properties on their child components through a sophisticated nested override system. This allows parent components to establish default styling that children inherit, while still allowing specific instances to override those defaults when needed.

**Theme Application**: Components can be styled using different themes while maintaining their core structure. Theme changes automatically propagate through the component hierarchy, updating all theme references.

### Property Inheritance and Override Precedence

The component system implements a property inheritance system with clear precedence rules:

**Schema Defaults**: The foundation layer, providing defaults for all component properties.

**Variant Properties**: Customizations applied to variants, which serve as templates for instances.

**Instance Properties**: Direct property overrides applied when creating component instances.

This precedence system ensures that more specific customizations always override more general ones, while maintaining the ability to establish consistent defaults throughout the component hierarchy.

### Validation and Constraint Enforcement

During instantiation, the system enforces several types of constraints:

**Schema Compliance**: All instances must conform to their schema's property definitions and constraints.

**Hierarchy Rules**: The system validates that component nesting follows the five-level hierarchy rules.

**Property Type Validation**: All property values are validated against their defined types and allowed values.

**Restriction Enforcement**: Component restrictions, such as preventing certain child types or limiting property values, are enforced.

**Theme Compatibility**: The system ensures that theme references are valid and that components can work with the available themes.

### Performance and Optimization

The instantiation process is optimized for performance and scalability:

**Lazy Evaluation**: Properties are resolved only when needed, reducing initial instantiation overhead.

**Caching**: Frequently used component configurations are cached to improve performance.

**Incremental Updates**: Only changed properties are recalculated when components are modified.

**Memory Management**: The system efficiently manages memory usage for large component hierarchies.

This comprehensive instantiation system ensures that components can be both powerful and efficient, providing the flexibility needed for complex design systems while maintaining the performance required for production applications.

## Integration with the Core

Components integrate with other parts of the system:

### Properties Integration

Components use the property system to define their customizable aspects. Properties can reference theme values, be computed from other properties, or use exact values. This integration ensures that components can be styled consistently while remaining flexible.

### Theme Integration

Components connect to themes through property references that automatically update when themes change. This creates a bridge between component structure and visual design, enabling consistent styling across the entire design system.

### Workspace Integration

Components are managed within the workspace system, which tracks their relationships, manages their customization, and ensures consistency across the design system. The workspace handles the complex task of maintaining component hierarchies while allowing for customization and theme changes.

This component system provides a robust foundation for building consistent, maintainable user interfaces while supporting the flexibility needed for real-world applications.

## Usage as Source of Truth

This README serves as the authoritative documentation for Seldon Components. When making changes to components:

1. **Update this README first** to reflect the intended component behavior and structure
2. **Implement component schemas** to match the documented specifications
3. **Update component tests** to verify the documented behavior
4. **Validate hierarchy rules** to ensure components follow the documented nesting constraints
5. **Update theme integration** to maintain documented property inheritance patterns

The component system is designed to be:
- **Schema-Driven**: All components follow documented schema specifications
- **Hierarchy-Compliant**: Strict adherence to the five-level component hierarchy
- **Theme-Aware**: Consistent integration with the design system themes
- **Type-Safe**: Full TypeScript support with documented property types
- **Extensible**: Easy to add new components following documented patterns
- **Predictable**: Component behavior should match documentation exactly
- **Validated**: Validation against documented constraints

For technical implementation details, code examples, and specific usage patterns, see [TECHNICAL.md](./TECHNICAL.md).
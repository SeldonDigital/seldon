# Seldon Core Engine

The Seldon Core Engine is a design system engine that manages component-based design systems. It provides the foundation for creating, organizing, and maintaining design systems through a hierarchical architecture of components, properties, themes, and workspace state management.

This system serves both designers and engineers. Designers use it to organize, customize, and build component libraries. Engineers use it as a state management system with hierarchical architecture for building production applications.

## Components

Components are the building blocks of the design system. They are reusable UI building blocks defined by schemas that specify their structure, properties, and behavior.

### Component Schemas

Component schemas are blueprints that define what a component can do. Each schema specifies the component's identity, classification, available properties, and child components. Schemas serve as the source of truth for component capabilities and constraints.

### Five-Level Hierarchy

Components follow a strict five-level hierarchy that governs how they can be nested and combined:

**SCREEN → MODULE → PART → ELEMENT → PRIMITIVE**

Plus **FRAME** as a special container that can hold any component level.

- **Screens** are complete user interfaces that contain everything needed for a full page
- **Modules** are complex functional units like headers, sidebars, or navigation systems
- **Parts** are reusable UI sections like cards, forms, or content blocks
- **Elements** are interactive components like buttons, inputs, or toggles
- **Primitives** are atomic building blocks like text, icons, or images that cannot contain other components
- **Frames** are universal containers that can hold any component level

### Nesting Rules

Components can only contain equal or lower-level components. This creates a natural hierarchy where complex components are built from simpler ones.

**Technical enforcement**: An ELEMENT can contain PRIMITIVE, ELEMENT, or FRAME components. A PART can contain PRIMITIVE, ELEMENT, PART, or FRAME components. This pattern continues up the hierarchy.

**Design pattern**: This structure enables building complex user interfaces from simple building blocks. You start with primitives, combine them into elements, group elements into parts, organize parts into modules, and assemble modules into complete screens.

### Schema-Driven Architecture

The system is schema-driven, meaning component capabilities are defined by their schemas rather than hardcoded. Schemas serve as blueprints for component structure and behavior, but they also play a critical role in verification and validation during code export and style generation. How schemas are specified directly determines how components behave in the workspace, making schema definition crucial to the entire system's operation.

### Component Instantiation

Components are created from schemas and used within the workspace. When a component is instantiated, it inherits its default properties from its schema which can then be customized through the workspace.

## Properties

Properties are configuration values that control how components look and behave. They serve dual purposes: as styling configuration for visual appearance and as a type-safe value system for consistent data handling.

### Seven Value Types

Properties use seven distinct value types to handle different data sources and behaviors:

- **EMPTY**: Unset values that are resolved by the platform or inherited from defaults
- **INHERIT**: Values explicitly inherited from parent components
- **EXACT**: Custom direct values like specific colors, sizes, or text content
- **PRESET**: Predefined options from a controlled set of choices
- **COMPUTED**: Values calculated from other properties using mathematical functions
- **THEME_CATEGORICAL**: Non-sequential theme references like colors and font families
- **THEME_ORDINAL**: Sequential theme references like sizes and spacing values

### Missing Properties in Schemas

When a property is missing from a component schema, it is intentionally excluded from that component's capabilities. This is a deliberate design choice that serves several purposes:

- **Component specialization**: Each component only exposes the properties it actually needs, keeping interfaces clean and focused
- **Type safety**: Missing properties cannot be set on components, preventing invalid configurations
- **Validation**: Only properties declared in the schema can be overridden through nested overrides, maintaining security
- **Inheritance control**: Missing properties allow inheritance from parent components or platform defaults to take effect

For example, a Text component might not have a `background` property in its schema, meaning it cannot have a background color set directly. Instead, it inherits the background from its parent container, which might be the intended behavior for a text element.

### Property Categories

Properties come in three forms. Atomic properties are single values like color or font size. Compound properties group related styling values together, such as background (with color, image, position, and size) or font (with family, size, weight, and style). Shorthand properties provide convenient ways to set multiple related values at once, such as margin (with top, right, bottom, left) or padding (with top, right, bottom, left).

### Property Inheritance

Property inheritance is fundamentally based on EMPTY values and unset properties. When a property is set to EMPTY or is unset, the system allows inheritance from parent components or defaults. Child components inherit properties from their parent components through instance relationships, where instances inherit from their variants. 

Parent components can also override child component properties through nested overrides, but only for properties declared in the child's schema. The compute pipeline enables properties to reference parent properties using `#parent.propertyName` syntax, traversing up the component hierarchy to resolve values. 

This inheritance flows through the component hierarchy, allowing parent components to establish default styling that children can override when needed. EMPTY values are filtered out during property merging, enabling the inheritance chain to work properly.

### Computed Properties

Computed properties enable dynamic value calculation based on other properties. For example, a button's size might be computed as 80% of its parent's width, or a text color might be automatically calculated to ensure sufficient contrast against a background color.

### Property Resolution Pipeline

Properties flow through a resolution pipeline: Schema provides defaults, Workspace applies user customizations, Theme supplies design tokens, and the system resolves everything for export to production code.

## Themes

Themes are collections of design tokens that define the visual design of an application. They provide consistent styling through reusable values for colors, typography, spacing, and visual effects.

### Design Tokens

Design tokens are the building blocks of themes. They include colors, typography settings, spacing values, shadow definitions, and other visual properties. These tokens ensure consistency across the entire design system.

### Theme Structure

Each theme contains core values that define its fundamental characteristics: a base color, typography settings, spacing ratios, and visual effect parameters. The theme system uses these core values to generate a complete set of design tokens.

Themes are built around a core configuration that includes a base color (defined in HSL format), color harmony settings (complementary, triadic, analogous, etc.), and mathematical ratios for spacing and typography. From these core values, the system automatically generates a complete palette of colors, calculates spacing values using modular scales, and creates typography hierarchies that maintain visual consistency.

The core values act as the foundation for all other design tokens. For example, the base color determines the primary color palette through color theory algorithms, while the spacing ratio creates a consistent scale for margins, paddings, and gaps. The typography settings establish font families and size relationships that work harmoniously with the color system and spacing scale.

While the core configuration provides a systematic approach to design tokens, it's also possible to set exact values for individual tokens when the core configuration is too restrictive. This allows for fine-tuning specific design tokens without disrupting the overall theme structure, providing flexibility when the mathematical relationships don't meet specific design requirements.

### Theme References in Properties

Properties connect to themes through references like `@swatch.primary` or `@fontSize.large`. These references create a bridge between component properties and theme tokens, enabling consistent styling across the design system.

## Workspace

The workspace is a state container for organizing and building components. It manages the entire design system state through a hierarchical architecture that maintains relationships between components and ensures consistency.

### For Designers

The workspace serves as a tool to organize, customize, and build component libraries. Designers can create variants of components, customize their properties, apply themes, and organize everything into a coherent design system.

### For Engineers

The workspace functions as a state management system with hierarchical architecture. It tracks component relationships, manages property inheritance, handles theme application, and maintains data integrity throughout the system.

### Four-Level Hierarchy

The workspace organizes components into a four-level hierarchy:

- **Projects**: The top-level container for the entire design system (implemented as workspaces in the system)
- **Boards**: Organize all variants of a component type (one board per component type)
- **Variants**: Templates and definitions that can be default (from schema) or custom (created by users)
- **Instances**: Actual component usage within other components

### How It Works

The workspace manages several key processes with a specific workflow designed to maintain consistency and proper override precedence:

**Component instantiation**: Creating components from schemas with proper property inheritance and child relationships. When components are instantiated, they inherit their default properties from their schema and can be customized through the workspace system.

**Property precedence and workflow**: The system follows a strict precedence order where overrides always win. The proper workflow is to make changes at the appropriate level in the hierarchy:

1. **Create variants for core property differences**: When you need a component to behave differently from the default, create a new variant rather than modifying the default variant. This preserves the original design while allowing customization.

2. **Set properties on variants before instances**: Changes to variants propagate to all their instances, so set properties on the variant level when you want the change to affect all uses of that component type.

3. **Use instance overrides for specific cases**: Only set properties on individual instances when you need a specific instance to differ from its variant. Instance overrides always take precedence over variant properties.

**Theme switching considerations**: This precedence system is especially important for theme switching. When switching themes, the system applies the new theme to variants first, then instances inherit those changes unless they have specific overrides. This means that if you want a component to respond to theme changes, you should set its properties on the variant level, not on individual instances.

**Property propagation**: Changes flow from variants to their instances, ensuring that modifications to a variant affect all its uses throughout the design system. However, instance overrides always take precedence, so specific instances can maintain their custom properties even when the variant changes.

**Theme management**: Themes are applied and inherited through the component hierarchy, maintaining visual consistency. The system ensures that theme changes propagate correctly through the variant-instance relationship.

**Hierarchy management**: Parent-child relationships are maintained and validated, ensuring the component structure remains coherent. The system enforces proper nesting rules and validates all operations.

**Mutation system**: Changes are applied and propagated through the hierarchy according to defined rules, maintaining consistency while allowing flexibility. The system uses a rules-based approach to control what operations are allowed and how they propagate.

**Validation and integrity**: The system ensures the workspace remains consistent and valid after every operation, with comprehensive validation at multiple levels.

## System Integration

These four concepts work together to create a cohesive design system:

Components are defined by schemas that specify their capabilities and constraints. Properties configure components with values that can reference themes or be computed from other properties. Themes provide consistent design tokens that flow through the component hierarchy. The workspace manages the entire design system state, ensuring that changes propagate correctly and relationships are maintained.

This integration creates a system where designers can build complex, consistent user interfaces while engineers have a reliable foundation for production applications.

## Subsystem Documentation

Seldon Core is organized into specialized subsystems, each handling specific aspects of the design system architecture. For detailed implementation information, see the specific subsystem documentation:

### Core Subsystems

- **[Properties README](./properties/README.md)** - **Property System & Value Types**
  - Defines type-safe property structures, value types (EXACT, THEME_CATEGORICAL, COMPUTED, etc.)
  - Handles compound properties (border, margin, padding) and shorthand properties
  - Provides property validation, merging, and inheritance logic
  - Manages preset options and allowed values for component properties

- **[Themes README](./themes/README.md)** - **Theme System & Design Tokens**
  - Manages design tokens including colors, typography, spacing, and visual effects
  - Provides dynamic color generation with harmony algorithms (complementary, triadic, etc.)
  - Handles theme inheritance, customization, and migration between themes
  - Includes stock themes (Material, Earth, Industrial, etc.) and custom theme creation

- **[Compute README](./compute/README.md)** - **Property Computation & Inheritance**
  - Resolves computed properties using mathematical functions (AUTO_FIT, OPTICAL_PADDING, etc.)
  - Handles property inheritance chains from parent to child components
  - Manages context resolution for theme values and property references
  - Provides high-contrast color generation and optical spacing calculations

- **[Workspace README](./workspace/README.md)** - **Workspace State Management**
  - Manages component boards, variants, and instances in hierarchical structures
  - Handles workspace operations (add, remove, move, duplicate components)
  - Provides middleware for validation, migration, and debugging
  - Manages custom themes and workspace-level configuration

- **[Helpers README](./helpers/README.md)** - **Utility Functions & Helpers**
  - Provides color manipulation, conversion, and contrast calculation utilities
  - Handles property processing, merging, and nested overrides
  - Offers resolution helpers for converting properties to concrete CSS values
  - Includes type guards and validation utilities for runtime type checking

- **[Rules README](./rules/README.md)** - **Rules Configuration & Authorization**
  - Defines operation authorization rules for workspace mutations
  - Controls what operations are allowed on different entity types
  - Manages propagation rules for property changes across component hierarchies
  - Provides configuration for workspace constraints and business rules

### Extended Subsystems

- **[Components README](../components/README.md)** - **Component System & Schemas**
  - Defines component hierarchy (Primitive → Element → Part → Module → Screen)
  - Manages component schemas with properties, restrictions, and validation rules
  - Handles component instantiation, duplication, and relationship management
  - Provides component catalog and registry for all available components

- **[Factory README](../factory/README.md)** - **Code Generation & Export Systems**
  - Transforms design workspaces into production-ready code (React, CSS, etc.)
  - Handles asset processing (images, icons, fonts) and optimization
  - Provides export pipelines for different frameworks and styling approaches
  - Manages code formatting, import organization, and build optimization

### Reference Documentation

- **[Technical Reference](./TECHNICAL.md)** - **Code Examples & Implementation Details**
  - Comprehensive code examples for all major subsystems
  - Implementation patterns and best practices
  - API reference and function signatures
  - Integration examples and usage patterns
# Seldon Properties

Properties provide a comprehensive type-safe property definition and processing system. Properties control how components look and behave, serving as the bridge between design intent and production code.

## What Are Properties

Properties are configuration values that define component appearance and behavior. They serve dual purposes: as styling configuration for visual appearance and as a type-safe value system for consistent data handling across the entire design system.

Properties flow through a resolution pipeline that merges values from multiple sources: component schemas provide defaults, workspace customizations apply user changes, themes supply design tokens, and the system resolves everything for export to production code.

## Core Concepts

### Property Categories

Properties come in three forms: atomic, compound, and shorthand. Each category serves a different purpose in the property system.

**Atomic properties** are single values like color or font size. These represent individual styling attributes that cannot be broken down further.

Atomic properties have these behaviors:

- **Override indication**: Atomic properties show as overrides whenever their value differs from the schema's default value

**Compound properties** group related styling values together as a collection of atomic sub-properties, such as background (with color, image, position, and size) or font (with family, size, weight, and style). These properties use dot notation for access, allowing you to reference specific sub-properties like `background.color` or `font.size`. This structure keeps related styling organized while maintaining granular control over individual aspects.

Compound properties have these behaviors:

- **Preset property**: All compound properties include a "preset" sub-property that can reference predefined theme configurations. When no theme preset is available, this property displays as "None"
- **Preset application**: When you select a theme preset, it applies the preset's defined values to the appropriate sibling properties and resets any sibling properties not defined in that preset to EMPTY, effectively clearing any previous customizations
- **Custom state triggering**: Whenever you modify any sibling property value—whether it's part of the selected preset or not—the preset automatically becomes "Custom", indicating that the compound property has been customized beyond its theme definition

**Shorthand properties** provide convenient ways to set multiple related values at once, similar to CSS shorthand properties. These allow you to set multiple atomic properties through a single property definition, reducing redundancy and improving maintainability.

Shorthand properties have these behaviors:

- **Value display**: Shorthand properties either show a single value (when all sub-properties are the same) or multiple values that reflect each sub-property, in the order of the sub-properties
- **Value application**: Selecting a shorthand value from its options will apply that value to all sub-property values
- **Override indication**: Shorthand values show as overrides whenever any one or all of the sub-properties differs from the schema's default value

### Overrides

Overrides indicate when property values differ from their schema-defined defaults. The system tracks overrides to help users understand which properties have been customized and to provide visual feedback about the current state of component styling.

**Override detection** occurs when any property value differs from its schema's default value. This applies to atomic properties (single values), compound properties (when any sub-property differs), and shorthand properties (when any sub-property differs).

**Override indication** provides visual feedback in the interface, typically through styling changes like highlighting, icons, or color coding. This helps users quickly identify which properties have been customized from their default state.

**Override management** allows users to reset properties back to their default values, either individually or in groups. This is particularly useful when experimenting with different styling options or when reverting changes.

### Value Types

Properties use seven distinct value types to handle different data sources and behaviors. Each type serves a specific purpose in the property resolution system:

**EMPTY** values represent unset properties that are resolved by the platform or inherited from defaults. When a property is EMPTY, the system allows inheritance from parent components or platform defaults to take effect.

**INHERIT** values explicitly inherit from parent components. This creates a direct inheritance chain where child components can reference parent property values.

**EXACT** values are custom direct values like specific colors, sizes, or text content. These are concrete values that don't reference other properties or themes.

**PRESET** values use predefined options from a controlled set of choices. These ensure consistency by limiting property values to valid options defined in the system.

**COMPUTED** values are calculated from other properties using mathematical functions. These enable dynamic relationships between properties, such as a button size being 80% of its parent's width.

**THEME_CATEGORICAL** values reference non-sequential theme tokens like colors and font families. These create connections to the design system's color palette and typography choices.

**THEME_ORDINAL** values reference sequential theme tokens like sizes and spacing values. These connect to the design system's spacing scale and size hierarchy.

### Property Resolution Pipeline

Properties flow through a resolution pipeline that determines their final values from multiple sources. This pipeline ensures that properties are resolved in the correct order and that overrides work properly.

**Unset properties** automatically use default values from the component schema or platform defaults. When a property is not specified, the system provides a sensible default.

**Component instances** inherit properties from their variant definition. When you create multiple instances of the same component, they all start with the same properties from the variant, but each instance can override specific properties as needed.

**Explicit inheritance** uses the INHERIT value type to explicitly reference parent component properties. This is different from CSS inheritance - it's an explicit way to say "use the same value as my parent component."

**Computed properties** can reference other properties using `#parent.propertyName` syntax. This allows properties to automatically adjust based on other values, such as a button size being calculated from its parent's width.

This resolution pipeline ensures that properties are resolved in the correct order, with explicit overrides taking precedence over inherited values.

### Missing Properties in Schemas

When a property is missing from a component schema, it is intentionally excluded from that component's capabilities. This is a deliberate design choice that serves several purposes:

Component specialization ensures each component only exposes the properties it actually needs, keeping interfaces clean and focused. Type safety prevents invalid configurations by ensuring missing properties cannot be set on components. Validation maintains security by ensuring only properties declared in the schema can be overridden through nested overrides. Inheritance control allows missing properties to inherit from parent components or platform defaults.

For example, an Icon component might not have a `padding` property in its schema, meaning it cannot have padding set directly. Instead, it inherits spacing from its parent container, which is the intended behavior for an icon element.

## Theme Integration

Themes provide design tokens that properties can reference. Theme values resolve to actual values in the editor and during export, creating a bridge between component properties and theme tokens that enables consistent styling across the design system.

### Theme Resolution

Theme values resolve to actual values in multiple contexts. A theme reference like `@swatch.primary` resolves to an actual color value like `#3b82f6`. This resolution happens during property computation for display in the editor, as well as during the export process to generate production code.

The theme system provides several benefits: consistency ensures all components use the same design tokens, maintainability allows changing themes once to update everywhere, scalability makes it easy to create new themes, and type safety validates theme references at compile time.

## Property Processing

Properties flow through a resolution pipeline that merges values from multiple sources. This pipeline ensures that properties are resolved in the correct order and that inheritance works properly throughout the component hierarchy.

### Resolution Pipeline

The property resolution pipeline follows this sequence:

1. **Schema Properties** provide component defaults from the component definition
2. **Variant Properties** apply base styling from the component variant
3. **Instance Properties** apply user customizations to specific instances
4. **Computed Properties** calculate dynamic values from other properties
5. **Theme Resolution** converts theme references to actual values

**Note**: Children overrides and nested overrides are processed during component instantiation, not during property resolution. They allow parent components to explicitly override properties on their child components when the components are created.

### Property Merging

Property merging combines values from multiple sources while respecting inheritance and override precedence. The system merges properties in a specific order, with later sources taking precedence over earlier ones. This ensures that user customizations override defaults, and that inheritance flows properly through the component hierarchy.

### Validation

Properties include multiple layers of validation to ensure correctness and type safety. TypeScript compilation catches invalid property structures at compile time. Value type validation ensures correct value formats. Theme reference validation verifies that theme tokens exist. Runtime validation handles property constraints, theme resolution, and computed property validation.

## Integration with the Core

Properties integrate with other parts of the system:

### Component Integration

Properties are specified in component schemas and used to configure component appearance and behavior. The component system uses properties to determine what styling options are available for each component type, creating a bridge between component structure and visual design.

### Theme Integration

Properties connect to themes through theme tokens that automatically update when themes change. This creates a bridge between component styling and design tokens, enabling consistent styling across the entire design system.

### Compute Integration

The compute system processes computed properties, resolving dynamic values and inheritance relationships. This system handles the mathematical calculations and property references that enable dynamic styling and responsive design.

### Workspace Integration

Properties are managed within the workspace system, which tracks their values, manages their inheritance, and ensures consistency across the design system. The workspace handles the complex task of maintaining property hierarchies while allowing for customization and theme changes.

This property system provides a robust foundation for building consistent, maintainable user interfaces while supporting the flexibility needed for real-world applications.

## Best Practices

### Property Design

Use theme references for design system consistency, ensuring that components use the same design tokens throughout the system. Prefer compound properties for related styling, keeping related values organized together. Use specific value types for better validation, ensuring that properties have the correct structure and constraints. Follow naming conventions for property keys, maintaining consistency across the system.

### Development Workflow

Define value types and constants first before implementing new properties, ensuring that the property structure is well-defined. This means creating the TypeScript interfaces and enums before adding the property to the main Properties type. Add comprehensive tests for all new properties, verifying that they work correctly in all scenarios. Update documentation when adding properties, keeping the system documentation current. Validate theme integration for theme-referenced properties, ensuring that theme references work correctly.

### Performance Considerations

Minimize computed properties, using them only when necessary to avoid unnecessary calculations. Cache resolved values when possible, improving performance for frequently accessed properties. Optimize property merging for large workspaces, ensuring that the system scales well with complex designs. Use efficient validation for runtime checks, balancing thoroughness with performance.

### Error Handling

Provide clear error messages for invalid properties, helping developers understand and fix issues. Handle missing theme values gracefully, providing fallbacks when theme references cannot be resolved. Validate property constraints at runtime, ensuring that property values are within acceptable ranges. Log property resolution issues for debugging, providing visibility into system behavior.

## Property Schema System

Each property can define its own schema that specifies supported value types, validation rules, and available options. This system reduces adding new properties from 4+ files to 1 file.

### Schema Structure

Property schemas define:
- **Supported Value Types**: Which value types the property accepts
- **Validation Rules**: How to validate values for each type
- **Available Options**: Preset options and theme integration
- **Computed Functions**: Available computed value functions

### Usage

```typescript
import { getPropertySchema, validatePropertyValue, getPropertyOptions } from '@seldon/core/properties'

const schema = getPropertySchema('color')
const isValid = validatePropertyValue('color', 'exact', '#ff0000')
const options = getPropertyOptions('color', 'preset')
```

For complete documentation and examples, see the [Schema System Documentation](./schemas/README.md).

## Technical Implementation

For detailed implementation information, code examples, and technical specifications, see the [Technical Reference](./TECHNICAL.md) document. This includes information about adding new properties, type safety implementation, code export processes, and testing requirements.
# Seldon Themes

Themes are collections of design tokens that define the visual design of an application. They provide consistent styling through reusable values for colors, typography, spacing, and visual effects. Themes serve as the foundation for maintaining visual consistency across an entire design system.

## What Are Themes

Themes are systematic collections of design decisions that work together to create a cohesive visual experience. Rather than defining individual colors or spacing values for each component, themes provide a centralized system of design tokens that ensure consistency and enable easy customization.

A theme is more than just a color palette. It includes typography choices, spacing relationships, visual effects like shadows and borders, and the mathematical relationships between these elements. When you change a theme, the entire application's visual appearance updates consistently because all components reference the same design tokens.

## Core Theme Concepts

### Design Tokens

Design tokens are the building blocks of themes. They are named values that represent design decisions like colors, font sizes, spacing amounts, and shadow definitions. These tokens ensure that when you use "primary color" in one component, it's the same primary color used throughout the entire application.

The theme system organizes design tokens into logical groups. Color tokens include the primary color, secondary colors, neutral grays, and accent colors. Typography tokens cover font families, sizes, weights, and spacing. Spacing tokens define margins, paddings, gaps, and component dimensions. Visual effect tokens include shadows, borders, and gradients.

### Theme Structure

Each theme is built around core configuration values that define its fundamental characteristics. These core values act as the foundation for generating all other design tokens in the theme.

The core configuration includes several key areas:

**Core spatial relationships** define the fundamental ratios and base values that create consistent scales throughout the design system. The ratio determines the mathematical relationship between spacing and typography sizes, creating a modular scale. The base size establishes the fundamental unit for component dimensions. The base font size sets the foundation for the typography scale.

**Font family settings** define the typefaces used throughout the application. The primary font is used for most text content, while the secondary font provides variety for headings or special cases. These fonts work together to create a cohesive typography system.

**Color system configuration** includes a base color defined in HSL format, which serves as the starting point for the entire color palette. Color harmony settings determine how additional colors are generated from the base color using color theory principles. The angle parameter fine-tunes the color relationships, while the step value controls the lightness variations for tints and shades.

**Color system boundaries** define the range of colors used in the theme. The white point sets the lightest color value, the gray point defines the neutral middle tone, and the black point establishes the darkest color. The bleed parameter controls how much of the base color's hue influences the neutral grays.

**Accessibility settings** ensure the theme meets usability requirements. The contrast ratio parameter defines the minimum contrast between text and background colors to ensure readability.

From these core values, the system can automatically generate design tokens when theme properties use dynamic generation features. Color properties can use color harmony, determining the primary color palette through color harmony calculations. When spacing properties use the ratio function, the spacing ratio creates a consistent scale for margins, paddings, and gaps. When typography properties use the ratio function, typography settings establish font families and size relationships that work harmoniously with the color system and spacing scale.

However, themes can also define exact values for individual tokens when the core configuration is too restrictive. This allows for fine-tuning specific design tokens without disrupting the overall theme structure, providing flexibility when the mathematical relationships don't meet specific design requirements.

### Theme References in Properties

Properties connect to themes through references that use the `@` symbol followed by the token path. For example, `@swatch.primary` references the primary color from the theme's color system, while `@fontSize.large` references a large font size from the typography scale.

These theme references create a bridge between component properties and theme tokens. When a component property uses a theme reference, it automatically inherits the value from the current theme. This means that changing the theme updates all components that reference theme tokens, ensuring consistent visual changes across the entire application.

## Theme Token Categories

### Color Tokens

Color tokens are organized into a systematic palette that includes primary colors, secondary colors, neutral grays, and accent colors. The color system uses HSL (Hue, Saturation, Lightness) values and supports both dynamic color generation and custom color definitions.

**Color harmony tokens** creates secondary colors from the base color using color theory principles. When a theme uses harmony algorithms, the base color serves as the foundation for generating additional colors. Complementary colors are opposite on the color wheel, creating high contrast. Triadic colors are evenly spaced around the color wheel, providing balanced variety. Analogous colors are adjacent on the color wheel, creating harmonious combinations. The system also supports split complementary, square, and monochromatic harmonies.

**Step-based color variations** use the step parameter to create lighter and darker variations of colors. Positive step values create lighter tints of the base color, while negative step values create darker shades. The step value controls the lightness difference between color variations, creating a systematic color scale where each step represents a consistent lightness change in either direction from the base color.

**Bleed parameter** controls how much of the base color's hue influences neutral grays. When bleed is set to zero, grays remain pure neutral colors. As bleed increases, the base color's hue gradually influences the gray tones, creating warmer or cooler neutral colors that harmonize with the overall color palette.

**Custom swatch tokens** allow themes to define exact color values for specific swatches when the harmony and step algorithms don't produce the desired results. This provides flexibility to override generated colors with custom values, enabling precise color control while maintaining the systematic approach for other colors.

**Neutral color tokens** provides grays and whites that work with the color palette. The white point sets the lightest color value, the gray point defines the neutral middle tone, and the black point establishes the darkest color. These neutral colors can be influenced by the bleed parameter to create warmer or cooler neutral tones that complement the overall color scheme.

All of these color generation features can be overridden with exact color values when the dynamic generation doesn't produce the desired results. This provides complete flexibility to use systematic color generation where it works well and exact color definitions where precise control is needed.

### Typography Tokens

Typography tokens define the text styling system for the application. They include font families, font sizes, font weights, line heights, and letter spacing values. The typography system supports both dynamic generation based on mathematical relationships and custom definitions for precise control.

**Font family tokens** define the typefaces used throughout the application. The primary font is used for most text content, while the secondary font provides variety for headings or special cases. These fonts work together to create a cohesive typography system that maintains consistency while allowing for visual variety.

**Font size tokens** use the theme's ratio to create a modular scale for font sizes. When typography properties use the ratio function, font sizes are calculated using mathematical relationships that create consistent size hierarchies. The steps in the scale are entirely user-defined and don't need to follow exact mathematical deltas, allowing for custom size relationships that maintain proportional harmony throughout the application.

**Font weight tokens** provide a range of weights from thin (100) to black (900), enabling the creation of visual hierarchy and emphasis. These weights can be systematically applied to create consistent typography patterns, with lighter weights for body text and heavier weights for headings and emphasis.

**Line height tokens** create readable text spacing that adapts to different font sizes and contexts. Line heights can be calculated based on font size relationships or defined as exact values to ensure optimal readability across different text elements and use cases.

**Letter spacing tokens** adjust the spacing between characters to improve readability and visual appearance. Letter spacing values can be calculated based on font size relationships or set as exact values to achieve the desired text appearance for different styles and contexts.

All of these typography generation features can be overridden with exact values when the dynamic generation doesn't produce the desired results. This provides complete flexibility to use systematic typography generation where it works well and exact typography definitions where precise control is needed.

### Spacing Tokens

Spacing tokens define the spatial relationships between elements in the application. They include size tokens for component dimensions, margin tokens for external spacing, padding tokens for internal spacing, gap tokens for space between elements, and corner tokens for border radius values. The spacing system supports both dynamic generation based on mathematical relationships and custom definitions for precise control.

**Ratio-based spacing tokens** use the theme's ratio to create consistent spacing relationships throughout the application. When spacing properties use the ratio function, spacing values are calculated using mathematical relationships that maintain proportional harmony. The steps in the spacing scale are entirely user-defined and don't need to follow exact mathematical deltas, allowing for custom spacing relationships that work best for specific design needs.

**Size tokens** define component dimensions and layout measurements. These tokens establish the fundamental sizing system for components, ensuring consistent proportions across different elements. Size tokens can be generated using ratio-based calculations or defined as exact values for precise control.

**Margin tokens** control external spacing between components and their surrounding elements. These tokens define how much space exists outside component boundaries, creating consistent spacing patterns throughout the application layout.

**Padding tokens** manage internal spacing within components, defining how much space exists between component boundaries and their content. These tokens ensure consistent internal spacing that maintains readability and visual balance.

**Gap tokens** define spacing between elements within containers, such as the space between items in a list or grid. These tokens create consistent spacing patterns for grouped elements while maintaining visual rhythm.

**Corner tokens** establish border radius values for rounded corners on components. These tokens create consistent corner styling that can range from sharp corners to fully rounded elements, providing visual variety while maintaining systematic consistency.

All of these spacing generation features can be overridden with exact values when the dynamic generation doesn't produce the desired results. This provides complete flexibility to use systematic spacing generation where it works well and exact spacing definitions where precise control is needed.

### Visual Effect Tokens

Visual effect tokens define the appearance of shadows, borders, gradients, and other visual enhancements. These tokens can reference other theme tokens to create consistent visual effects throughout the application, ensuring that visual enhancements work harmoniously with the overall design system.

**Background tokens** define various background treatments including solid colors, gradients, and patterns. These tokens can reference colors from the theme's color system and spacing values for positioning and sizing, creating consistent background treatments throughout the application.

**Border tokens** define border styles, widths, and colors for component boundaries. These tokens can reference colors from the theme's color system and spacing values from the spacing system, creating consistent border styling that integrates with the overall design. Border tokens support various styles including solid, dashed, and dotted borders with customizable widths and colors.

**Gradient tokens** provide linear and radial gradient definitions for backgrounds and visual effects. These tokens can reference multiple colors from the theme's color palette, creating smooth color transitions that enhance the visual design. Gradient tokens can be generated using color harmony relationships or defined as exact values for specific visual effects.

**Blur and spread tokens** control the visual intensity and distribution of effects like shadows and glows. These tokens can reference spacing values from the theme's spacing system to maintain proportional relationships, or be defined as exact values for precise visual control.

**Shadow tokens** create depth and dimension through drop shadows with blur, spread, and offset values. These tokens can reference colors from the theme's color palette, ensuring that shadows complement the overall color scheme. Shadow tokens can be generated using systematic relationships or defined as exact values for precise control over visual depth and emphasis.

All of these visual effect tokens can reference other theme tokens to maintain consistency, and can be overridden with exact values when the dynamic generation doesn't produce the desired results. This provides complete flexibility to use systematic visual effect generation where it works well and exact visual effect definitions where precise control is needed.

## How Themes Populate Property Values

Themes populate property values through a resolution process that converts theme references into actual values. When a component property uses a theme reference like `@swatch.primary`, the system looks up the corresponding value in the current theme and replaces the reference with the actual value.

This resolution process happens in multiple contexts. During property computation for display in the editor, theme references are resolved to show the actual colors and values. During the export process, theme references are resolved to generate production code with concrete values.

The theme resolution system provides several benefits. Consistency ensures that all components using the same theme reference get the same value. Maintainability allows changing a theme token once to update all components that reference it. Scalability makes it easy to create new themes by defining new token values. Type safety validates theme references at compile time, preventing errors from invalid references.

### How Theme Tokens Are Referenced

Theme tokens are referenced in properties using two different approaches that reflect how the tokens are organized and used.

**THEME_CATEGORICAL tokens** are referenced by their specific names and represent individual design decisions. These include colors like `@swatch.primary` or font families like `@fontFamily.primary`. These tokens don't have a natural order and are chosen based on design decisions rather than mathematical relationships. When you reference a named token, you're getting that specific value from the theme. The system uses these reserved names for categorical tokens:

- **Color tokens**: `white`, `gray`, `black`, `primary`, `swatch1`, `swatch2`, `swatch3`, `swatch4`, `background`
- **Font family tokens**: `primary`, `secondary`
- **Gradient tokens**: `primary`, `gradient1`, `gradient2`
- **Background tokens**: `primary`, `background1`, `background2`
- **Scrollbar tokens**: `primary`

**THEME_ORDINAL tokens** are referenced by their position in a scale and represent values that follow a natural order. These include sizes like `@fontSize.large` or spacing like `@padding.comfortable`. These tokens are often generated using mathematical relationships and follow a systematic scale. When you reference a scale-based token, you're getting a value from a predefined scale that maintains proportional relationships. The system uses these reserved names for ordinal tokens:

- **Font size tokens**: `tiny`, `xxsmall`, `xsmall`, `small`, `medium`, `large`, `xlarge`, `xxlarge`, `huge`
- **Font weight tokens**: `thin`, `xlight`, `light`, `normal`, `medium`, `semibold`, `bold`, `xbold`, `black`
- **Size tokens**: `tiny`, `xxsmall`, `xsmall`, `small`, `medium`, `large`, `xlarge`, `xxlarge`, `huge`
- **Spacing tokens**: `tight`, `compact`, `cozy`, `comfortable`, `open`
- **Line height tokens**: `solid`, `tight`, `compact`, `cozy`, `comfortable`, `open`, `none`
- **Border width tokens**: `xsmall`, `small`, `medium`, `large`, `xlarge`
- **Shadow intensity tokens**: `xlight`, `light`, `moderate`, `strong`, `xstrong`
- **Border style tokens**: `hairline`, `thin`, `normal`, `thick`, `bevel`

## Theme Development

Creating new themes involves defining both the core configuration values and the specific parameters for each design token. The core configuration includes the base color, color harmony settings, and mathematical ratios for spacing and typography. However, each individual token still requires explicit definition of its parameters, such as step values for size tokens or specific color values for swatch tokens.

The default theme provides a good reference for token values when in doubt, offering a solid foundation of step values, spacing relationships, and typography settings that work well together. This can serve as a starting point for custom themes, with modifications made to specific tokens as needed.

When developing themes, it's important to consider accessibility requirements, including sufficient contrast ratios for text and background colors. The system includes validation to ensure that themes meet accessibility standards and provide a good user experience across different contexts.

## Integration with the Core

Themes integrate with other parts of the system:

### Properties Integration

Themes provide design tokens that properties can reference through theme values. Properties connect to themes through references like `@swatch.primary` or `@fontSize.large`, creating a bridge between component styling and design tokens that enables consistent styling across the entire design system.

### Component Integration

Themes work with the component system to provide consistent visual styling. Components reference theme tokens through their properties, ensuring that all components using the same theme reference get the same value and that theme changes propagate consistently throughout the application.

### Workspace Integration

Themes are managed within the workspace system, which handles theme application and ensures consistency across the design system. The workspace manages theme switching and ensures that theme changes propagate correctly through the component hierarchy.

This theme system provides a robust foundation for building consistent, maintainable user interfaces while supporting the flexibility needed for real-world applications.

## Best Practices

### Theme Design

When designing themes, focus on creating systematic relationships between design tokens. Use consistent ratios for spacing and typography to create visual harmony. Ensure sufficient contrast ratios for accessibility. Use semantic naming for theme tokens to make them easy to understand and use.

### Color Selection

Choose base colors that represent your brand or application purpose. Select color harmony types that fit your design goals and create the desired visual impact. Test themes in different lighting conditions and contexts to ensure they work well across different use cases.

### Typography

Create clear hierarchies using different font sizes and weights. Choose line heights that improve readability for different text sizes. Use consistent font families throughout the theme to maintain visual coherence. Consider how typography scales across different screen sizes and devices.

### Spacing

Use consistent ratios for spacing values to create visual rhythm. Provide both small and large spacing options to support different layout needs. Ensure spacing values work well with the typography system to create harmonious layouts.

## System Integration

Themes work with other parts of Seldon to provide a complete design solution. They integrate with the properties system to provide theme references that components can use. They work with the compute system to resolve theme values during property computation. They integrate with the workspace system to manage theme application and inheritance.

This integration ensures that themes are active parts of the design system that respond to changes and maintain consistency. When themes change, the entire system updates to reflect the new visual design, ensuring that the application remains cohesive and consistent.

For detailed implementation information, code examples, and technical specifications, see the [Technical Reference](./TECHNICAL.md) document.

## Subsystem Documentation

For detailed implementation information, see the specific subsystem documentation:

- [Core README](../README.md) - Core engine and system integration
- [Properties README](../properties/README.md) - Property system and theme integration
- [Compute README](../compute/README.md) - Property computation and theme resolution
- [Helpers README](../helpers/README.md) - Theme utilities and color processing
- [Workspace README](../workspace/README.md) - Workspace state management and theme processing
- [Factory README](../../factory/README.md) - Code generation and theme export
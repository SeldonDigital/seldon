# Themes

The themes system provides a design system for creating consistent, beautiful, and accessible user interfaces. It includes predefined themes, dynamic color generation, and a flexible architecture for custom theme creation.

## Quick Start

### For Engineers
```typescript
import { Theme, stockThemes } from "@seldon/core"

// Use a predefined theme
const theme: Theme = stockThemes.material

// Access theme values
const primaryColor = theme.swatch.primary.value // "#3f51b5"
const fontSize = theme.fontSize.medium.value    // "1rem"
```

### For Designers
- **10+ Stock Themes**: Material, Earth, Industrial, Pop, Royal Azure, and more
- **Dynamic Color Generation**: Automatic color harmony and contrast calculation
- **Design Tokens**: Consistent spacing, typography, and visual effects
- **Theme References**: Use `@swatch.primary`, `@fontSize.large` in components

## Overview

The themes system is built around the concept of design tokens - reusable values that define the visual design of your application. These tokens include colors, typography, spacing, shadows, and more, all organized into cohesive themes.

## Architecture

### Core Components

- **`types.ts`** - Type definitions for all theme-related interfaces and enums
- **`helpers/`** - Utility functions for theme computation and color generation
- **`*.ts`** - Individual theme definitions (default, earth, industrial, etc.)

### Theme Structure

Each theme follows a consistent structure:

```typescript
interface StaticTheme {
  id: string
  name: string
  description: string
  intent: string
  core: {
    ratio: Ratio
    fontSize: number
    size: number
  }
  fontFamily: {
    primary: string
    secondary: string
  }
  color: {
    baseColor: HSL
    harmony: Harmony
    angle: number
    step: number
    whitePoint: number
    grayPoint: number
    blackPoint: number
    bleed: number
    contrastRatio: number
  }
  // ... additional theme sections
}
```

## Available Themes

### Stock Themes

The system includes predefined themes:

| Theme | Style | Primary Color | Best For |
|-------|-------|---------------|----------|
| **`default`** | Clean, versatile | Neutral gray | General purpose, professional |
| **`earth`** | Warm, natural | Earthy brown | Organic, nature-focused apps |
| **`industrial`** | Modern, cool | Steel blue | Tech, manufacturing, corporate |
| **`material`** | Google Material | Blue (#3f51b5) | Android apps, Google ecosystem |
| **`pop`** | Vibrant, energetic | Bright orange | Creative, entertainment, youth |
| **`royal-azure`** | Sophisticated | Deep blue | Luxury, premium, professional |
| **`seldon`** | Brand-specific | Custom | Seldon brand applications |
| **`sky`** | Light, airy | Light blue | Weather, travel, outdoor apps |
| **`sunset-blue`** | Warm, sunset | Orange-red | Photography, travel, lifestyle |
| **`wildberry`** | Rich, berry | Purple-red | Food, fashion, creative apps |

## Design Tokens

### Color System

The color system uses HSL (Hue, Saturation, Lightness) values and supports dynamic color generation based on:

- **Base Color** - The primary color for the theme
- **Harmony** - Color relationship type (Complementary, Triadic, etc.)
- **Step** - Lightness variation for tints and shades
- **Bleed** - How much hue bleeds into neutral colors

#### Color Harmony Types

- `Complementary` - Colors opposite on the color wheel
- `SplitComplementary` - Base color with two adjacent to its complement
- `Triadic` - Three colors evenly spaced on the color wheel
- `Analogous` - Colors adjacent to each other
- `Square` - Four colors evenly spaced
- `Monochromatic` - Variations of a single hue

### Typography

The typography system includes:

- **Font Families** - Primary and secondary font choices
- **Font Sizes** - Modular scale based on the theme's ratio
- **Font Weights** - From thin (100) to black (900)
- **Line Heights** - Optimized for readability
- **Letter Spacing** - Fine-tuned for different text styles

### Spacing & Layout

- **Size** - Component dimensions
- **Dimension** - Layout dimensions
- **Margin** - External spacing
- **Padding** - Internal spacing
- **Gap** - Space between elements
- **Corners** - Border radius values

### Visual Effects

- **Shadows** - Drop shadows with blur and spread
- **Borders** - Border styles, widths, and colors
- **Gradients** - Linear and radial gradients
- **Backgrounds** - Solid colors, images, and patterns

## Usage

### Importing Themes

```typescript
import defaultTheme from "@seldon/core/themes/default"
import { stockThemes } from "@seldon/core/themes"
```

### Using Theme Values

```typescript
import { Theme } from "@seldon/core"

function MyComponent({ theme }: { theme: Theme }) {
  return (
    <div
      style={{
        backgroundColor: theme.swatch.primary.value,
        fontSize: theme.fontSize.medium.value,
        padding: theme.padding.comfortable.value,
      }}
    >
      Hello World
    </div>
  )
}
```

### Dynamic Color Generation

The system generates color palettes based on your theme's color settings:

```typescript
import { getDynamicColors } from "./helpers/get-dynamic-colors"

const colors = getDynamicColors(theme)
// Returns: { white, gray, black, primary, swatch1, swatch2, swatch3, swatch4 }
```

## Helpers

### `compute-theme.ts`

Transforms a static theme into a computed theme with dynamic colors:

```typescript
import { computeTheme } from "./helpers/compute-theme"

const computedTheme = computeTheme(staticTheme)
```

### `get-dynamic-colors.ts`

Generates color palettes based on theme settings:

```typescript
import { getDynamicColors, getPalette } from "./helpers/get-dynamic-colors"

const colors = getDynamicColors(theme)
const palette = getPalette({
  baseColor: { hue: 200, saturation: 50, lightness: 50 },
  harmony: Harmony.Complementary,
  angle: 20,
  step: 10
})
```

### `get-palette-swatch-name.ts`

Generates human-readable names for color swatches:

```typescript
import { getPaletteSwatchName } from "./helpers/get-palette-swatch-name"

const name = getPaletteSwatchName("swatch1", theme)
// Returns: "Tint 1", "Complement", etc.
```

## Best Practices

### Theme Design

1. **Consistency** - Use the same ratio and spacing values throughout
2. **Accessibility** - Ensure sufficient contrast ratios
3. **Semantic Naming** - Use descriptive names for theme values
4. **Modularity** - Design themes to work across different contexts

### Color Selection

1. **Base Color** - Choose a color that represents your brand
2. **Harmony** - Select a harmony type that fits your design goals
3. **Contrast** - Ensure text remains readable on all backgrounds
4. **Testing** - Test themes in different lighting conditions

### Typography

1. **Hierarchy** - Use different font sizes to create visual hierarchy
2. **Readability** - Choose line heights that improve readability
3. **Consistency** - Use the same font families throughout
4. **Responsive** - Consider how typography scales across devices


## Contributing

When contributing to the themes system:

1. **Follow the existing patterns** - Maintain consistency with existing themes
2. **Add tests** - Ensure new functionality is properly tested
3. **Update documentation** - Keep this README current
4. **Consider accessibility** - Ensure themes work for all users
5. **Test across themes** - Verify changes work with all existing themes

## Resources

- [Design Tokens Specification](https://design-tokens.github.io/community-group/format/)
- [Color Theory for Designers](https://www.smashingmagazine.com/2010/01/color-theory-for-designers-part-1-the-meaning-of-color/)
- [Typography in Design Systems](https://medium.com/eightshapes-llc/typography-in-design-systems-6ed771432f1e)
- [Spacing in Design Systems](https://medium.com/eightshapes-llc/space-in-design-systems-188bcbae0d62)

## Usage as Source of Truth

This README serves as the authoritative documentation for the Themes System. When making changes to the theme functionality:

1. **Update this README first** to reflect the intended theme behavior and design token system
2. **Implement changes** to match the documented specifications and theme architecture
3. **Update theme tests** to verify the documented behavior
4. **Validate that the theme system** follows the documented design token structure and color generation
5. **Ensure theme integration** maintains the documented theme-aware property references and design consistency

The themes system is designed to be:
- **Design Token-Based**: Uses documented design tokens for consistent visual design
- **Color Theory-Driven**: Implements documented color harmony and generation algorithms
- **Dynamic**: Supports documented dynamic color generation and theme computation
- **Extensible**: Easy to add new themes following documented patterns
- **Accessible**: Ensures documented accessibility and contrast requirements
- **Predictable**: Theme behavior should match documentation exactly
- **Consistent**: All themes follow the documented design token structure and naming conventions

### Theme Development Workflow

When creating or modifying theme functionality:

1. **Define Theme Structure**: Document the theme's design tokens and color system
2. **Implement Color Generation**: Create theme with documented color harmony and generation
3. **Add Design Tokens**: Ensure all design tokens follow documented structure and naming
4. **Test Integration**: Verify theme works with property system and component rendering
5. **Update Documentation**: Keep this README current with theme changes

### Theme Validation

All themes must validate against documented specifications:
- **Design Tokens**: Must follow documented design token structure and naming conventions
- **Color System**: Must implement documented color harmony and generation algorithms
- **Accessibility**: Must meet documented contrast ratio and accessibility requirements
- **Integration**: Must work with documented theme-aware property references (@swatch.*, @fontSize.*, etc.)

This ensures consistency across the entire themes system and maintains the reliability of design token generation and theme integration.

For detailed implementation information, see the specific subsystem documentation:
- [Core README](../README.md) - Core engine and system integration
- [Properties README](../properties/README.md) - Property system and theme integration
- [Compute README](../compute/README.md) - Property computation and theme resolution
- [Helpers README](../helpers/README.md) - Theme utilities and color processing
- [Workspace README](../workspace/README.md) - Workspace state management and theme processing
- [Factory README](../../factory/README.md) - Code generation and theme export

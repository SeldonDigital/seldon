# Themes System - Technical Reference

This document provides technical implementation details, code examples, and specifications for the Themes System.

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

#### Color Token Structure
```typescript
interface ColorTokens {
  white: ColorToken
  gray: ColorToken
  black: ColorToken
  primary: ColorToken
  swatch1: ColorToken    // Generated based on harmony
  swatch2: ColorToken    // Generated based on harmony
  swatch3: ColorToken    // Generated based on harmony
  swatch4: ColorToken    // Generated based on harmony
}

interface ColorToken {
  value: string          // "#007bff"
  hsl: HSL              // { hue: 200, saturation: 50, lightness: 50 }
  name: string          // "Primary", "Complement", "Tint 1", etc.
}
```

### Typography

The typography system includes:

- **Font Families** - Primary and secondary font choices
- **Font Sizes** - Modular scale based on the theme's ratio
- **Font Weights** - From thin (100) to black (900)
- **Line Heights** - Optimized for readability
- **Letter Spacing** - Fine-tuned for different text styles

#### Typography Token Structure
```typescript
interface TypographyTokens {
  fontFamily: {
    primary: string      // "Inter, sans-serif"
    secondary: string    // "Georgia, serif"
  }
  fontSize: {
    xxsmall: SizeToken, xsmall: SizeToken, small: SizeToken,
    medium: SizeToken, large: SizeToken, xlarge: SizeToken, xxlarge: SizeToken
  }
  fontWeight: {
    thin: number, light: number, normal: number, medium: number,
    semibold: number, bold: number, extrabold: number, black: number
  }
  lineHeight: {
    tight: number, normal: number, relaxed: number
  }
  letterSpacing: {
    tight: string, normal: string, wide: string
  }
}
```

### Spacing & Layout

- **Size** - Component dimensions
- **Dimension** - Layout dimensions
- **Margin** - External spacing
- **Padding** - Internal spacing
- **Gap** - Space between elements
- **Corners** - Border radius values

#### Spacing Token Structure
```typescript
interface SpacingTokens {
  size: {
    xxsmall: SizeToken, xsmall: SizeToken, small: SizeToken,
    medium: SizeToken, large: SizeToken, xlarge: SizeToken, xxlarge: SizeToken
  }
  margin: {
    tight: SizeToken, cozy: SizeToken, comfortable: SizeToken, spacious: SizeToken
  }
  padding: {
    tight: SizeToken, cozy: SizeToken, comfortable: SizeToken, spacious: SizeToken
  }
  gap: {
    tight: SizeToken, cozy: SizeToken, comfortable: SizeToken, spacious: SizeToken
  }
  corners: {
    none: SizeToken, small: SizeToken, medium: SizeToken, large: SizeToken, full: SizeToken
  }
}

interface SizeToken {
  value: string          // "0.5rem", "1rem", "2rem"
  px: number            // 8, 16, 32 (pixel equivalent)
}
```

### Visual Effects

- **Shadows** - Drop shadows with blur and spread
- **Borders** - Border styles, widths, and colors
- **Gradients** - Linear and radial gradients
- **Backgrounds** - Solid colors, images, and patterns

#### Visual Effects Token Structure
```typescript
interface VisualEffectsTokens {
  shadow: {
    none: ShadowToken, small: ShadowToken, medium: ShadowToken, large: ShadowToken, xlarge: ShadowToken
  }
  border: {
    none: BorderToken, thin: BorderToken, medium: BorderToken, thick: BorderToken
  }
  gradient: {
    primary: GradientToken, secondary: GradientToken, subtle: GradientToken
  }
}

interface ShadowToken {
  value: string          // "0 1px 3px rgba(0,0,0,0.12)"
  offset: { x: number, y: number }
  blur: number
  spread: number
  color: string
}

interface BorderToken {
  width: string          // "1px"
  style: string          // "solid"
  color: string          // "#e5e5e5"
}
```

## Usage

### Importing Themes
```typescript
import defaultTheme from "@seldon/core/themes/default"
import { stockThemes } from "@seldon/core/themes"

// Get all available themes
const themes = stockThemes
// Returns: { default, earth, industrial, material, pop, royal-azure, seldon, sky, sunset-blue, wildberry }
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
        borderRadius: theme.corners.medium.value,
        boxShadow: theme.shadow.medium.value,
      }}
    >
      Hello World
    </div>
  )
}
```

### Theme Resolution
```typescript
import { getTheme } from "@seldon/core/themes"

// Get a specific theme
const theme = getTheme("material")

// Get theme with fallback
const theme = getTheme("custom-theme") || getTheme("default")
```

## Dynamic Color Generation

The system automatically generates color palettes based on your theme's color settings:
```typescript
import { getDynamicColors } from "./helpers/get-dynamic-colors"

const colors = getDynamicColors(theme)
// Returns: { white, gray, black, primary, swatch1, swatch2, swatch3, swatch4 }
```

### Color Generation Process
1. **Base Color Analysis** - Extract hue, saturation, and lightness
2. **Harmony Calculation** - Generate complementary colors based on harmony type
3. **Tint/Shade Generation** - Create lighter and darker variations
4. **Neutral Color Generation** - Create grays with subtle hue bleeding
5. **Contrast Validation** - Ensure sufficient contrast ratios

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

## Custom Themes

### Creating Custom Themes
```typescript
import { StaticTheme, Harmony } from "@seldon/core/themes"

const customTheme: StaticTheme = {
  id: "my-custom-theme",
  name: "My Custom Theme",
  description: "A custom theme for my application",
  intent: "professional",
  core: {
    ratio: 1.5,
    fontSize: 16,
    size: 8
  },
  fontFamily: {
    primary: "Inter, sans-serif",
    secondary: "Georgia, serif"
  },
  color: {
    baseColor: { hue: 220, saturation: 60, lightness: 50 },
    harmony: Harmony.Triadic,
    angle: 15,
    step: 8,
    whitePoint: 95,
    grayPoint: 50,
    blackPoint: 5,
    bleed: 0.1,
    contrastRatio: 4.5
  },
  // ... additional theme properties
}
```

### Theme Customization
```typescript
import { customizeTheme } from "@seldon/core/themes"

// Create a variant of an existing theme
const customizedTheme = customizeTheme("default", {
  color: {
    baseColor: { hue: 120, saturation: 70, lightness: 45 }
  },
  fontFamily: {
    primary: "Roboto, sans-serif"
  }
})
```

## Theme Types

### Core Theme Types
```typescript
// Static theme definition
interface StaticTheme {
  id: ThemeId
  name: string
  description: string
  intent: string
  core: CoreTheme
  fontFamily: FontFamilyTheme
  color: ColorTheme
  // ... additional sections
}

// Computed theme with resolved values
interface Theme extends StaticTheme {
  swatch: ColorTokens
  fontSize: TypographyTokens
  fontWeight: FontWeightTokens
  lineHeight: LineHeightTokens
  letterSpacing: LetterSpacingTokens
  size: SizeTokens
  margin: SpacingTokens
  padding: SpacingTokens
  gap: SpacingTokens
  corners: CornerTokens
  shadow: ShadowTokens
  border: BorderTokens
  gradient: GradientTokens
}

// Theme ID type
type ThemeId = 
  | "default" | "earth" | "industrial" | "material" 
  | "pop" | "royal-azure" | "seldon" | "sky" 
  | "sunset-blue" | "wildberry" | "custom"
```

### Color Harmony Types
```typescript
enum Harmony {
  Complementary = "complementary",
  SplitComplementary = "splitComplementary",
  Triadic = "triadic",
  Analogous = "analogous",
  Square = "square",
  Monochromatic = "monochromatic"
}
```

### HSL Color Type
```typescript
interface HSL {
  hue: number        // 0-360
  saturation: number // 0-100
  lightness: number  // 0-100
}
```

## Theme Integration with Properties

### Theme Value References
Properties can reference theme values using the `@` symbol:
```typescript
// Color theme references
const colorProperty = {
  type: ValueType.THEME_CATEGORICAL,
  value: "@swatch.primary"  // References theme.swatch.primary.value
}

// Size theme references
const sizeProperty = {
  type: ValueType.THEME_ORDINAL,
  value: "@fontSize.large"  // References theme.fontSize.large.value
}

// Spacing theme references
const spacingProperty = {
  type: ValueType.THEME_ORDINAL,
  value: "@padding.comfortable"  // References theme.padding.comfortable.value
}
```

### Theme Resolution in Properties
```typescript
import { resolveThemeValue } from "@seldon/core/properties"

// Resolve theme value to actual CSS value
const resolvedValue = resolveThemeValue(themeProperty, theme)
// "@swatch.primary" -> "#007bff"
// "@fontSize.large" -> "1.5rem"
// "@padding.comfortable" -> "1rem"
```

## Theme Migration

### Migrating Between Themes
```typescript
import { migrateTheme } from "@seldon/core/themes"

// Migrate workspace from one theme to another
const migratedWorkspace = migrateTheme(
  workspace,
  "old-theme",
  "new-theme"
)
```

### Theme Versioning
```typescript
// Themes include version information for migration
interface StaticTheme {
  version: number
  // ... other properties
}

// Check theme compatibility
const isCompatible = checkThemeCompatibility(theme1, theme2)
```

## Error Handling
Themes include comprehensive error handling:
- **Invalid color values** - Fallback to default colors
- **Missing theme values** - Graceful degradation
- **Theme loading errors** - Fallback to default theme
- **Color generation errors** - Use safe color defaults

## Performance Considerations
1. **Theme Caching** - Cache computed themes to avoid recalculation
2. **Lazy Loading** - Load themes only when needed
3. **Color Precomputation** - Precompute color palettes
4. **Memory Management** - Clean up unused theme instances

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

# Property Schemas

Defines property validation, options, and behavior in property value files.

## What It Does

Each property schema specifies:
- Supported value types
- Validation rules for each type
- Available options for each type
- Theme integration

## Schema Structure

```typescript
export interface PropertySchema {
  name: string
  description: string
  supports: readonly PropertyValueType[]
  validation: {
    empty?: () => boolean
    inherit?: () => boolean
    exact?: (value: any) => boolean
    preset?: (value: any) => boolean
    computed?: (value: any) => boolean
    themeCategorical?: (value: any, theme?: Theme) => boolean
    themeOrdinal?: (value: any, theme?: Theme) => boolean
  }
  presetOptions?: () => any[]
  themeCategoricalKeys?: (theme: Theme) => string[]
  themeOrdinalKeys?: (theme: Theme) => string[]
  computedFunctions?: () => ComputedFunction[]
}
```

## Value Types

- **empty**: Unset properties
- **inherit**: Inherit from parent
- **exact**: Custom values (colors, sizes, text)
- **preset**: Predefined options
- **computed**: Calculated from other properties
- **themeCategorical**: Non-sequential theme tokens (colors, fonts)
- **themeOrdinal**: Sequential theme tokens (sizes, spacing)

## Example

```typescript
export const colorSchema: PropertySchema = {
  name: 'color',
  description: 'Element color styling',
  supports: ['empty', 'inherit', 'exact', 'preset', 'themeCategorical'] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: any) => typeof value === 'string' && value.startsWith('#'),
    preset: (value: any) => Object.values(Color).includes(value),
    themeCategorical: (value: any, theme?: Theme) => theme && value in theme.swatch
  },
  presetOptions: () => Object.values(Color),
  themeCategoricalKeys: (theme: Theme) => Object.keys(theme.swatch)
}
```

## Usage

```typescript
import { getPropertySchema, validatePropertyValue, getPropertyOptions } from '@seldon/core/properties'

// Get schema
const schema = getPropertySchema('color')

// Validate value
const isValid = validatePropertyValue('color', 'exact', '#ff0000')

// Get options
const options = getPropertyOptions('color', 'preset')
```

## Adding New Properties

1. **Create property file with schema**:

```typescript
// values/appearance/z-index.ts
import { PropertySchema } from "../../types/schema"

export const zIndexSchema: PropertySchema = {
  name: 'zIndex',
  description: 'Layer stacking order',
  supports: ['empty', 'inherit', 'exact'] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: any) => typeof value === 'number' && Number.isInteger(value)
  }
}
```

2. **Add to `schemas/index.ts`**:

```typescript
import { zIndexSchema } from '../values/appearance/z-index'

export const PROPERTY_SCHEMAS = {
  // ... existing schemas
  zIndex: zIndexSchema,
} as const
```

Done. Property is now integrated.

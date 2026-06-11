import { ExportOptions, FileToExport } from "../../../types"

/**
 * Generates a comprehensive README.md file with instructions for using Seldon components
 */
export function generateReadmeFile(options: ExportOptions): FileToExport {
  const content = `# Seldon Components

version: Public Alpha

This guide will help you understand how to use these components in your React application.

## Overview

Seldon components follow a consistent pattern that makes them easy to use and customize. Each component has:

- **Props interface**: Defines all available props with TypeScript types
- **Function signature**: Shows which props have defaults and which are conditional
- **Conditional rendering**: Some elements only render when explicitly provided
- **Slot suppression**: Pass \`null\` for any element prop to remove that element
- **Style integration**: Built-in CSS classes with customization options

## Component Structure

### Basic Usage

Every Seldon component can be used in these ways:

\`\`\`tsx
// 1. Minimal rendering (only container elements with defaults render)
<CardProduct />

// 2. Partial customization (add specific content elements)
<CardProduct 
  tagline={{ children: "New Product" }}
  titleProps={{ children: "Custom Title" }}
/>

// 3. Full customization (provide all props including buttons and icons)
<CardProduct
  tagline={{ children: "Featured", className: "custom-tagline" }}
  titleProps={{ children: "Premium Product" }}
  description={{ children: "Product description here" }}
  button={{ onClick: () => alert("Clicked!") }}
  icon={{ icon: "material-star" }}
  label={{ children: "Buy Now" }}
/>
\`\`\`

### Understanding Conditional vs Always-Rendered Elements

Components have two types of elements:

#### Default Elements
These elements have default values and render by default. Pass \`null\` to remove one:

\`\`\`tsx
// These elements render because they have defaults in the function signature
<CardProduct />  // textblockDetails and buttonBar will render with default content

<CardProductInline 
  // Only textblockDetails and buttonBar have defaults and render by default
  tagline={{ children: "Custom tagline" }}  // Will render with custom content
  buttonBar={null}                          // Suppressed: will not render
/>
\`\`\`

#### Conditionally-Rendered Elements
These elements only appear when you explicitly provide them with meaningful content:

\`\`\`tsx
// These elements only render when you pass their prop. Omit a prop to skip it.
<CardProductInline
  button2={{ onClick: () => alert("Button 2!") }}  // Will render
  button7={{ onClick: () => alert("Button 7!") }}  // Will render
  tagline={{ children: "My Tagline" }}             // Will render
  titleProps={{ children: "My Title" }}            // Will render
  // button3 is omitted, so it does not render
/>
\`\`\`

**Key Rule**: Elements without defaults in the function signature render only when you pass their prop. The render guard is a truthy check, so even an empty object (\`button3={{}}\`) renders the element with its default content. To skip an element, omit its prop entirely. Elements with defaults render unless you pass \`null\` for their prop.

## Function Signatures Guide

The function signature tells you which props are conditional:

\`\`\`tsx
export function CardProductInline({
  textblockDetails = sdn.textblockDetails,  // ✅ Rendered by default (pass null to remove)
  tagline,                                  // ⚠️  Conditional (no default)
  button2,                                  // ⚠️  Conditional (no default)
  buttonBar = sdn.buttonBar,                // ✅ Rendered by default (pass null to remove)
  button4,                                  // ⚠️  Conditional (no default)
  // ...
}: CardProductInlineProps)

export function CardProduct({
  textblockDetails = sdn.textblockDetails,  // ✅ Rendered by default (pass null to remove) 
  tagline,                                  // ⚠️  Conditional (no default)
  titleProps,                               // ⚠️  Conditional (no default)
  description,                              // ⚠️  Conditional (no default)
  buttonBar = sdn.buttonBar,                // ✅ Rendered by default (pass null to remove)
  // ...
}: CardProductProps)
\`\`\`

**Key Pattern**: Elements with \`= sdn.something\` have defaults and render unless you pass \`null\`. Elements without defaults are conditional and render only when you pass their prop.

## Common Patterns

### 1. Customizing Text Content

\`\`\`tsx
<CardProduct 
  tagline={{ children: "Limited Time Offer" }}
  titleProps={{ children: "Premium Headphones", htmlElement: "h2" }}
  description={{ children: "High-quality audio experience." }}
/>
\`\`\`

### 2. Adding Interactive Elements

\`\`\`tsx
<CardProductInline
  button={{ onClick: () => window.open("/product/123") }}
  icon={{ icon: "material-shoppingCart" }}
  label={{ children: "Add to Cart" }}
  button2={{ onClick: () => setFavorite(true) }}
  icon2={{ icon: "material-favorite" }}
  label2={{ children: "Save" }}
  tagline={{ children: "Featured Product" }}
  titleProps={{ children: "Product Name" }}
/>
\`\`\`

### 3. Custom Styling

\`\`\`tsx
<CardProductMixed
  className="my-custom-card"
  tagline={{ 
    children: "New Release",
    className: "highlight-text"
  }}
  style={{ 
    maxWidth: 400,
    margin: "20px auto"
  }}
/>
\`\`\`

### 4. Conditional Features

\`\`\`tsx
function ProductCard({ showActions, isLoggedIn }) {
  return (
    <CardProductInline
      tagline={{ children: "Product Name" }}
      titleProps={{ children: "Product Description" }}
      
      {/* Only show actions if enabled */}
      {...(showActions && {
        button2: { onClick: () => addToCart() },
        icon2: { icon: "material-shoppingCart" },
        label2: { children: "Add to Cart" }
      })}
      
      {/* Only show favorites if logged in */}
      {...(isLoggedIn && {
        button7: { onClick: () => toggleFavorite() },
        icon7: { icon: "material-favorite" },
        label7: { children: "Save" }
      })}
    />
  )
}
\`\`\`

## Icon System

Seldon components use Material Icons by default. Common icons include:

- \`material-add\` - Plus sign
- \`material-favorite\` - Heart
- \`material-shoppingCart\` - Shopping cart
- \`material-arrowForward\` - Right arrow
- \`material-star\` - Star
- \`material-check\` - Checkmark

\`\`\`tsx
<CardProduct 
  icon={{ icon: "material-star" }}
  icon2={{ icon: "material-favorite" }}
  icon3={{ icon: "material-shoppingCart" }}
/>
\`\`\`

## Styling Integration

### CSS Classes

Every component includes CSS classes for styling:

\`\`\`css
/* Base component styles (default variant) */
.sdn-card-product { /* Base card styles */ }
.sdn-button { /* Base button styles */ }
.sdn-tagline { /* Base tagline styles */ }

/* Named variant styles */
.sdn-button-iconic { /* A "iconic" button variant */ }

/* Instance styles (variant class + -- + short hash) */
.sdn-button-iconic--abc12 { /* A specific button instance */ }
.sdn-textblock-details--njjv0 { /* A specific text block instance */ }
\`\`\`

### Custom Styling

You can override styles in several ways:

\`\`\`tsx
// 1. Component-level className
<CardProduct className="my-custom-card" />

// 2. Element-level className  
<CardProduct 
  tagline={{ 
    children: "Featured",
    className: "featured-tag"
  }}
/>

// 3. Inline styles
<CardProduct 
  style={{ backgroundColor: "#f0f0f0" }}
  tagline={{
    children: "Special",
    style: { color: "red", fontWeight: "bold" }
  }}
/>

// 4. Using theme variables for consistent styling
<CardProduct 
  style={{ 
    backgroundColor: "hsl(var(--sdn-swatch-background))",
    border: "1px solid hsl(var(--sdn-swatch-seldon-blue))"
  }}
  tagline={{
    children: "Themed Content",
    style: { 
      color: "hsl(var(--sdn-swatch-seldon-red))",
      fontSize: "var(--sdn-font-size-medium)"
    }
  }}
/>
\`\`\`

#### Design Tokens via Theme Variables

The exported stylesheets include CSS design tokens (theme variables) that you can use for consistent theming across your application. This can be useful for integrating Seldon components with existing components.

The default \`seldon\` theme uses bare \`--sdn-\` variables and ships as \`styles-seldon.css\`. Every other theme uses a \`--sdn-{slug}-\` prefix and ships as \`styles-{slug}.css\`, for example \`--sdn-seldon-red-swatch-primary\` in \`styles-seldon-red.css\`:

\`\`\`css
/* Available theme variables include: */
:root {
  /* Colors */
  --sdn-swatch-background: /* Dynamic background color */
  --sdn-swatch-primary: /* Primary brand color */
  --sdn-swatch-seldon-red: /* Custom brand colors */
  --sdn-swatch-seldon-blue: /* Custom brand colors */
  --sdn-swatch-tint-1: /* Harmony-based palette colors */
  --sdn-swatch-complement1: /* Harmony-based palette colors */
  
  /* Typography */
  --sdn-font-size-small: /* Consistent font sizes */
  --sdn-font-size-medium: /* Consistent font sizes */
  --sdn-font-family-primary: /* Brand typography */
  
  /* Spacing */
  --sdn-margin-tight: /* Consistent spacing */
  --sdn-padding-cozy: /* Consistent spacing */
  --sdn-gap-comfortable: /* Consistent spacing */
}
\`\`\`

\`\`\`tsx
// Use theme variables in your existing components for consistency
function MyExistingButton({ children, ...props }) {
  return (
    <button 
      style={{
        backgroundColor: "hsl(var(--sdn-swatch-primary))",
        color: "hsl(var(--sdn-swatch-background))",
        fontSize: "var(--sdn-font-size-medium)",
        padding: "var(--sdn-padding-cozy)",
        fontFamily: "var(--sdn-font-family-primary)"
      }}
      {...props}
    >
      {children}
    </button>
  )
}

// Your existing components will now match Seldon component styling
<div>
  <CardProduct tagline={{ children: "Seldon Card" }} />
  <MyExistingButton>Matching Button</MyExistingButton>
</div>
\`\`\`

**Benefits of using theme variables:**
- Consistent visual design across all components
- Automatic updates when themes change
- Easy integration with existing component libraries
- Responsive design support with dynamic color harmonies

## TypeScript Support

All components are fully typed. Each component and its props interface are exported from their own file under the matching level folder (for example \`elements/Button.tsx\`, \`parts/CardProduct.tsx\`). Import them by path:

\`\`\`tsx
import { CardProduct, CardProductProps } from './parts/CardProduct'
import { ButtonProps } from './elements/Button'

function CustomProduct(props: CardProductProps) {
  const buttonConfig: ButtonProps = {
    onClick: () => alert("Custom action!"),
    className: "custom-button"
  }
  
  return <CardProduct {...props} button={buttonConfig} />
}
\`\`\`

## Best Practices

### 1. Start Simple
Begin with minimal props and gradually add customizations:

\`\`\`tsx
// Start with this (only default container elements render)
<CardProduct />

// Then add content
<CardProduct 
  tagline={{ children: "My Product" }}
  titleProps={{ children: "Custom Title" }}
/>

// Finally, full customization
<CardProduct 
  tagline={{ children: "My Product" }}
  titleProps={{ children: "Custom Title" }}
  button={{ onClick: handleClick }}
  icon={{ icon: "material-star" }}
  label={{ children: "Buy Now" }}
/>
\`\`\`

### 2. Use Conditional Rendering Wisely
Only pass props for conditional elements when you want them to appear. Omit the prop to skip the element:

\`\`\`tsx
// ❌ Don't do this (empty objects still render the element with default content)
<CardProductInline button2={{}} button3={{}} />

// ✅ Do this (pass meaningful content, omit what you don't need)
<CardProductInline 
  button2={{ onClick: handleAction }}
  icon2={{ icon: "material-star" }}
  label2={{ children: "Action" }}
/>
\`\`\`

### 3. Leverage Container Defaults
Take advantage of the always-rendered containers (textblockDetails, buttonBar):

\`\`\`tsx
// This gets you the full layout structure with custom content
<CardProduct 
  tagline={{ children: "My Custom Title" }}
  description={{ children: "My description" }}
/>
\`\`\`

### 4. Maintain Accessibility
Always provide meaningful labels and ARIA attributes:

\`\`\`tsx
<CardProduct 
  button={{ 
    onClick: handlePurchase,
    "aria-label": "Purchase this product",
    title: "Click to buy now"
  }}
  label={{ children: "Buy Now" }}
/>
\`\`\`

## Troubleshooting

### Elements Not Rendering
- Check if the element has a default value in the function signature (look for \`= sdn.something\`)
- Elements without defaults render only when you pass their prop; omit the prop to skip the element
- Elements with defaults render unless you pass \`null\` for their prop
- **Note**: the render guard is a truthy check, so even \`tagline={{}}\` renders the element with its default content
- For buttons, make sure to provide the button prop itself, plus icon and label if needed
- Verify that required nested props are included (e.g., \`children\` for labels, \`icon\` for icons)

### Styling Issues
- Import \`styles.css\` and each \`styles-{slug}.css\` file your workspace exports
- Check CSS class conflicts with your existing styles
- Use browser dev tools to inspect generated class names (instance classes end with a short hash like \`sdn-button-iconic--abc12\`)

### TypeScript Errors
- Ensure you're importing the correct prop interfaces
- Check that all required properties are provided
- Use optional chaining for nested props: \`button?.onClick\`
- Remember that an empty object \`{}\` is truthy, so it still renders the element; omit the prop to skip it

## Getting Help

Your exported components include:
- \`Fonts.tsx\` - Font loading component  
- \`styles.css\` - Reset, base, and component styles
- \`styles-{slug}.css\` - Theme token variables, one file per workspace theme
- Individual component files with full TypeScript definitions

For more information about Seldon, visit [github.com/SeldonDigital/seldon](https://github.com/SeldonDigital/seldon)
`

  return {
    path: `${options.output.componentsFolder}/README.md`,
    content: content,
  }
}

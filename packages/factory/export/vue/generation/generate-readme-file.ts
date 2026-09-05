import type { ExportOptions, FileToExport } from "../../types"

/**
 * Writes the package README for a Vue export. The examples use the Vue slot
 * contract: `className`, per-slot props, `null` to suppress, and `seldonRefs`.
 */
export function generateReadmeFile(options: ExportOptions): FileToExport {
  const content = `# Seldon Components

This guide covers the Vue components this export wrote.

## Overview

Each component is a single-file component with typed props.

- \`className\` joins with the generated variant class
- Schema slots render by default. Pass \`null\` to hide one
- Optional slots stay hidden until you pass props or a matching \`seldonRefs\` entry
- Styles come from the generated CSS classes and theme files

## Basic usage

Import a component from its level folder.

\`\`\`vue
<script setup lang="ts">
import CardProduct from "./parts/CardProduct.vue"
</script>

<template>
  <CardProduct />
</template>
\`\`\`

Override a slot by passing an object. Hide a schema slot with \`null\`.

\`\`\`vue
<template>
  <CardProduct
    :text-tagline="{ children: 'New Product' }"
    :text-title="{ children: 'Custom Title' }"
    :description="{ children: 'Product description here' }"
    :button="{ onClick: () => alert('Clicked!') }"
    :icon="{ icon: 'material-star' }"
    :text-label="{ children: 'Buy Now' }"
    :button2="null"
  />
</template>
\`\`\`

## Schema slots and optional slots

Schema slots come from the component schema. They have defaults and render unless you pass \`null\`.

\`\`\`vue
<template>
  <CardProduct />
  <CardProduct :text-tagline="{ children: 'Custom tagline' }" :bar="null" />
</template>
\`\`\`

Optional slots were added in the workspace outside the schema. They stay hidden until you pass their prop or address them through \`seldonRefs\`.

\`\`\`vue
<template>
  <CardProduct
    :button4="{ onClick: () => alert('Extra action!') }"
    :icon4="{ icon: 'material-favorite' }"
  />
</template>
\`\`\`

An empty object is enough to show an optional slot with its default content. Omit the prop to keep the slot hidden. Pass \`null\` to hide a schema slot.

## Drive slots by ref

Components that compose children declare \`seldonRefs\`. Keys are the \`data-seldon-ref\` names on descendants. The merge helpers apply a matching entry after the slot prop.

\`\`\`vue
<script setup lang="ts">
import CardProduct from "./parts/CardProduct.vue"

const seldonRefs = {
  textTitle: { children: "Override by ref" },
}
</script>

<template>
  <CardProduct :seldon-refs="seldonRefs" />
</template>
\`\`\`

A \`null\` slot prop still hides the slot even when a ref entry exists.

Named Vue slots appear on empty frames that carry a ref. Use the ref name as the slot name to inject content there.

\`\`\`vue
<template>
  <CardProduct>
    <template #extraRegion>
      <MyContent />
    </template>
  </CardProduct>
</template>
\`\`\`

## Common patterns

### Text

\`\`\`vue
<template>
  <CardProduct
    :text-tagline="{ children: 'Limited Time Offer' }"
    :text-title="{ children: 'Premium Headphones' }"
    :description="{ children: 'High-quality audio experience.' }"
  />
</template>
\`\`\`

### Actions

\`\`\`vue
<template>
  <CardProduct
    :button="{ onClick: () => window.open('/product/123') }"
    :icon="{ icon: 'material-shoppingCart' }"
    :text-label="{ children: 'Add to Cart' }"
    :button2="{ onClick: () => setFavorite(true) }"
    :icon2="{ icon: 'material-favorite' }"
    :text-label2="{ children: 'Save' }"
  />
</template>
\`\`\`

### Class names

Pass \`className\` on the root or on a slot. Target a node by \`data-seldon-ref\` or by a class you pass in. Generated instance class names change when styles merge or split.

\`\`\`vue
<template>
  <CardProduct
    class-name="my-custom-card"
    :text-tagline="{ children: 'New Release', className: 'highlight-text' }"
  />
</template>
\`\`\`

### Conditional slots

\`\`\`vue
<script setup lang="ts">
const showActions = true
const isLoggedIn = false
const extraRefs = isLoggedIn
  ? {
      button4: { onClick: () => toggleFavorite() },
      icon4: { icon: "material-favorite" },
    }
  : undefined
</script>

<template>
  <CardProduct
    :text-tagline="{ children: 'Featured Product' }"
    :text-title="{ children: 'Product Name' }"
    :bar="showActions ? undefined : null"
    :seldon-refs="extraRefs"
  />
</template>
\`\`\`

## Icons

Pass an icon id on the icon slot. Common ids include \`material-add\`, \`material-favorite\`, \`material-shoppingCart\`, \`material-arrowForward\`, \`material-star\`, and \`material-check\`.

\`\`\`vue
<template>
  <CardProduct
    :icon="{ icon: 'material-star' }"
    :icon2="{ icon: 'material-favorite' }"
    :icon3="{ icon: 'material-shoppingCart' }"
  />
</template>
\`\`\`

The export ships one \`Icon.vue\` renderer and geometry in \`icons/index.ts\`.

## Styles

Import \`styles.css\` and each \`styles/{slug}.css\` file this export wrote.

\`\`\`css
.sdn-card-product {
}
.sdn-button {
}
.sdn-button-iconic {
}
.sdn-button-iconic--abc12 {
}
\`\`\`

The default \`seldon\` theme uses bare \`--sdn-\` variables in \`styles/seldon.css\`. Every other theme uses a \`--sdn-{slug}-\` prefix in \`styles/{slug}.css\`.

\`\`\`css
:root {
  --sdn-swatch-background: /* background color */
  --sdn-swatch-primary: /* brand color */
  --sdn-font-size-medium: /* font size step */
  --sdn-font-family-primary: /* brand typeface */
  --sdn-padding-cozy: /* padding step */
  --sdn-gap-comfortable: /* gap step */
}
\`\`\`

Use those variables in your own CSS. Select a node by \`data-seldon-ref\` or by a class you pass in.

## TypeScript

Each file uses \`defineProps\` with typed slots. Import the component from its path.

\`\`\`ts
import CardProduct from "./parts/CardProduct.vue"
import type { SeldonRefs } from "./utils/class-names"
\`\`\`

## Fonts

Mount \`Fonts.vue\` once in the app when the export ran with remote fonts enabled.

\`\`\`vue
<script setup lang="ts">
import Fonts from "./Fonts.vue"
</script>

<template>
  <Fonts />
</template>
\`\`\`

Local and system families need no host link. Remote families only emit links when \`enableRemoteFonts\` is on.

## Troubleshooting

### A slot does not render

Check whether the slot is a schema slot or an optional slot. Schema slots render unless you pass \`null\`. Optional slots render only when you pass props or a matching \`seldonRefs\` entry. An empty object still shows the slot with its default content.

### Styles look wrong

Import \`styles.css\` and each theme file. Check for class conflicts with your own CSS. Target a node by \`data-seldon-ref\` or by a class you pass in.

### Types fail

Import from the matching level folder. Slot props are objects or \`null\`. Use \`seldonRefs\` for overrides keyed by \`data-seldon-ref\`.

## Files this export writes

- \`Fonts.vue\` loads remote font host links
- \`styles.css\` holds reset, base, and component rules
- \`styles/{slug}.css\` holds theme token variables
- \`utils/class-names.ts\` holds \`combineClassNames\`, \`mergeSlot\`, and \`mergeOptionalSlot\`
- Each component file is a typed single-file component

For more about Seldon, visit [github.com/SeldonDigital/seldon](https://github.com/SeldonDigital/seldon)
`

  return {
    path: `${options.output.componentsFolder}/README.md`,
    content,
  }
}

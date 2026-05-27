# Seldon · Workspace

This document specifies the serialized JSON format of a Seldon Workspace file. It serves as a stable reference for serialization, deserialization, migration, and third-party tooling.

**File format specification version:** 0.0.000
**Content type**: `application/json`

---

## Workspace Structure

At its core, a Seldon workspace file is a collection of JSON keys containing data objects. While JSON key order is not semantically significant, the workspace file should be serialized using the key order shown below for consistency and readability. 

```json
{
  "metadata": { },
  "components": { },
  "nodes": { },
  "themes": { },
  "font-collections": { },
  "icon-sets": { },
  "media": { }
}
```

ComponentEntry keys are camelCase slugs unique across the workspace, referencing their source data found throughout `core/`.


| Key | Description | ID Pattern |
| --- | --- | --- |
| `metadata` | File-level metadata: migration version, ownership, optional notices, and other fields tied to the overall workspace. |  |
| `components` | Catalog index for all row kinds (`component`, `playground`, `theme`, `font-collection`, `icon-set`, `media`). Each row shares fields like `type` and `variants`; see **Components** below. | `{componentKey}` |
| `nodes` | Playgrounds, components, variants, and instances all keyed by stable ids. | `playground-{componentKey}-{suffix}`, `component-{componentKey}-{suffix}` |
| `themes` | Theme definitions displayed using sample components. These are made available in all editor theme menus, and are described in detail below. | `theme-{componentKey}-{suffix}` |
| `font-collections` | Font collection choices: families, references, licensing, and related data. These are made available in all editor font menus, and are described in detail below. | `font-collection-{componentKey}-{suffix}` |
| `icon-sets` | Icon set choices: definitions, SVG payloads or references, and licensing. These are made available in all editor icon menus, and are described in detail in the Icon Sets section below. | `icon-set-{componentKey}-{suffix}` |
| `media` | Media choices: assets, licensing, and external links. These are made available in all editor content fields, and are described in detail in the Media section below. | `media-{componentKey}-{suffix}` |

---

### Catalog alignment

Every **`node`** marked with **`type: "default"`**, every **`theme`** with **`type: "default"`**, and the **first** entry in each board’s **`variants`** array always match the schemas from the catalog.

**All structure** must match the catalog, including nested **`children`** on component catalog rows, theme tokens defined by stock templates, and resource variant lists for font-collection, icon-set, and media boards. 

You cannot add, remove, or reorder structural data relative to the catalog baseline. This includes rewiring the default variant’s **`children`** graph, deleting the default row, or moving the default variant off index **`0`** in **`variants`**. 

A serialized workspace file may diverge only through specified **overrides** on node or theme entries, or catalog row fields that are marked as editor-only or display-only, such as **`componentProperties`**.

Full customization beyond overrides is done with **`variants`** -- a **`node`** with **`type: "variant"`** or **`type: "instance"`**, new boards, and **`duplicate_component`** flows—see **Variant Node**, **Instance Node**, **Variant Theme**, and catalog row paste rules below.

---

### An example

```json
{
  "metadata": { "...": "..." },
  "components": {
    "searchResults": { "...": "..." },
    "productListing": { "...": "..." },
    "button": { "...": "..." },
    "calendar": { "...": "..." },
    "searchField": { "...": "..." },
    "productCard": { "...": "..." },
    "seldonTheme": { "...": "..." },
    "skyBlue": { "...": "..." },
    "seldonFonts": { "...": "..." },
    "googleFonts": { "...": "..." },
    "seldonIcons": { "...": "..." },
    "googleMaterial": { "...": "..." },
    "ibmCarbon": { "...": "..." },
    "seldonMedia": { "...": "..." },
    "adobeStockMedia": { "...": "..." }
  },
  "nodes": {
    "playground-searchResults-default": { "...": "..." },
    "playground-searchResults-7kXmPq2R": { "...": "..." },
    "playground-productListing-default": { "...": "..." },
    "component-button-default": { "...": "..." },
    "component-button-7f3a9c12": { "...": "..." },
    "component-button-2d8e1b44": { "...": "..." },
    "component-calendar-default": { "...": "..." },
    "component-calendar-9c0a4f31": { "...": "..." },
    "component-calendar-1e6b22a8": { "...": "..." },
    "component-searchField-default": { "...": "..." },
    "component-productCard-default": { "...": "..." }
  },
  "themes": {
    "theme-seldonTheme-default": { "...": "..." },
    "theme-skyBlue-default": { "...": "..." },
    "theme-skyBlue-4b1c0e2a": { "...": "..." },
    "theme-skyBlue-6d903c11": { "...": "..." }
  },
  "font-collections": {
    "font-collection-seldonFonts-default": { "...": "..." },
    "font-collection-googleFonts-default": { "...": "..." },
    "font-collection-googleFonts-3a7f0c9e": { "...": "..." },
    "font-collection-googleFonts-8e22d501": { "...": "..." }
  },
  "icon-sets": {
    "icon-set-seldonIcons-default": { "...": "..." },
    "icon-set-googleMaterial-default": { "...": "..." },
    "icon-set-googleMaterial-5c11a0b2": { "...": "..." }
  },
  "media": {
    "media-seldonMedia-default": { "...": "..." },
    "media-adobeStockMedia-default": { "...": "..." },
    "media-adobeStockMedia-8e12v0s2": { "...": "..." }
  }
}
```

---

## Metadata

Metadata describes the **workspace file as a whole**: who it belongs to, how it is labeled, which migration version it expects, when it was last updated, and optional **intent**, **tags**, and **licensing** information for discovery, auditing, and compliance. It supports loading and collaboration without duplicating the design data that boards and the other top-level sections hold.

Metadata does not define components, themes, font collections, icon sets, or media. That structure lives in `components`, as well as in `nodes`, `themes`, `font-collections`, `icon-sets`, and `media`.

Programs change each metadata field with its own action: `set_workspace_owner`, `set_workspace_label`, `set_workspace_version`, `set_workspace_last_update`, `set_workspace_intent`, `set_workspace_tags`, `set_workspace_license`.


| Field | Type | Description |
| --- | --- | --- |
| `owner` | `string` | Party that owns this workspace. Typical values are account ids or organization ids. |
| `label` | `string` | Display name for the workspace. |
| `version` | `number` | Migration or schema version used when loading older files. See [Migration](#migration). Required. |
| `lastUpdate` | `string` | Optional ISO-8601 timestamp of the last save. |
| `intent` | `string` | Optional short description of the workspace purpose. |
| `tags` | `string[]` | Optional labels for search or filtering. |
| `license` | `object` | Optional workspace-level licensing metadata. |


```json
{
  "metadata": {
    "owner": "abc-org",
    "label": "Product ABC Workspace",
    "version": 3,
    "lastUpdate": "2026-04-14T12:00:00.000Z",
    "license": {
      "spdx": "OFL-1.1",
      "termsUrl": "https://example.com/terms",
      "attribution": "ABC Corp."
    },
    "intent": "...",
    "tags": [ "...", "...", "..." ]
  },
  "components": { },
  "nodes": { },
  "themes": { },
  "font-collections": { },
  "icon-sets": { },
  "media": { }
}
```

---

## Components

Components are the organizational index of the workspace used to render, export, or otherwise collect a set of data needed to create each object type and variants. Each catalog row references data that is stored in one of the other top-level workspace sections: `nodes`, `themes`, `font-collections`, `icon-sets`, or `media`.

Components do not hold data directly. They only index the information needed to define an object, including which default theme applies.

Programs change catalog row header fields with `set_component_label`, `set_component_intent`, `set_component_tags`, `set_component_license`, `set_component_author`, `set_component_credentials`, `set_component_preview`, `set_component_editor_data`, and use `set_component_properties`, `reset_component_property`, and `set_component_theme` for catalog row layout, preview frame, and default theme on the catalog row.

### Component types

There are six catalog row types:


| Component type | Description | Example rows |
| --- | --- | --- |
| `component` | A component based on a `core/components/` component schema. Only one catalog row is used per component, with variants and instances of that component stored as references from `nodes`. | `button`, `searchField`, `productCard`, `calendar` |
| `playground` | A playground is used for mockups and prototyping. Playgrounds are excluded from the factory export flow to allow flexibility in design exploration. | `searchResults`, `productListing` |
| `theme` | A theme definition including its design tokens. A base `seldonTheme` theme defined in the workspace is initially created from `core/themes/` and is non-deletable. | `seldonTheme`, `skyBlue` |
| `font-collection` | A set of fonts, including font families, weights, and emphasis. A base `seldonFonts` font collection in the workspace is initially created from `core/font-collections/` and is non-deletable. | `seldonFonts`, `googleFonts` |
| `icon-set` | A set of icons, with all icons in that set created using SVG. A base `seldonIcons` set defined in the workspace is initially created from `core/icon-sets/` and is non-deletable. | `seldonIcons`, `googleMaterial`, `ibmCarbon` |
| `media` | Media assets and variants that include images, video, or 3D content. A base `seldonMedia` set defined in the workspace is initially created from `core/media/` and is non-deletable. | `seldonMedia`, `adobeStockMedia` |

---

#### Component catalog row (`type: "component"`)

Component catalog rows are the primary catalog row type, and are used by the code factory to export the resulting code that will be used in production. There is exactly one catalog row per component schema, although each component catalog row can have as many variants as needed.

It is important to note that component catalog rows do not attempt to store node properties directly, only referencing them in the structure. By avoiding property data in boards, it is easier to maintain a tree structure using various nodes as needed by the design within this workspace. 

The result of this is that an editor's object panel will display and edit all component trees with a direct 1:1 interface.

| Field | Type | Description |
| --- | --- | --- |
| `type` | `string` | `component` |
| `level` | `string` | Identifies the atomic level of the component as one of `screen`, `module`, `part`, `element`, `primitive`, or `frame` based on its catalog schema. |
| `catalogId` | `string` | Identifies what `core/components/` schema this catalog row uses. |
| `label` | `string` | Display name for the component. |
| `author` | `string` | Party that created this component. Typical values are account ids or organization ids. |
| `intent` | `string` | Optional short description of the component's purpose. This field is useful for LLMs and agentic AIs, so be sure to fill this out with an appropriate level of detail. |
| `tags` | `string[]` | Optional labels for search or filtering. |
| `license` | `object` | Optional component licensing metadata. |
| `componentTheme` | `ThemeInstanceId` | The theme applied to this catalog row and inherited by its variants. The `componentTheme` field influences exported output by supplying a theme when no theme has been assigned to a variant. The `componentTheme` defaults to `seldonTheme`. |
| `componentProperties` | `Properties` | Overrides on the editor board shell from `core/components/boards/Board.schema.ts`. Includes the `board` compound for device preset and viewport width and height. These do not affect exported code or how components are rendered in production. |
| `variants` | `{ "id", "children"? }` | An ordered array of variant entries belonging to this catalog row appearing top to bottom, along with their nested children. (See the **Nodes section** below.) The first entry is always the **default variant**. See **Default catalog alignment** (Workspace Structure). |
| `__editor` | `object` | Optional editor-only metadata for this component. |

The **default variant** entry’s **`children`** tree must stay **catalog-aligned** (see **Default catalog alignment** above). Customize the shipped look of the default through the **`nodes`** row keyed by that variant’s **`id`**: **`overrides`** on the default node apply on top of the component schema baseline and affect every variant or instance that inherits from that default; clearing those overrides restores catalog defaults for that subtree.

When placing or pasting a component from another workspace, the rules are:

1. **Same `id`, same payload** — If every pasted `id` already exists in `nodes` and its nested `children` match the workspace, only update catalog row references to those ids; do not duplicate entries in `nodes`.
2. **Same `id`, different payload** — If a pasted subtree reuses an `id` but `children` differ, merge the pasted definition into the existing `nodes` entry (resolve conflicts like a normal code merge); never store two entries with the same `id`.
3. **New or unknown ids** — Otherwise add or fork nodes as needed: create default, variant, and instance entries in `nodes` (new ids where the source id is absent or would collide), then wire the board’s variant tree to those entries.

```json
"components": {
  "button": {
    "type": "component",
    "level": "element",
    "catalogId": "button",
    "label": "Buttons",
    "author": "Seldon Digital",
    "intent": "...",
    "tags": [ "...", "...", "..." ],
    "license": { /* SPDX, termsUrl, attribution */ },
    "componentTheme": "seldonTheme",
    "componentProperties": { /* ... properties */ },
    "variants": [
      { /* Default button variant. Based on: core/components/elements/Button.schema.ts */
        "id": "component-button-default",
        "children": [
          { "id": "component-icon-default" },
          { "id": "component-label-aGKJQ7Wr",
            "children": [
              { "id": "component-marker-Rsf23yHq" },
              { "id": "component-text-28fRTw1k" }
            ]
          }
        ]
      },
      { /* An example of an iconic button variant, removing the label. */
        "id": "component-button-7f3a9c12",
        "children": [
          { "id": "component-icon-default" }
        ]
      },
      { /* An example of a textual button variant, removing the icon and marker. */
        "id": "component-button-2d8e1b44",
        "children": [
          {
            "id": "component-label-aGKJQ7Wr",
            "children": [
              { "id": "component-text-28fRTw1k" }
            ]
          }
        ]
      },
      /* ...other button variants */
    ]
  }
}
```

---

#### Playground ComponentEntry

Playground boards are used for prototyping and previewing designs, holding components and their variants to allow users to see components interacting. Playground boards and variants are excluded from factory export. They rely on `display: "exclude"` so generated code skips them.

The playground catalog row structure is currently identical to component catalog rows, except they omit `level`, `catalogId`, `author`, and `license` entries. They are a separate catalog row type so they can evolve independently without affecting component catalog row behavior.

| Field | Type | Description |
| --- | --- | --- |
| `type` | `string` | `playground` |
| `label` | `string` | Display name for the playground. |
| `intent` | `string` | Optional short description of the playground's purpose. |
| `tags` | `string[]` | Optional labels for search or filtering. |
| `componentTheme` | `ThemeInstanceId` | The theme applied to this catalog row and inherited by its variants. The `componentTheme` field influences exported output by supplying a theme when no theme has been assigned to a variant. The `componentTheme` defaults to `seldonTheme`. |
| `componentProperties` | `Properties` | ComponentEntry-level properties used only for visual display in an editor. These do not affect exported code or how components are rendered in production. |
| `variants` | `{ "id", "children"? }` | An ordered array of variant entries belonging to this catalog row appearing top to bottom, along with their nested children. (See the **Nodes section** below.) The first entry is always the **default variant**. See **Default catalog alignment** (Workspace Structure). |
| `__editor` | `object` | Optional editor-only metadata for this playground. |


```json
"components": {
  "searchResults": {
    "type": "playground",
    "label": "Search Results",
    "intent": "...",
    "tags": [ "...", "...", "..." ],
    "componentTheme": "seldonTheme",
    "componentProperties": {
      "display": "exclude",
      /* ... other properties */
    },
    "variants": [
      {
        "id": "playground-searchResults-default",
        "children": [
          { "id": "component-productCard-default" },
          {
            "id": "component-button-aGKJQ7Wr",
            "children": [
              { "id": "component-icon-Rsf23yHq" },
              { "id": "component-label-28fRTw1k"}
            ]
          }
        ]
      }
    ]
  }
}
```

---

#### Theme ComponentEntry

Theme rows hold theme definition variants that reference data in the `themes` section. The base variant ships from `core/themes/` and represents the default theme configuration. It is always present and cannot be deleted. Users can create additional variants for custom theme definitions.

| Field | Type | Description |
| --- | --- | --- |
| `type` | `string` | `theme` |
| `catalogId` | `string` | Identifies what `core/themes/` data this catalog row uses based on its type as `theme`. |
| `label` | `string` | Display name for the theme. |
| `author` | `string` | Party that created this theme. Typical values are account ids or organization ids. |
| `intent` | `string` | Optional short description of the theme's purpose. |
| `tags` | `string[]` | Optional labels for search or filtering. |
| `license` | `object` | Optional theme licensing metadata. |
| `componentPreview` | `string` | The default preview catalog id from `core/themes/` the editor uses to show themes in context. This is not processed in factory export. Editors may override the default with a playground id saved within the workspace. The `componentPreview` defaults to `seldonThemePreview`.|
| `componentTheme` | `ThemeInstanceId` | The theme applied to this catalog row and inherited by its variants. The `componentTheme` field influences exported output by supplying a theme when no theme has been assigned to a variant. The `componentTheme` defaults to `seldonTheme`. |
| `componentProperties` | `Properties` | ComponentEntry-level properties used only for visual display in an editor. These do not affect exported code or how components are rendered in production. |
| `variants` | `{ "id" }` | An ordered array of variant entries belonging to this catalog row appearing top to bottom. (See the **Themes section** below.) The first entry is always the **default variant**. See **Default catalog alignment** (Workspace Structure). |
| `__editor` | `object` | Optional editor-only metadata for this theme. |

```json
"components": {
  "skyBlue": {
    "type": "theme",
    "catalogId": "skyBlue",
    "label": "Sky Blue",
    "author": "Seldon Digital",
    "intent": "...",
    "tags": [ "...", "...", "..." ],
	"componentPreview": "seldonThemePreview",
    "componentTheme": "seldonTheme",
    "componentProperties": { /* ... properties */ },
    "variants": [
      { "id": "theme-skyBlue-default" },
      { "id": "theme-skyBlue-4b1c0e2a" },
      { "id": "theme-skyBlue-6d903c11" },
      /* ...other sky blue variants */
    ]
  }
}
```

---

#### Font Collection ComponentEntry

Font collection rows hold font configuration variants that reference data in the `font-collections` section. The base variant ships from `core/font-collections/` and represents the default font configuration. It is always present and cannot be deleted. Users can create additional variants for custom font selections. Font collection rows may extend the shared catalog row fields with additional metadata. That metadata can include API keys for font services.


| Field | Type | Description |
| --- | --- | --- |
| `type` | `string` | `font-collection` |
| `catalogId` | `string` | Identifies what `core/font-collections/` data this catalog row uses based on its type as `font-collection`. |
| `label` | `string` | Display name for the font collection. |
| `license` | `object` | Optional font collection licensing metadata. |
| `credentials` | `object` | Optional font collection credential metadata. |
| `intent` | `string` | Optional short description of the font collection's purpose. |
| `tags` | `string[]` | Optional labels for search or filtering. |
| `componentPreview` | `string` | The default preview catalog id from `core/font-collections/` the editor uses to show font in context. This is not processed in factory export. Editors may override the default with a playground id saved within the workspace. The `componentPreview` defaults to `seldonFontsPreview`.|
| `componentTheme` | `ThemeInstanceId` | The theme applied to this catalog row and inherited by its variants. The `componentTheme` field influences exported output by supplying a theme when no theme has been assigned to a variant. The `componentTheme` defaults to `seldonTheme`. |
| `componentProperties` | `Properties` | ComponentEntry-level properties used only for visual display in an editor. These do not affect exported code or how components are rendered in production. |
| `variants` | `{ "id" }` | An ordered array of variant entries belonging to this catalog row. The first entry is always the default variant and cannot be edited directly. That default matches the packaged font collection identified by `catalogId`. Variants appear in an editor from top to bottom based on list order. See **Default catalog alignment** (Workspace Structure). |
| `__editor` | `object` | Optional editor-only metadata for this font collection. |


```json
"components": {
  "googleFonts": {
    "type": "font-collection",
    "catalogId": "googleFonts",
    "label": "Google Fonts",
    "license": {
      "spdx": "OFL-1.1",
      "termsUrl": "https://example.com/fonts/terms",
      "attribution": "Google Fonts"
    },
    "credentials": {
      "provider": "Provider Name",
      "apiKey": "..."
    },
    "intent": "...",
    "tags": [ "...", "...", "..." ],
	"componentPreview": "seldonFontsPreview",
    "componentTheme": "seldonTheme",
    "componentProperties": { /* ... properties */ },
    "variants": [
      { "id": "font-collection-googleFonts-default" },
      { "id": "font-collection-googleFonts-3a7f0c9e" },
      { "id": "font-collection-googleFonts-8e22d501" },
      /* ...other font collection variants */
    ]
  }
}
```

---

#### Icon Set ComponentEntry

Icon set boards hold icon set variants that reference data in the `icon-sets` section. The base variant ships from `core/icon-sets/` and represents the full icon set, such as the complete Google Material set. It is always present and cannot be deleted. Users can create additional variants as curated subsets for specific use cases. Examples of subset labels include `mobile` and `japanese`.


| Field | Type | Description |
| --- | --- | --- |
| `type` | `string` | `icon-set` |
| `catalogId` | `string` | Identifies what `core/icon-sets/` data this catalog row uses based on its type as `icon-set`. |
| `label` | `string` | Display name for the icon set. |
| `license` | `object` | Optional icon set licensing metadata. |
| `credentials` | `object` | Optional icon set credential metadata. |
| `intent` | `string` | Optional short description of the icon set's purpose. |
| `tags` | `string[]` | Optional labels for search or filtering. |
| `componentPreview` | `string` | The default preview catalog id from `core/icon-sets/` the editor uses to show font in context. This is not processed in factory export. Editors may override the default with a playground id saved within the workspace. The `componentPreview` defaults to `seldonIconsPreview`.|
| `componentTheme` | `ThemeInstanceId` | The theme applied to this catalog row and inherited by its variants. The `componentTheme` field influences exported output by supplying a theme when no theme has been assigned to a variant. The `componentTheme` defaults to `seldonTheme`. |
| `componentProperties` | `Properties` | ComponentEntry-level properties used only for visual display in an editor. These do not affect exported code or how components are rendered in production. |
| `variants` | `{ "id" }` | An ordered array of variant entries belonging to this catalog row. The first entry is always the default variant and cannot be edited directly. That default matches the packaged icon set identified by `catalogId`. Variants appear in an editor from top to bottom based on list order. See **Default catalog alignment** (Workspace Structure). |
| `__editor` | `object` | Optional editor-only metadata for this icon set. |


```json
"components": {
  "googleMaterial": {
    "type": "icon-set",
    "catalogId": "googleMaterial",
    "label": "Google Material",
    "license": {
      "spdx": "OFL-1.1",
      "termsUrl": "https://example.com/icons/terms",
      "attribution": "Google Material Symbols"
    },
    "credentials": {
      "provider": "Google",
      "apiKey": "..."
    },
    "intent": "...",
    "tags": [ "...", "...", "..." ],
    "componentPreview": "seldonIconsPreview",
    "componentTheme": "seldonTheme",
    "componentProperties": { /* ... properties */ },
    "variants": [
      { "id": "icon-set-googleMaterial-default" },
      { "id": "icon-set-googleMaterial-5c11a0b2" },
      /* ...other icon set variants */
    ]
  }
}
```

---

#### Media ComponentEntry

Media rows hold media assets and variants that reference data in the `media` section. The base variant ships from `core/media/` and represents the default media configuration. It is always present and cannot be deleted. Users can create additional variants for curated media collections. Media rows may extend the shared catalog row fields with additional metadata. That metadata can include licensing keys.


| Field | Type | Description |
| --- | --- | --- |
| `type` | `string` | `media` |
| `catalogId` | `string` | Identifies what `core/media/` data this catalog row uses based on its type as `media`. |
| `label` | `string` | Display name for the media. |
| `license` | `object` | Optional media catalog licensing metadata. |
| `credentials` | `object` | Optional media catalog credential metadata. |
| `intent` | `string` | Optional short description of the media catalog's purpose. |
| `tags` | `string[]` | Optional labels for search or filtering. |
| `componentPreview` | `string` | The default preview catalog id from `core/media/` the editor uses to show font in context. This is not processed in factory export. Editors may override the default with a playground id saved within the workspace. The `componentPreview` defaults to `seldonMediaPreview`.|
| `componentTheme` | `ThemeInstanceId` | The theme applied to this catalog row and inherited by its variants. The `componentTheme` field influences exported output by supplying a theme when no theme has been assigned to a variant. The `componentTheme` defaults to `seldonTheme`. |
| `componentProperties` | `Properties` | ComponentEntry-level properties used only for visual display in an editor. These do not affect exported code or how components are rendered in production. |
| `variants` | `{ "id" }` | An ordered array of variant entries belonging to this catalog row. The first entry is always the default variant and cannot be edited directly. That default matches the packaged media identified by `catalogId`. Variants appear in an editor from top to bottom based on list order. See **Default catalog alignment** (Workspace Structure). |
| `__editor` | `object` | Optional editor-only metadata for this media catalog. |


```json
"components": {
  "adobeStockMedia": {
    "type": "media",
    "catalogId": "adobeStockMedia",
    "label": "Adobe Stock",
    "license": {
      "spdx": "OFL-1.1",
      "termsUrl": "https://example.com/media/terms",
      "attribution": "Adobe Stock Media"
    },
    "credentials": {
      "provider": "Adobe",
      "apiKey": "..."
    },
    "intent": "...",
    "tags": [ "...", "...", "..." ],
    "componentPreview": "seldonMediaPreview",
    "componentTheme": "seldonTheme",
    "componentProperties": { /* ... properties */ },
    "variants": [
      { "id": "media-adobeStockMedia-default" },
      { "id": "media-adobeStockMedia-8e12v0s2" },
      /* ...other media variants */
    ]
  }
}
```

---

## Nodes

The `nodes` object is a flat map of every default, variant, and instance of a component used in component and playground rows. It does not contain data for theme, icon set, font collection, or media. Those resources live in their own top-level workspace sections. 

Node keys are node ID strings and must match each value's `id` field. All metadata and other important information is retrieved from the node template.

It is important to note that nodes do not attempt to create a tree structure. By avoiding tree structure in nodes, it is easier to maintain metadata and property values for all nodes.

The result of this is that an editor's properties panel will display and edit all node data with a direct 1:1 interface, regardless of where in the tree the edit was made.

| Field | Type | Description |
| --- | --- | --- |
| `id` | `string` | Unique node identifier; must equal the key used for this node in the `nodes` map. |
| `type` | `string` | Node type discriminator. One of: `"default"`, `"variant"`, `"instance"`. |
| `level` | `string` | Identifies the atomic level of the component as one of `screen`, `module`, `part`, `element`, `primitive`, or `frame`. This value must match the level value found in its template. |
| `label` | `string` | Display name for the node. |
| `theme` | `ThemeInstanceId` or `null` | The theme used for this node, or `null` to inherit from its parent. |
| `template` | `string` | Where the node gets its metadata, along with its list of **properties** and subsequent default values which are resolved before `overrides` are applied. This value is either `catalog:{ComponentId}` or `node:{nodeId}`. See **Default Node**, **Variant Node**, and **Instance Node** below. |
| `overrides` | `Properties` | Property overrides for this node, which is derived from either `catalog:{ComponentId}` or `node:{nodeId}`. Can be an empty object `{}`. If a property is not declared in the `template`, the overridden value is ignored. |
| `__editor` | `object` | Editor-only metadata. |

When code consults [`rules.mutations.*`](../rules/config/rules.config.ts), index by internal [`Entity`](../rules/types/rule-config-types.ts) keys (`defaultVariant`, `userVariant`, …), not raw `type` strings. Map serialized `EntryNode.type` with [`mapEntryNodeTypeToRulesEntity`](./helpers/rules/map-entry-node-type-to-rules-entity.ts); see [Rules README](../rules/README.md) (Entity vocabulary vs workspace `nodes`).

---

### Default Node

Default rows follow **Default catalog alignment** (Workspace Structure): catalog-true shape; customize the shipped default through **`overrides`** (and **`label`** where editors allow), not by diverging structure from the component schema.

- The **`template`** field is always **`catalog:{ComponentId}`**. This node's properties and defaults are defined by schemas under `core/components/.../ComponentId.schema.ts`, with the default baseline being the result of `template` properties with `overrides` applied on top.

- The **`overrides`** field applies property values on top of catalog baseline; keys not present in `overrides` use `template` defaults. Property keys should generally not appear in `overrides` unless the template definition allows them.

```json
"nodes": {
  "component-button-default": {
    "id": "component-button-default",
    "type": "default",
    "level": "element",
    "label": "Button",
    "theme": null,
    "template": "catalog:button",
    "overrides": {
      "border": {
        "color": { "type": "theme.categorical", "value": "@swatch.custom6" },
        "style": { "type": "preset", "value": "solid" },
        "width": { "type": "preset", "value": "hairline" },
        "preset": { "type": "theme.categorical", "value": "@border.hairline" },
        "opacity": { "type": "exact", "value": { "unit": "%", "value": 100 } },
        "brightness": { "type": "exact", "value": { "unit": "%", "value": 20 } }
      },
      "background": {
        "color": { "type": "theme.categorical", "value": "@swatch.custom6" }
      },
      "buttonSize": { "type": "theme.ordinal", "value": "@fontSize.small" },
      /* ...other property overrides */
    }
  }
}
```

---

### Variant Node

A user-created variant, with `type` set to `"variant"`. Whenever an editor modifies this variant, changes propagate to other variant or instance nodes that reference this one as their template.

- The **`template`** field for variants is always a **`node:{nodeId}`**. This node's properties and defaults are defined by that node, with the variant baseline being the result of `template` properties applied with `template` overrides, then variant `overrides` applied on top. 

- The **`overrides`** field applies property values on top of the `template` baseline; keys not present in `overrides` use `template` defaults. Property keys should generally not appear in `overrides` unless the template definition allows them.


```json
"nodes": {
  "component-button-SXwZYlke": {
    "id": "component-button-SXwZYlke",
    "type": "variant",
    "level": "element",
    "label": "Iconic Button",
    "theme": null,
    "template": "node:component-button-default",
    "overrides": {/* ... property overrides */ }
  }
}
```

---

### Instance Node

An instance is a reference to a default or variant node, used within other nodes, with `type` set to `"instance"`.

Instances allow for deeper customization in larger, more complex components. Custom button styling with contextual text nested inside a calendar or product card is a typical use of an instance. Whenever an editor modifies an instance, it is always modifying this node, which creates the effect of propagating those change to all of the same instance throughout the workspace.

Validation, export, and editors use this node's `template`, not the parent’s.

The **`template`** field then chooses how properties are obtained for the instance:

- **`template`:`catalog:{ComponentId}`**. This node's properties and defaults are defined by schemas under `core/components/../ComponentId.schema.ts`, with the instance being the result of `template` properties with `overrides` applied on top.

```json
"nodes": {
  "component-button-0MgbkNc5": {
    "id": "component-button-0MgbkNc5",
    "type": "instance",
    "level": "element",
    "label": "Simple Button",
    "theme": null,
    "template": "catalog:button",
    "overrides": { /* ... property overrides */ }
  }
}
```

- **`template`:`node:{nodeId}`**. This node's properties and defaults are defined by that node, with the instance being the result of `template` properties applied with `template` overrides, then instance `overrides` applied on top. 

```json
"nodes": {
  "component-button-0MgbkNc5": {
    "id": "component-button-0MgbkNc5",
    "type": "instance",
    "level": "element",
    "label": "Iconic Button",
    "theme": null,
    "template": "node:component-button-7f3a9c12",
    "overrides": { /* ... property overrides */ }
  }
}
```

---

## Themes

The `themes` object is a flat map of all theme and token overrides used within the workspace. A Seldon theme is always present and stored within each workspace, and cannot be removed. Each theme gets its own catalog row, allowing for variants and customization for different themes added to the workspace.

Theme keys are theme ID strings and must match each value's `id` field. All metadata and other important information is retrieved from the theme template.

| Field | Type | Description |
| --- | --- | --- |
| `id` | `string` | Unique node identifier; must equal the key used for this theme in the `themes` map. |
| `type` | `string` | Node type discriminator. One of: `"default"`, `"variant"`. |
| `label` | `string` | Display name for the node. |
| `template` | `string` | Where the theme gets its metadata, along with its list of **tokens** and subsequent default values, which are resolved before `overrides` are applied. This value is either `catalog:{ThemeTemplateId}` or `theme:{themeId}`. See **Default Theme** and **Variant Theme** below. |
| `overrides` | `Tokens` | Token overrides for this theme, which is derived from either `catalog:{ThemeTemplateId}` or `theme:{themeId}`. Can be an empty object `{}`. If a token is not declared in the `template`, the overridden value is ignored. |
| `__editor` | `object` | Editor-only metadata. |

---

### Default Theme

Default rows follow **Default catalog alignment** (Workspace Structure): token shape stays catalog-true; customize through **`overrides`** (and **`label`** where editors allow).

The canonical root for a theme catalog row, with `type` set to `"default"`. Whenever an editor modifies this default theme, changes propagate to other variant themes that reference this one as their template. Default themes are commonly created through adding catalog themes into the workspace.

- The **`template`** field is always **`catalog:{ThemeTemplateId}`**. This node's tokens and defaults are defined by schemas under `core/themes/stock/<theme-template-id>.ts`, with the default baseline being the result of `template` tokens with `overrides` applied on top.

- The **`overrides`** field applies token values on top of catalog baseline; keys not present in `overrides` use `template` defaults. Token keys should generally not appear in `overrides` unless the template definition allows them.

```json
"themes": {
  "theme-skyBlue-default": {
    "id": "theme-skyBlue-default",
    "type": "default",
    "label": "Sky Blue",
    "template": "catalog:skyBlue",
    "overrides": {
      "color": {
        "angle": 16,
        "step": 12,
        "whitePoint": 98,
        "grayPoint": 55,
        "blackPoint": 8,
        "bleed": 12
      },
      /* ... other token overrides */
    }
  }
}
```

---

### Variant Theme

A user-created variant, with `type` set to `"variant"`. Whenever an editor modifies this variant, changes propagate to other variant themes that reference this one as their template.

- The **`template`** field for variants is always a **`theme:{themeId}`**. This node's properties and defaults are defined by that theme, with the variant baseline being the result of `template` properties applied with `template` overrides, then variant `overrides` applied on top. 

- The **`overrides`** field applies token values on top of the `template` baseline; keys not present in `overrides` use `template` defaults. Token keys should generally not appear in `overrides` unless the template definition allows them.

```json
"themes": {
  "theme-skyBlue-4b1c0e2a": {
    "id": "theme-skyBlue-4b1c0e2a",
    "type": "variant",
    "label": "Sky Blue",
    "template": "theme:theme-skyBlue-default",
    "overrides": { /* ... token overrides */ }
  }
}
```

---

## Font Collections

The `font-collections` object contains font collection definitions and configurations referenced by font boards. Structure TBD.

---

## Icon Sets

The `icon-sets` object contains icon set definitions and configurations referenced by icon set boards. Structure TBD.

---

## Media

The `media` object contains media definitions and configurations referenced by media boards. Structure TBD.

---

## Referential Integrity

A valid workspace file must satisfy the following constraints.

### 1. ComponentEntry variant trees resolve to the correct map

For each catalog row, every **`id`** that appears in **`variants`** and, for `component` and `playground` boards, in every nested **`children`** array (recursively), must exist as a **key** in exactly one top-level map, determined by **`boards[componentKey].type`**:

| ComponentEntry `type` | Map that must contain each collected `id` |
| --- | --- |
| `component`, `playground` | `nodes` |
| `theme` | `themes` |
| `font-collection` | `font-collections` |
| `icon-set` | `icon-sets` |
| `media` | `media` |

For `theme`, `font-collection`, `icon-set`, and `media` boards, each entry in **`variants`** is an object **`{ "id" }`** only: it must not use **`children`**. For `component` and `playground` boards, each entry may use **`{ "id", "children"? }`** as documented in the catalog row sections.

Collect ids by walking **`variants`** in order, and for each object that has **`children`**, walk **`children`** in order and continue depth-first until all reachable **`id`** values are visited. Every visited **`id`** must be a key in the map for that board’s `type`.

### 2. Template references resolve inside the right map

Every object that has a **`template`** field uses the form **`{prefix}:{suffix}`**:

- The **`suffix`** must be a **key** in the map implied by **`prefix`**:
  - `catalog:` — suffix is a **catalog id** (component or theme catalog as defined elsewhere in this spec), not necessarily a workspace map key.
  - `node:` — **`suffix`** is a key in **`nodes`**.
  - `theme:` — **`suffix`** is a key in **`themes`**.
  - `font-collection:` — **`suffix`** is a key in **`font-collections`** (when that section is defined).
  - `icon-set:` — **`suffix`** is a key in **`icon-sets`** (when that section is defined).
  - `media:` — **`suffix`** is a key in **`media`** (when that section is defined).

If the **`template`** grammar for a given object type only allows a subset of prefixes (for example, component nodes only use `catalog:` and `node:`), validators must reject any other prefix for that type.

### 3. No illegal cycles

- **`component` / `playground`**: The graph formed by catalog row **`variants`** and nested **`children`**, with edges **parent → child `id`**, must be **acyclic**. The same **`id`** may appear under multiple parents like a shared instance, but there must be no directed cycle when following child links from any root variant entry.
- **`themes`**: The graph formed by **`template: theme:{themeId}`** edges must be **acyclic**. Variant themes inherit from default or other theme entries without cycles.

### 4. JSON object keys are unique within each map

Within each top-level object **`components`**, **`nodes`**, **`themes`**, **`font-collections`**, **`icon-sets`**, and **`media`**, **keys must be unique** for that object. This does **not** forbid the same **`id`** string from appearing multiple times as an **`id` attribute** inside catalog row variant trees: those are references to a **single** catalog entry in the corresponding map. For example, one **`nodes`** entry keyed by that **`id`**.

---

## Naming Conventions

All identifiers in the workspace file follow consistent naming patterns. Subsections follow the same order as top-level keys in [Workspace Structure](#workspace-structure).

### Metadata

The `metadata` object **must** include a `version` key. The value is a non-negative integer migration counter. See [Migration](#migration). Other fields are optional unless noted elsewhere. See the [Metadata](#metadata) section for the full list and meanings.

### Catalog Strings

The `catalogId` field uses camelCase to identify catalog schemas.

Examples: `button`, `icon`, `label`, `text`, `title`, `input`, `frame`, `barTabs`, `barStatus`, `listItemTree`, `sidebar`, `iconSet`, `theme`

### Template Strings

The **`template`** field uses a `{prefix}:{suffix}` combination to identify template references. A `{hash}` is created for variants and is an 8-character alphanumeric string.

Prefix examples: `catalog`, `node`, `theme`, `font-collection`, `icon-set`, or `media`.

Suffix examples: `component-button-default`, `component-button-{hash}`, or `theme-skyBlue-{hash}`

---

## Migration

`metadata.version` is managed by the workspace migration system. When a workspace file is loaded, the migration middleware compares `metadata.version` against the current expected version and applies any necessary migrations sequentially.

Migrations are defined in `packages/core/workspace/middleware/migration/migrations/`. They include versioned migrations that run when the stored version is below the target. They also include always-run migrations that execute on every load for idempotent normalization.

The file format specification version is independent of the internal workspace `metadata.version` number. Field `metadata.version` tracks schema evolution for the migration system. This specification documents the overall structure of the serialized format.
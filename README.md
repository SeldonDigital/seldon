# Seldon

[![License: PolyForm Noncommercial](https://img.shields.io/badge/license-PolyForm%20Noncommercial-blue.svg)](docs/licenses/noncommercial/LICENSE)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)](docs/licenses/contributors/CONTRIBUTING.md)

## 🚀 Overview

Seldon is a design system and component framework that generates production-ready React components from design data. It provides type-safe design tokens, theme management, and automated code generation for building component-driven UIs.

This repository is the **official maintained version** of the Seldon project. While forks may exist, only contributions made through pull requests to this repo will be merged.

## Parts

**Core Engine** (`@seldon/core`): Manages design system architecture with hierarchical components, property computation, and workspace state. Components are organized in 6 levels (Screen → Module → Part → Element → Primitive) with automatic property inheritance and theme integration.

**The Code Factory** (`@seldon/factory`): Transforms design workspaces into production-ready components. Currently, React is the first supported platform, with TypeScript interfaces, optimized CSS, and asset processing. Generates complete component libraries with tree-shaking and theme support.

**Works[ace Editor** (`services/editor`): Application shell providing the interface for creating and managing design workspaces.

## Features

- **Type-safe design tokens** with multiple value types (exact, themes, computed)
- **Hierarchical component system** with automatic property inheritance
- **Theme creation and management** with stock themes and custom theme creation
- **Code generation** for React components with full TypeScript support
- **CSS optimization** with proper cascade ordering and theme variables
- **Asset processing** with tree-shaking for icons and image optimization

---

## Installation

```bash
git clone https://github.com/yourorg/seldon.git
cd seldon
bun install
```

## Usage

```typescript
import { exportWorkspace } from '@seldon/factory'

const files = await exportWorkspace(workspace, {
  target: { framework: 'react', styles: 'css-properties' },
  output: {
    componentsFolder: '/src/components',
    assetsFolder: '/public/assets'
  }
})
```

## Development

```bash
# Generate component catalogs
bun run generate:all

# Run tests
bun run test

# Start editor
cd services/editor && bun dev
```

## License

Dual-licensed under PolyForm Noncommercial License for noncommercial use. Commercial use requires a paid license.

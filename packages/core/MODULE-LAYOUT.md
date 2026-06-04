# Core Module Layout

Each module under `packages/core/` follows one predictable layout. This file states the shared skeleton, the naming rules, and the cases where a module is allowed to differ.

Use this layout when adding a module or when checking an existing module for drift.

## Shared skeleton

A module uses these entries where the concept exists.

| Entry | Role |
| --- | --- |
| `index.ts` | Public barrel. Re-exports the module surface. |
| `types/index.ts` | Type definitions. Split into files, joined by the folder index. |
| `types/<module>-id.ts` | The id union or enum for the module. |
| `constants/index.ts` | Runtime constants and enums. |
| `catalog/index.ts` | The packaged registry of shipped items. |
| `compute/` | Materialization and resolution code. |
| `helpers/` | Pure helper functions. |
| `schemas/` | Schema definitions. |
| `values/` | Value modules. |

A module skips an entry when it has no use for it. For example `workspace/` has no `catalog/` because it does not ship a packaged registry.

## Naming rules

- Use lowercase kebab-case for general modules, such as `theme-id.ts`.
- Put the id union or enum in `types/<module>-id.ts`.
- Name the packaged registry folder `catalog/`.
- Use the `TemplateId` and `InstanceId` pair only for a module that has both a packaged template and a per-workspace instance. `themes` and `font-collections` use this pair. `components` does not, so it keeps a flat `ComponentId` enum.

## Registry folder

The packaged registry is the set of items a module ships. Name this folder `catalog/` in every module that has one.

- `themes/catalog/` holds stock themes.
- `font-collections/catalog/` holds packaged collections.
- `components/catalog/` holds the schema index.

## Sanctioned exceptions

These differences are intentional. Do not normalize them.

- `components/` groups schema files by hierarchy level under `elements/`, `parts/`, `modules/`, `screens/`, `frames/`, `primitives/`, and `boards/`. The component rules require this grouping.
- `workspace/` groups code by action verb under `reducers/`, `services/`, `middleware/`, and `model/`. It exposes a curated `types/index.ts` barrel rather than a single id file, because its id types live with the model.
- `ComponentId` stays an `enum`. It is part of the serialized workspace API. Theme and collection ids stay string-literal unions.

## Why file to folder is safe

`packages/core` resolves with classic node resolution. The editor and factory resolve `@seldon/core/*` through path aliases that point at the source folder. Both resolve a folder index.

So changing `foo.ts` to `foo/index.ts` does not change the import path `@seldon/core/<module>/foo`. Importers need no change. Only the moved file fixes its own relative imports, because its depth grows by one. Renaming a folder, such as `stock/` to `catalog/`, does change the import path, so those importers update.

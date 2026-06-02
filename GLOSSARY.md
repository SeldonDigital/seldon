# Seldon Core · Glossary

This file inventories architectural vocabulary used across `packages/core/`. Use these terms in reducers, helpers, utilities, and documentation.


| Term | Definition |
| --- | --- |
| Catalog | The packaged library Seldon ships in Seldon Core. It holds component schemas, stock themes, font collections, icon sets, and media definitions. Workspaces point into the catalog so defaults and identities stay centralized. |
| Workspace | A workspace is an entire design file. It stores `metadata`, `components`, `nodes`, `themes`, `font-collections`, `icon-sets`, and `media`. Tools load a workspace, run each action through a reducer, and save the result as one design snapshot. |
| Metadata | Metadata holds file-level facts about the workspace file. Examples are owner, label, and migration version. It describes the file itself rather than catalog rows or entry nodes. |
| Catalog row | A catalog row is one entry in `workspace.components`. Row types are `component`, `playground`, `theme`, `font-collection`, `icon-set`, and `media`. Each row lists variant ids and may list nested child node ids on those variants. |
| Component schema | A component schema is the packaged blueprint under `core/components/`. It defines identity, level, default properties, and default child trees. Catalog rows reference a schema through `catalogId`. |
| Component level | Component level ranks how large a building block is, from full screens down to tiny primitives. The level controls which parts may sit inside which parents so complex layouts stay orderly. |
| Frame | A frame is a flexible container level that may hold any other level. Editors use frames when they need grouping and layout without forcing inner pieces to obey the usual strict stacking rules. |
| Entry node | An entry node is one record in `workspace.nodes`. It has `id`, `type`, `level`, `label`, `theme`, `template`, and `overrides`. Types are `default`, `variant`, or `instance`. The node record does not store a `children` array. |
| Default node | A default node has `type: "default"`. Its `template` is always `catalog:{ComponentId}`. It is the canonical root for a component catalog row. |
| Variant node | A variant node has `type: "variant"`. Its `template` is `catalog:{ComponentId}` or `node:{nodeId}`. Editors treat a variant as the baseline for nodes that build on it. |
| Instance node | An instance node has `type: "instance"`. Its `template` is `catalog:{ComponentId}` or `node:{nodeId}`. Instances keep local `overrides` while sharing structure from the template. |
| Variant tree | A variant tree is the nested layout on a catalog row. Each `variants[]` entry may list `children` with node ids. The flat `nodes` map holds the payload for each id. |
| Component properties | Component properties are `componentProperties` on a catalog row. They affect editor display only. They do not change factory export or production rendering. |
| Key | The key name of a `key: value` pair. |
| Value | The value of a `key: value` pair. It may be a plain JSON value or a tagged property cell with a `type` field. |
| Property | A property is a named style or behavior parameter. Each property stores a tagged cell so tools know whether it is empty, inherited, exact, an option, computed, or a theme reference. |
| Atomic property | An atomic property is a top-level style key whose value is a single cell. |
| Compound property | A compound property is a top-level style key that groups related facets, such as border color and border width. |
| Shorthand property | A shorthand property is a top-level style key that applies the same kind of value to several child keys, such as the sides of margin or padding. |
| Layered paint stack | A layered paint stack is an ordered list of paint layers. Common examples are `background`, `gradient`, and `shadow`. |
| Preset facet | A preset facet is the `preset` field on a compound property. It usually holds a theme LOOK reference such as `@font.body`. It is not the same as `ValueType.OPTION`. |
| Built-in look | A built-in look is a reserved theme LOOK injected at compute time. Examples are `@shadow.none` and `@font.normal`. It clears every facet on the compound and appears in the preset picker like stock looks. |
| EMPTY value | An EMPTY value is unset. The platform or merge pipeline may fill it from defaults or inheritance. Wire type is `"empty"`. |
| INHERIT value | An INHERIT value takes the parent component value explicitly. Wire type is `"inherit"`. |
| EXACT value | An EXACT value is a concrete literal such as a color, size, or string. Wire type is `"exact"`. |
| OPTION value | An OPTION value is one choice from a fixed allowed set on the property schema. Wire type is `"option"`. |
| COMPUTED value | A COMPUTED value is derived from other properties through a compute function. Wire type is `"computed"`. |
| THEME_CATEGORICAL value | A THEME_CATEGORICAL value references a named theme token from a non-ordered set, such as `@swatch.primary`. Wire type is `"theme.categorical"`. |
| THEME_ORDINAL value | A THEME_ORDINAL value references a step on an ordered theme scale, such as `@fontSize.medium`. Wire type is `"theme.ordinal"`. |
| Entry | An entry is one saved record under a top-level workspace section. Examples are one row in `nodes`, `themes`, `font-collections`, `icon-sets`, or `media`. |
| Facet | A facet is the inner name under one grouped style setting. An example is the color part of a border or the top part of padding. |
| List | A list is an ordered sequence of items stored as the whole value of a key. The workspace keeps items in order from first to last. |
| Schema | A schema is the documented pattern for one kind of data Seldon checks. A component schema names the part, lists properties, and describes default children. Narrower schemas cover one property family or one theme token table. |
| Token | A token names one shared design value in a theme, such as a brand color or a spacing step. Properties reference tokens with an `@` path. |
| Theme | A theme is the bundle of tokens a workspace uses to resolve style values. Theme entries live in `workspace.themes` and may extend stock templates from the catalog. |
| Template | A template is the baseline pointer on an entry node or theme entry. Node templates use `catalog:{ComponentId}` or `node:{nodeId}`. Theme templates use `catalog:{ThemeTemplateId}` or `theme:{themeId}`. |
| Overrides | Overrides are local edits on an entry node or theme entry. They layer on top of the template. Only changed fields are stored. |
| Merge | Merge combines two partial property records into one result. Template plus overrides and chained merge calls rely on the same last-wins rules. |
| Shape | A shape spells out which keys may appear on one chunk of structured data and what each value must look like before validators accept it. |
| Compute | Compute merges template data, `overrides`, and theme context, then runs `computeProperties` to resolve COMPUTED cells. Resolvers run after compute. |
| Resolver | A resolver turns post-compute tagged cells into plain strings or numbers for CSS and UI. It reads merged properties plus a computed theme. |
| Action | An action is a message the workspace treats as a single command. One field names which change to run. The rest carry ids and payloads for that change. |
| Validation | Validation inspects each incoming action before the reducer runs. It rejects unknown commands, illegal targets, or edits that break layout rules. |
| Reducer | A reducer takes the current workspace plus one action and returns the workspace after that change. It routes by action name and returns a fresh workspace object. |
| Rule | A rule is a fixed statement about what the workspace may do next. It allows or blocks edit families for roles such as default root, user variant, instance, or catalog row. It also pins how component levels may combine. |
| Propagation | Propagation is the policy that decides how one edit fans out to related entry nodes. An example is mirroring a variant change into dependent instances. |
| Middleware | Middleware schedules validation, the reducer, migration, and verification in a fixed order on each action. |
| Migration | Migration upgrades older workspace data to the shape current code expects. It runs inside the change pipeline when a file opens. |
| Verification | Verification scans the whole workspace after an edit returns. It confirms ids line up, variant trees reference real nodes, and references stay consistent. |
| Invariant | An invariant is a hard must that the code treats as always true. Helpers and services assert these facts when an impossible state would hide a bug. |

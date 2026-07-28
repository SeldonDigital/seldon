/**
 * Read access to a project's source files, with no filesystem of its own. A Node
 * host backs it with `fs`, a browser host with a directory handle, and a test
 * with a plain map, so the scan runs anywhere the sources can be read.
 */
export interface FileSource {
  /** Every file under the scan root, as a path relative to it using `/`. */
  list(): Promise<string[]>
  /** Reads one file's text by its relative path. */
  read(path: string): Promise<string>
}

export type BindingsFramework = "react" | "vue"

/**
 * Where to scan and how to recognize a generated component.
 *
 * `include` and `exclude` hold folder paths relative to the scan root, matched
 * by path prefix rather than glob, so no pattern library is needed. An empty
 * `include` scans everything the excludes leave behind.
 */
export interface BindingsConfig {
  framework: BindingsFramework
  componentsFolder: string
  componentImportPrefixes: string[]
  include: string[]
  exclude: string[]
  extensions: string[]
}

/** Caller-supplied config. Every field falls back to a documented default. */
export interface BindingsConfigInput {
  framework: BindingsFramework
  componentsFolder?: string
  componentImportPrefixes?: string[]
  include?: string[]
  exclude?: string[]
  extensions?: string[]
}

/** How the declaration that produced a value was written. */
export type DeclarationKind = "const" | "let" | "function" | "import" | "parameter"

/**
 * Where a value came from inside the consuming file. `via` names the callee when
 * the declaration initializes from a call, which is what identifies the hook
 * behind a value. `module` names the source module for an import.
 */
export interface DeclarationSite {
  line: number
  kind: DeclarationKind
  via?: string
  module?: string
}

/** An identifier a bound expression reads, with where that identifier came from. */
export interface ExpressionInput {
  name: string
  declaredAt: DeclarationSite | null
}

/** One prop key a consumer sets on a ref, and the expression behind it. */
export interface PropBinding {
  key: string
  expression: string
  inputs: ExpressionInput[]
}

/**
 * One place a consumer drives a ref through a `seldonRefs` map. `component` is
 * the enclosing function that renders the generated component. `conditional` is
 * true when the entry is added behind a branch rather than in the map literal.
 *
 * `expression` is the whole value assigned to the ref, so a value built by a
 * helper call still reports its origin. `props` lists the keys only when that
 * value is an object literal, and is empty when it is a call or a spread.
 */
export interface RefConsumer {
  file: string
  component: string
  line: number
  conditional: boolean
  expression: string
  inputs: ExpressionInput[]
  props: PropBinding[]
}

/**
 * One place a consumer passes a positional slot prop. `spread` is true when the
 * prop arrived through an object spread rather than a named attribute, so a
 * reader knows the attribute name never appears at the call site.
 */
export interface SlotConsumer {
  file: string
  component: string
  line: number
  expression: string
  inputs: ExpressionInput[]
  spread: boolean
}

/**
 * How much of each binding the scan could resolve.
 *
 * `full` parses every file and reports expressions, declaration sites, and
 * slots. `shallow` runs without a parser and reports ref and prop keys with
 * their file and line only, leaving `expression` and `inputs` empty and `slots`
 * empty. A reader must check this before presenting a binding as complete.
 */
export type BindingsMode = "full" | "shallow"

/**
 * The consumer half of the binding manifest. `refs` is keyed by ref name, and
 * `slots` is keyed by generated component name then slot name. Joining `refs`
 * and `slots` to the views in the generated `refs/index.ts` yields the full
 * picture of a ref, from workspace node to the code that drives it.
 */
export interface BindingsManifest {
  version: number
  mode: BindingsMode
  framework: BindingsFramework
  scannedFiles: number
  refs: Record<string, RefConsumer[]>
  slots: Record<string, Record<string, SlotConsumer[]>>
}

/** What one front end reports for one file. */
export interface FileBindings {
  refs: Array<{ ref: string; consumer: RefConsumer }>
  slots: Array<{ component: string; slot: string; consumer: SlotConsumer }>
}

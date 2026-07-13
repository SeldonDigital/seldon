import {
  type ToolDefinition,
  defineTool,
} from "@earendil-works/pi-coding-agent"
import { Type } from "typebox"

import { catalogComponentsSection } from "../../../prompt/context-sections/catalog-components"
import { joinOrEmpty, textResult } from "./shared"

/** Returns every component catalog id that can be added with add_component. */
export function createListCatalogIdsTool(): ToolDefinition {
  return defineTool({
    name: "list_catalog_ids",
    label: "List Catalog Ids",
    description:
      "Return every component catalog id that can be added with add_component.",
    parameters: Type.Object({}),
    execute: async () =>
      textResult(
        joinOrEmpty(catalogComponentsSection(), "No catalog ids available."),
      ),
  })
}

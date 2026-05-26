import { getComponentSchema } from "../../../components/catalog"
import { ComponentId } from "../../../components/constants"
import {
  type ComponentSchema,
  type SchemaChild,
  type SchemaVariant,
  isComplexSchema,
} from "../../../components/types"
import { invariant } from "../../../helpers/utils/invariant"
import {
  componentBoardDefaultNodeId,
  componentBoardSchemaVariantNodeId,
} from "../components/entry-node-ids"

export interface ResolvedSchemaChild {
  componentId: ComponentId
  schema: ComponentSchema
  label: string
  templateNodeId: string
  fallbackChildren: SchemaChild[]
}

function getSelectedSchemaVariant(
  slot: SchemaChild,
  schema: ComponentSchema,
): SchemaVariant | null {
  if (!slot.variant) {
    return null
  }

  invariant(
    isComplexSchema(schema),
    `Schema child ${slot.component} cannot use variant "${slot.variant}" because it is primitive`,
  )

  const variant =
    schema.variants?.find((candidate) => candidate.id === slot.variant) ?? null

  invariant(
    variant,
    `Schema child ${slot.component} references missing variant "${slot.variant}"`,
  )

  return variant
}

export function resolveSchemaChild(slot: SchemaChild): ResolvedSchemaChild {
  const schema = getComponentSchema(slot.component)
  const selectedVariant = getSelectedSchemaVariant(slot, schema)

  if (!selectedVariant) {
    return {
      componentId: slot.component,
      schema,
      label: schema.name,
      templateNodeId: componentBoardDefaultNodeId(slot.component),
      fallbackChildren: isComplexSchema(schema) ? (schema.default.children ?? []) : [],
    }
  }

  return {
    componentId: slot.component,
    schema,
    label: selectedVariant.label,
    templateNodeId: componentBoardSchemaVariantNodeId(
      slot.component,
      selectedVariant.id,
    ),
    fallbackChildren: selectedVariant.children?.length
      ? selectedVariant.children
      : schema.default.children ?? [],
  }
}

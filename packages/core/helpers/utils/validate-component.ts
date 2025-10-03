import { getComponentSchema } from "../../components/catalog"
import { ComponentSchema } from "../../components/types"
import { invariant } from "../../index"
import { Properties } from "../../properties/types/properties"

/**
 * Validates a component schema against the original catalog definition.
 * @param component - The component schema to validate
 */
export function validateComponent(component: ComponentSchema) {
  invariant(component.id, "Component id is required")

  const original = getComponentSchema(component.id)
  invariant(original, "Component not found")
  compareProperties(component.properties, original.properties)
}

/**
 * Ensures all required properties from the original schema are present.
 * @param componentProperties - Properties to validate
 * @param originalProperties - Original schema properties to check against
 */
function compareProperties(
  componentProperties: Properties,
  originalProperties: Properties,
) {
  for (const key in originalProperties) {
    if (!(key in componentProperties)) {
      throw new Error(`Component is missing property '${key}'`)
    }
  }
}

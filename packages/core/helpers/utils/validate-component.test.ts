import { describe, expect, it } from "bun:test"
import {
  ComponentIcon,
  ComponentId,
  ComponentLevel,
} from "../../components/constants"
import { ComponentSchema } from "../../components/types"
import { Display, Resize, Unit, ValueType } from "../../index"
import { validateComponent } from "./validate-component"

const validComponent: ComponentSchema = {
  name: "icon",
  properties: {
    ariaHidden: {
      type: ValueType.EXACT,
      value: false,
    },
    display: {
      type: ValueType.EMPTY,
      value: null,
    },
    symbol: {
      type: ValueType.PRESET,
      value: "material-favorite",
    },
    color: {
      type: ValueType.THEME_CATEGORICAL,
      value: "@swatch.black",
    },
    brightness: {
      type: ValueType.EMPTY,
      value: null,
    },
    size: {
      type: ValueType.THEME_ORDINAL,
      value: "@size.medium",
      restrictions: {
        allowedValues: [
          "@size.xsmall",
          "@size.small",
          "@size.medium",
          "@size.large",
          "@size.xlarge",
        ],
      },
    },
    opacity: {
      type: ValueType.EMPTY,
      value: null,
    },
    width: {
      type: ValueType.PRESET,
      value: Resize.FIT,
    },
    height: {
      type: ValueType.PRESET,
      value: Resize.FIT,
    },
    rotation: {
      type: ValueType.EMPTY,
      value: null,
    },
    margin: {
      top: { type: ValueType.EMPTY, value: null },
      right: { type: ValueType.EMPTY, value: null },
      bottom: { type: ValueType.EMPTY, value: null },
      left: { type: ValueType.EMPTY, value: null },
    },
  },
  id: ComponentId.ICON,
  intent: "An icon",
  level: ComponentLevel.PRIMITIVE,
  tags: ["icon"],
  icon: ComponentIcon.ICON,
}

describe("validateComponent", () => {
  it("should validate a complete component without errors", () => {
    expect(() => validateComponent(validComponent)).not.toThrow()
  })

  it("should throw errors for invalid components", () => {
    const invalidComponents = [
      {
        component: {
          ...validComponent,
          properties: Object.fromEntries(
            Object.entries(validComponent.properties).filter(
              ([key]) => key !== "symbol",
            ),
          ),
        } as ComponentSchema,
        expectedError: "Component is missing property 'symbol'",
      },
      {
        component: {
          ...validComponent,
          properties: Object.fromEntries(
            Object.entries(validComponent.properties).filter(
              ([key]) => key !== "color",
            ),
          ),
        } as ComponentSchema,
        expectedError: "Component is missing property 'color'",
      },
      {
        component: {
          ...validComponent,
          properties: Object.fromEntries(
            Object.entries(validComponent.properties).filter(
              ([key]) => key !== "brightness",
            ),
          ),
        } as ComponentSchema,
        expectedError: "Component is missing property 'brightness'",
      },
    ]

    invalidComponents.forEach(({ component, expectedError }) => {
      expect(() => validateComponent(component)).toThrow(expectedError)
    })
  })
})

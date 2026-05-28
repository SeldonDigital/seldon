import { describe, expect, it } from "bun:test"
import { ComponentId } from "../../../components/constants"
import {
  collectComponentInstantiationPlans,
  getInstantiationOptionsForComponent,
} from "./collect-component-instantiation-plans"

describe("collectComponentInstantiationPlans", () => {
  it("restricts button to the label catalog variant for sidebar", () => {
    const plans = collectComponentInstantiationPlans(ComponentId.SIDEBAR)
    const options = getInstantiationOptionsForComponent(
      ComponentId.BUTTON,
      plans,
    )

    expect(options.embeddedVariantId).toBe("label")
    expect(options.restrictedCatalogVariantIds).toBeUndefined()
  })

  it("requires a full catalog board when a slot omits variant", () => {
    const plans = collectComponentInstantiationPlans(ComponentId.BUTTON)

    expect(plans.get(ComponentId.BUTTON)?.fullCatalog).toBe(true)
  })
})

import {
  ControlFieldWrapper,
  PropertyControlSurface,
} from "@seldon/components/custom-components"
import { Combobox } from "./controls/combobox/Combobox"
import { ComboboxOptionList } from "./controls/combobox/OptionList"
import { ComboboxOptions } from "./controls/combobox/Options"
import {
  usePropertyControl,
  type PropertyControlProps,
} from "./hooks/use-property-control"

export type { PropertyControlProps }

/**
 * Binding shell for a single property value control. Delegates all derivation,
 * dispatch, and combobox state to `usePropertyControl` and renders the Views the
 * ViewModel selects.
 */
export function PropertyControl(props: PropertyControlProps) {
  const view = usePropertyControl(props)

  if (view.kind === "none") {
    return null
  }

  if (view.kind === "field") {
    return (
      <ControlFieldWrapper onBlur={view.onBlur} style={view.wrapperStyle}>
        <Combobox mode="standalone" {...view.combobox} />
      </ControlFieldWrapper>
    )
  }

  return (
    <PropertyControlSurface
      containerRef={view.surface.containerRef}
      onClick={view.surface.onClick}
      containerStyle={view.surface.containerStyle}
      wrapperStyle={view.surface.wrapperStyle}
      innerStyle={view.surface.innerStyle}
    >
      <Combobox mode="combobox" {...view.field} />
      <ComboboxOptions
        open={view.options.open}
        position={view.options.position}
        handleClose={view.options.handleClose}
      >
        <ComboboxOptionList {...view.optionList} />
      </ComboboxOptions>
    </PropertyControlSurface>
  )
}

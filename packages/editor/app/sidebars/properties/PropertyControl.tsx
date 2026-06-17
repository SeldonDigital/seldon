import {
  type PropertyControlProps,
  usePropertyControl,
} from "./hooks/use-property-control"
import {
  ControlFieldWrapper,
  PropertyControlSurface,
} from "@seldon/components/custom-components"
import {
  Combobox,
  ComboboxOptionList,
  ComboboxOptions,
} from "@seldon/components/custom-components"

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
        <Combobox
          mode="standalone"
          value={view.combobox.value}
          onValueChange={view.combobox.onValueChange}
          onSubmit={view.combobox.onSubmit}
          onCancel={view.combobox.onCancel}
          placeholder={view.combobox.placeholder}
          validate={view.combobox.validate}
          disabled={view.combobox.disabled}
          autoFocus={view.combobox.autoFocus}
          style={view.combobox.style}
        />
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
      <Combobox
        mode="combobox"
        inputRef={view.field.inputRef}
        value={view.field.value}
        onValueChange={view.field.onValueChange}
        open={view.field.open}
        setOpen={view.field.setOpen}
        handleSubmit={view.field.handleSubmit}
        onCancel={view.field.onCancel}
        onHighlightNext={view.field.onHighlightNext}
        onHighlightPrev={view.field.onHighlightPrev}
        placeholder={view.field.placeholder}
        disabled={view.field.disabled}
        autoFocus={view.field.autoFocus}
        style={view.field.style}
      />
      <ComboboxOptions
        open={view.options.open}
        position={view.options.position}
        handleClose={view.options.handleClose}
        onPointerLeave={view.options.onPointerLeave}
      >
        <ComboboxOptionList {...view.optionList} />
      </ComboboxOptions>
    </PropertyControlSurface>
  )
}

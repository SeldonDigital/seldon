import { InputHTMLAttributes, Ref } from "react"

const TOGGLE_SWITCH_CLASS = "sdn-toggle-switch"

/**
 * Structural CSS for the toggle switch. The themeable surface (track color,
 * thumb color, corner radius, padding, and size) comes from the node class the
 * renderer applies. This partial only lays out the track, hides the native
 * control, and shapes and positions the thumb. Thumb size and slide are derived
 * from the track box, so nothing here is authored per instance.
 */
const toggleSwitchStyles = `
.${TOGGLE_SWITCH_CLASS} {
  position: relative;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  width: 2.25em;
  min-width: 2.25em;
  vertical-align: middle;
}
.${TOGGLE_SWITCH_CLASS} > .${TOGGLE_SWITCH_CLASS}__control {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  opacity: 0;
  cursor: inherit;
}
.${TOGGLE_SWITCH_CLASS} > .${TOGGLE_SWITCH_CLASS}__thumb {
  flex: 0 0 auto;
  width: 1em;
  height: 1em;
  border-radius: 50%;
  background-color: currentColor;
  transition: background-color 120ms ease;
  pointer-events: none;
}
.${TOGGLE_SWITCH_CLASS}:has(> .${TOGGLE_SWITCH_CLASS}__control:checked) {
  justify-content: flex-end;
}
`

export interface ToggleSwitchProps extends InputHTMLAttributes<HTMLInputElement> {
  ref?: Ref<HTMLInputElement>
}

/**
 * Bespoke toggle switch template shared by the canvas and the React factory. The
 * outer `span` is the track and receives the node class and inline style; the
 * hidden `input` carries the switch semantics (`role`, `aria-checked`, checked
 * state) and drives the thumb position through `:has(:checked)`.
 */
export const ToggleSwitch = ({
  ref,
  className,
  style,
  children: _children,
  ...props
}: ToggleSwitchProps) => {
  const trackClassName = className
    ? `${TOGGLE_SWITCH_CLASS} ${className}`
    : TOGGLE_SWITCH_CLASS

  return (
    <span className={trackClassName} style={style}>
      <style>{toggleSwitchStyles}</style>
      <input
        ref={ref}
        type="checkbox"
        className={`${TOGGLE_SWITCH_CLASS}__control`}
        {...props}
      />
      <span className={`${TOGGLE_SWITCH_CLASS}__thumb`} aria-hidden="true" />
    </span>
  )
}

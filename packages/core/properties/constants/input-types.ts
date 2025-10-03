/**
 * Input type values for form elements.
 */
export enum InputType {
  TEXT = "text",
  NUMBER = "number",
  EMAIL = "email",
  PASSWORD = "password",
  SEARCH = "search",
  TEL = "tel",
  URL = "url",
  DATE = "date",
  DATETIME_LOCAL = "datetime-local",
  CHECKBOX = "checkbox",
  RADIO = "radio",
}

/**
 * Readable input type options for interface.
 */
export const INPUT_TYPE_OPTIONS: { name: string; value: InputType }[] = [
  { name: "Text", value: InputType.TEXT },
  { name: "Number", value: InputType.NUMBER },
  { name: "Email", value: InputType.EMAIL },
  { name: "Password", value: InputType.PASSWORD },
  { name: "Search", value: InputType.SEARCH },
  { name: "Tel", value: InputType.TEL },
  { name: "Url", value: InputType.URL },
  { name: "Date", value: InputType.DATE },
  { name: "Datetime-local", value: InputType.DATETIME_LOCAL },
  { name: "Radio", value: InputType.RADIO },
  { name: "Checkbox", value: InputType.CHECKBOX },
]

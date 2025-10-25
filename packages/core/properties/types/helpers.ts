import { EmptyValue } from "../values/shared/empty/empty"

export type Restricted<T, R> = T & {
  restrictions?: {
    allowedValues?: R[]
  }
}

export type Optional<T> = T | EmptyValue

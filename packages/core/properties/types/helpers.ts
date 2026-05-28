/** Value shaped like T with optional restrictions.allowedValues drawn from R. */
export type Restricted<T, R> = T & {
  restrictions?: {
    allowedValues?: R[]
  }
}

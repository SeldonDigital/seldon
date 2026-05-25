// Insertion strategies
export enum TransformStrategy {
  APPEND = "APPEND",
  PREPEND = "PREPEND",
}

export type TransformConfig =
  | {
      strategy: TransformStrategy.APPEND
      source: string
      content: string
    }
  | {
      strategy: TransformStrategy.PREPEND
      source: string
      content: string
    }

/**
 * Universal source transformation function that handles different transformation strategies
 * @param config - Configuration for the transformation
 * @returns Transformed source code
 */
export function transformSource(config: TransformConfig): string {
  switch (config.strategy) {
    case TransformStrategy.APPEND:
      return `${config.source}\n${config.content}`

    case TransformStrategy.PREPEND:
      return `${config.content}\n${config.source}`

    default:
      throw new Error(
        `Unknown transformation config: ${JSON.stringify(config)}`,
      )
  }
}

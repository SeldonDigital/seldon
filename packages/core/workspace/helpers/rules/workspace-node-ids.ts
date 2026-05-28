/** Node id for a variant row (legacy string ids or v2 entry ids). */
export type VariantId = string

/** Node id for an instance row (legacy string ids or v2 entry ids). */
export type InstanceId = string

/** AI action placeholder id (e.g. `$ref.0.1`) before reference resolution. */
export type ReferenceId = string

export interface NodePathSegment {
  componentId: string
  index: number
}

export type NodePath = NodePathSegment[]

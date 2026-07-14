/** Node id for a variant row (legacy string ids or v2 entry ids). */
export type VariantId = string

/** Node id for an instance row (legacy string ids or v2 entry ids). */
export type InstanceId = string

export interface NodePathSegment {
  componentId: string
  index: number
}

export type NodePath = NodePathSegment[]

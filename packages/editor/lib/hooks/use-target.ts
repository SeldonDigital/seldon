import { create } from "zustand"
import { ComponentId } from "@seldon/core/components/constants"
import { InstanceId, VariantId } from "@seldon/core/index"

/**
 * Represents where the user clicked and intends to add a component
 */
export interface Target {
  nodeId: VariantId | InstanceId | ComponentId
  index: number
}

interface TargetState {
  target: Target | null
  setTarget: (target: Target | null) => void
}

const useStore = create<TargetState>((set) => ({
  target: null,
  setTarget: (target) => set(() => ({ target })),
}))

/**
 * Hook to manage the target selection state
 * Shared between various panels that need to insert components at a specific location
 */
export function useTarget() {
  const { target, setTarget } = useStore()

  return {
    target,
    setTarget,
  }
}

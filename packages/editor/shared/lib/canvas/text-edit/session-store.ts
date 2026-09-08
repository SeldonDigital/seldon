import { createStore } from "../store/observable"

export interface TextEditSession {
  nodeId: string
  rootId: string | null
}

export interface TextEditSessionState {
  session: TextEditSession | null
}

export const textEditSessionStore = createStore<TextEditSessionState>({
  session: null,
})

export function startTextEditSession(session: TextEditSession): void {
  textEditSessionStore.setState({ session })
}

export function clearTextEditSession(): void {
  textEditSessionStore.setState({ session: null })
}

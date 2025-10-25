import { StrictMode } from "react"

import { Homepage } from "./Homepage"
import { Layout } from "./Layout"

export interface AppProps {}

export function App(props: AppProps) {
  return (
    <StrictMode>
      <Layout>
        <Homepage />
      </Layout>
    </StrictMode>
  )
}

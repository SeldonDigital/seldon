import { StrictMode } from "react"
import { Route, Switch } from "wouter"

import { Homepage } from "./Homepage"
import { Layout } from "./Layout"

export interface AppProps {}

export function App(props: AppProps) {
  return (
    <StrictMode>
      <Layout>
        <Switch>
          <Route path="/" component={Homepage} />
        </Switch>
      </Layout>
    </StrictMode>
  )
}

import { Route, Router, Switch } from "wouter"

import { Homepage } from "./Home.page"
import { Layout } from "./Layout"
import { ProjectPage } from "./Project.page"

export interface AppProps {}

export function App(props: AppProps) {
  return (
    <Layout>
      <Router>
        <Switch>
          <Route path="/" component={Homepage} />
          <Route path="/projects/:projectId" component={ProjectPage} />
        </Switch>
      </Router>
    </Layout>
  )
}

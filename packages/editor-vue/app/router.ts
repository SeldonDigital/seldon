import { createRouter, createWebHistory } from "vue-router"

// Two routes mirror the React editor: a home workspace picker and the editor
// keyed by workspace id.
export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@app/home/HomePage.vue"),
    },
    {
      path: "/:id",
      name: "editor",
      component: () => import("@app/editor/EditorPage.vue"),
    },
  ],
})

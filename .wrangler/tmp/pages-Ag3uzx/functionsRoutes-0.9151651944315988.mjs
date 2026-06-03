import { onRequestDelete as __api_foods_js_onRequestDelete } from "C:\\Blog\\lifeisrent.github.io\\functions\\api\\foods.js"
import { onRequestGet as __api_foods_js_onRequestGet } from "C:\\Blog\\lifeisrent.github.io\\functions\\api\\foods.js"
import { onRequestPost as __api_foods_js_onRequestPost } from "C:\\Blog\\lifeisrent.github.io\\functions\\api\\foods.js"
import { onRequestPost as __api_owner_login_js_onRequestPost } from "C:\\Blog\\lifeisrent.github.io\\functions\\api\\owner-login.js"
import { onRequest as ___middleware_js_onRequest } from "C:\\Blog\\lifeisrent.github.io\\functions\\_middleware.js"

export const routes = [
    {
      routePath: "/api/foods",
      mountPath: "/api",
      method: "DELETE",
      middlewares: [],
      modules: [__api_foods_js_onRequestDelete],
    },
  {
      routePath: "/api/foods",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_foods_js_onRequestGet],
    },
  {
      routePath: "/api/foods",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_foods_js_onRequestPost],
    },
  {
      routePath: "/api/owner-login",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_owner_login_js_onRequestPost],
    },
  {
      routePath: "/",
      mountPath: "/",
      method: "",
      middlewares: [___middleware_js_onRequest],
      modules: [],
    },
  ]
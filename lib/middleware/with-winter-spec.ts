import { createWithWinterSpec } from "winterspec"
import type { Middleware } from "winterspec/middleware"
import { withDb } from "./with-db"

export const withRouteSpec = createWithWinterSpec({
  apiName: "tscircuit Debug API",
  productionServerUrl: "https://debug-api.tscircuit.com",
  beforeAuthMiddleware: [],
  authMiddleware: {},
  afterAuthMiddleware: [withDb],
})

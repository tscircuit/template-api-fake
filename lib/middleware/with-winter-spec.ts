import { createWithWinterSpec } from "winterspec"
import { withDb } from "./with-db"
import { withCtxReact } from "./with-ctx-react"

export const withRouteSpec = createWithWinterSpec({
  apiName: "tscircuit Debug API",
  productionServerUrl: "https://debug-api.tscircuit.com",
  beforeAuthMiddleware: [],
  authMiddleware: {},
  afterAuthMiddleware: [withDb, withCtxReact],
})

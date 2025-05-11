import bundle from "dist/bundle"
import { getNodeHandler } from "winterspec/adapters/node"
import type { Middleware } from "winterspec/middleware"

const handler = getNodeHandler(bundle as any, {})

export default (req: any, res: any) => handler(req, res)

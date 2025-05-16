import type { DbClient } from "lib/db/db-client"
import { createDatabase } from "lib/db/db-client"
import type { Middleware } from "winterspec/middleware"

// Create a singleton instance of the database
let dbInstance: DbClient | null = null

export const withDb: Middleware<
  {},
  {
    db: DbClient
  }
> = async (req, ctx, next) => {
  // Only set db if not already provided by another middleware
  if (!ctx.db) {
    if (!dbInstance) {
      dbInstance = createDatabase()
    }
    ctx.db = dbInstance
  }

  return next(req, ctx)
}

import { withRouteSpec } from "lib/middleware/with-winter-spec"
import { z } from "zod"

export default withRouteSpec({
  methods: ["GET"],
  jsonResponse: z.object({
    things: z.array(
      z.object({
        thing_id: z.string(),
        name: z.string(),
        description: z.string(),
      }),
    ),
  }),
})((req, ctx) => {
  return ctx.json({ things: ctx.db.things })
})

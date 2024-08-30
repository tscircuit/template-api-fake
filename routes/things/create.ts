import { withRouteSpec } from "lib/middleware/with-winter-spec"
import { z } from "zod"

export default withRouteSpec({
  methods: ["POST"],
  jsonBody: z.object({
    name: z.string(),
    description: z.string(),
  }),
  jsonResponse: z.object({
    ok: z.boolean(),
  }),
})(async (req, ctx) => {
  const { name, description } = await req.json()
  ctx.db.addThing({
    name,
    description,
  })
  return ctx.json({ ok: true })
})

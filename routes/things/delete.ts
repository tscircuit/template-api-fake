import { withRouteSpec } from "lib/middleware/with-winter-spec"
import { z } from "zod"
import type { DatabaseSchema } from "lib/db/schema"

export default withRouteSpec({
  methods: ["POST"],
  urlEncodedFormData: z.object({
    thing_id: z.string(),
  }),
  jsonResponse: z.object({
    ok: z.boolean(),
  }),
})(async (req, ctx) => {
  const { thing_id } = req.urlEncodedFormData

  // Delete the thing
  ctx.db.setState({
    ...ctx.db.getState(),
    things: ctx.db.getState().things.filter((t) => t.thing_id !== thing_id),
  })

  return ctx.json({ ok: true })
})

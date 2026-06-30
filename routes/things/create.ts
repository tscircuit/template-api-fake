import { withRouteSpec } from "lib/middleware/with-winter-spec"
import { z } from "zod"

const createThingSchema = z.object({
  name: z.string(),
  description: z.string(),
})

export default withRouteSpec({
  methods: ["POST"],
  jsonBody: createThingSchema.optional(),
  urlEncodedFormData: createThingSchema.optional(),
  jsonResponse: z.object({
    ok: z.boolean(),
  }),
})(async (req, ctx) => {
  const thing = req.jsonBody ?? req.urlEncodedFormData

  if (!thing) {
    return new Response("Expected JSON or URL-encoded form data", {
      status: 400,
    })
  }

  const { name, description } = thing
  ctx.db.addThing({
    name,
    description,
  })
  return ctx.json({ ok: true })
})

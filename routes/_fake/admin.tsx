import React from "react"
import { withRouteSpec } from "lib/middleware/with-winter-spec"
import { z } from "zod"

const AdminPage = ({ things }: { things: any[] }) => {
  return (
    <div>
      <h2>Things Management</h2>
      <div className="flex flex-col gap-4">
        <form
          action="/things/create"
          method="POST"
          className="border p-4 rounded"
        >
          <h3 className="font-bold mb-2">Create New Thing</h3>
          <div className="flex flex-col gap-2">
            <input
              type="text"
              name="name"
              placeholder="Name"
              required
              className="border p-2 rounded"
            />
            <input
              type="text"
              name="description"
              placeholder="Description"
              required
              className="border p-2 rounded"
            />
            <button type="submit" className="btn">
              Create Thing
            </button>
          </div>
        </form>

        <div className="border p-4 rounded">
          <h3 className="font-bold mb-2">Existing Things</h3>
          <div className="grid gap-2">
            {things.map((thing) => (
              <div
                key={thing.thing_id}
                className="border p-2 rounded flex justify-between items-center"
              >
                <div>
                  <div className="font-bold">{thing.name}</div>
                  <div className="text-gray-600">{thing.description}</div>
                </div>
                <div className="text-xs text-gray-500">
                  ID: {thing.thing_id}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default withRouteSpec({
  methods: ["GET"],
  jsonResponse: z.object({
    things: z.array(
      z.object({
        thing_id: z.string(),
        name: z.string(),
        description: z.string(),
      })
    ),
  }),
})(async (req, ctx) => {
  const things = ctx.db.things
  return ctx.react(<AdminPage things={things} />)
})

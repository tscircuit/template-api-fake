import { withRouteSpec } from "lib/middleware/with-winter-spec"
import type { Thing } from "lib/db/schema"
import React from "react"
import { Table } from "lib/admin/Table"
import { z } from "zod"

export default withRouteSpec({
  methods: ["GET"],
})((req, ctx) => {
  // Get things from the database
  const things = ctx.db.things

  // Render the admin page directly
  return ctx.react(
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Thing Resources Admin</h1>

      {/* Create new thing form */}
      <div className="mb-6">
        <h2>Create New Thing</h2>
        <form action="/things/create" method="POST" className="w-full max-w-md">
          <div className="mb-2">
            <label className="block text-gray-700 text-sm font-bold mb-1">
              Name:
              <input type="text" name="name" className="w-full" required />
            </label>
          </div>
          <div className="mb-2">
            <label className="block text-gray-700 text-sm font-bold mb-1">
              Description:
              <input
                type="text"
                name="description"
                className="w-full"
                required
              />
            </label>
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Create Thing
          </button>
        </form>
      </div>

      {/* Display thing resources */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Thing Resources</h2>
        <Table
          rows={things.map((thing) => ({
            ...thing,
            actions: (
              <form action="/things/delete" method="POST">
                <input type="hidden" name="thing_id" value={thing.thing_id} />
                <button
                  type="submit"
                  className="text-xs font-medium text-white bg-red-600 hover:bg-red-700 px-4 py-1 rounded shadow-none"
                >
                  Delete
                </button>
              </form>
            ),
          }))}
        />
      </div>
    </div>,
  )
})

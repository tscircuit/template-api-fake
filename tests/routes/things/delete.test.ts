import { getTestServer } from "tests/fixtures/get-test-server"
import { test, expect } from "bun:test"

test("delete a thing", async () => {
  const { ky } = await getTestServer()

  // Create a thing
  await ky.post("things/create", {
    json: {
      name: "Thing to Delete",
      description: "Description",
    },
  })

  // List to get the ID
  const listData = await ky
    .get("things/list")
    .json<{ things: { thing_id: string; name: string }[] }>()

  expect(listData.things).toHaveLength(1)
  const thingId = listData.things[0].thing_id

  // Delete the thing
  const body = new URLSearchParams()
  body.append("thing_id", thingId)

  const deleteResponse = await ky.post("things/delete", {
    body,
  })
  expect(deleteResponse.status).toBe(200)

  // Verify deletion
  const afterDeleteData = await ky.get("things/list").json<{ things: any[] }>()

  expect(afterDeleteData.things).toHaveLength(0)
})

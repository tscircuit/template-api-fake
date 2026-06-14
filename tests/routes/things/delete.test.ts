import { getTestServer } from "tests/fixtures/get-test-server"
import { test, expect } from "bun:test"

test("delete a thing", async () => {
  const { ky } = await getTestServer()

  // Create a thing first
  const createRes = await ky.post("things/create", {
    json: {
      name: "ThingToDelete",
      description: "Will be deleted",
    },
  }).json<{ ok: boolean }>()

  expect(createRes.ok).toBe(true)

  // Verify it exists
  const listBefore = await ky
    .get("things/list")
    .json<{ things: { thing_id: string; name: string }[] }>()

  expect(listBefore.things).toHaveLength(1)
  const thingId = listBefore.things[0].thing_id

  // Delete the thing using URL-encoded form data
  const deleteRes = await ky.post("things/delete", {
    body: new URLSearchParams({ thing_id: thingId }),
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
  }).json<{ ok: boolean }>()

  expect(deleteRes.ok).toBe(true)

  // Verify it's gone
  const listAfter = await ky
    .get("things/list")
    .json<{ things: { thing_id: string; name: string }[] }>()

  expect(listAfter.things).toHaveLength(0)
})

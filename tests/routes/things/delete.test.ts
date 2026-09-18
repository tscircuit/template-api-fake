import { getTestServer } from "tests/fixtures/get-test-server"
import { test, expect } from "bun:test"

test("delete a thing", async () => {
  const { ky } = await getTestServer()

  await ky.post("things/create", {
    json: {
      name: "ThingToDelete",
      description: "Will be deleted",
    },
  })

  const listBefore = await ky
    .get("things/list")
    .json<{ things: { thing_id: string; name: string }[] }>()

  expect(listBefore.things).toHaveLength(1)
  const thingId = listBefore.things[0].thing_id

  const deleteRes = await ky.post("things/delete", {
    body: new URLSearchParams({ thing_id: thingId }),
  })
  expect(deleteRes.status).toBe(200)
  const deleteData = await deleteRes.json<{ ok: boolean }>()
  expect(deleteData.ok).toBe(true)

  const listAfter = await ky
    .get("things/list")
    .json<{ things: { thing_id: string; name: string }[] }>()

  expect(listAfter.things).toHaveLength(0)
})

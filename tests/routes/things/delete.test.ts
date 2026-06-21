import { expect, test } from "bun:test"
import { getTestServer } from "tests/fixtures/get-test-server"

test("delete a thing with ky form data", async () => {
  const { ky } = await getTestServer()
  const name = `Thing to delete ${crypto.randomUUID()}`

  await ky.post("things/create", {
    json: {
      name,
      description: "Temporary thing",
    },
  })

  const beforeDelete = await ky
    .get("things/list")
    .json<{ things: { thing_id: string; name: string }[] }>()

  const thingId = beforeDelete.things.find(
    (thing) => thing.name === name,
  )?.thing_id
  expect(thingId).toBeString()

  const deleteResponse = await ky
    .post("things/delete", {
      body: new URLSearchParams({ thing_id: thingId! }),
    })
    .json<{ ok: boolean }>()

  expect(deleteResponse).toEqual({ ok: true })

  const afterDelete = await ky
    .get("things/list")
    .json<{ things: { thing_id: string; name: string }[] }>()

  expect(afterDelete.things.some((thing) => thing.name === name)).toBe(false)
})

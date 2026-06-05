import { expect, test } from "bun:test"
import { getTestServer } from "tests/fixtures/get-test-server"

test("delete a thing with form data", async () => {
  const { ky } = await getTestServer()

  await ky.post("things/create", {
    json: {
      name: "Thing to delete",
      description: "This thing should be deleted",
    },
  })

  const created = await ky.get("things/list").json<{
    things: { thing_id: string; name: string; description: string }[]
  }>()

  expect(created.things).toHaveLength(1)

  await ky.post("things/delete", {
    body: new URLSearchParams({
      thing_id: created.things[0]!.thing_id,
    }),
  })

  const afterDelete = await ky.get("things/list").json<{
    things: { thing_id: string; name: string; description: string }[]
  }>()

  expect(afterDelete.things).toEqual([])
})

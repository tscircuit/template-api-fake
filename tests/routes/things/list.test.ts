import { getTestServer } from "tests/fixtures/get-test-server"
import { test, expect } from "bun:test"

test("list things", async () => {
  const { ky } = await getTestServer()

  const initialList = await ky
    .get("things/list")
    .json<{ things: { thing_id: string; name: string }[] }>()
  expect(initialList.things).toHaveLength(0)

  await ky.post("things/create", {
    json: {
      name: "ThingA",
      description: "First Thing",
    },
  })

  await ky.post("things/create", {
    json: {
      name: "ThingB",
      description: "Second Thing",
    },
  })

  const updatedList = await ky.get("things/list").json<{
    things: { thing_id: string; name: string; description: string }[]
  }>()

  expect(updatedList.things).toHaveLength(2)
  expect(updatedList.things.map((t) => t.name)).toEqual(["ThingA", "ThingB"])
})

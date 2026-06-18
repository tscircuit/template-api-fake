import { getTestServer } from "tests/fixtures/get-test-server"
import { test, expect } from "bun:test"

test("create a thing", async () => {
  const { ky } = await getTestServer()
  const thing = {
    name: "Thing1",
    description: "Thing1 Description",
  }

  const createData = await ky
    .post("things/create", {
      json: thing,
    })
    .json<{ ok: boolean }>()

  expect(createData).toEqual({ ok: true })

  const data = await ky
    .get("things/list")
    .json<{ things: { name: string; description: string }[] }>()

  expect(data.things).toHaveLength(1)
  expect(data.things[0]?.name).toBe(thing.name)
  expect(data.things[0]?.description).toBe(thing.description)
})

import { getTestServer } from "tests/fixtures/get-test-server"
import { test, expect } from "bun:test"

test("create a thing", async () => {
  const { ky } = await getTestServer()

  const createResponse = await ky
    .post("things/create", {
      json: {
        name: "Thing1",
        description: "Thing1 Description",
      },
    })
    .json<{ ok: boolean }>()

  expect(createResponse).toEqual({ ok: true })

  const data = await ky.get("things/list").json<{
    things: { thing_id: string; name: string; description: string }[]
  }>()

  expect(data.things).toHaveLength(1)
  expect(data.things[0]).toMatchObject({
    name: "Thing1",
    description: "Thing1 Description",
  })
  expect(data.things[0]?.thing_id).toBeString()
})

import { expect, test } from "bun:test"
import { getTestServer } from "tests/fixtures/get-test-server"

test("list starts empty", async () => {
  const { ky } = await getTestServer()

  const data = await ky.get("things/list").json<{
    things: { thing_id: string; name: string; description: string }[]
  }>()

  expect(data.things).toEqual([])
})

test("list preserves insertion order and generated ids", async () => {
  const { ky } = await getTestServer()

  await ky.post("things/create", {
    json: {
      name: "Thing1",
      description: "Thing1 Description",
    },
  })
  await ky.post("things/create", {
    json: {
      name: "Thing2",
      description: "Thing2 Description",
    },
  })

  const data = await ky.get("things/list").json<{
    things: { thing_id: string; name: string; description: string }[]
  }>()

  expect(data.things).toEqual([
    {
      thing_id: "0",
      name: "Thing1",
      description: "Thing1 Description",
    },
    {
      thing_id: "1",
      name: "Thing2",
      description: "Thing2 Description",
    },
  ])
})

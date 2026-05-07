import { getTestServer } from "tests/fixtures/get-test-server"
import { test, expect } from "bun:test"

test("create a thing", async () => {
  const { ky } = await getTestServer()

  await ky.post("things/create", {
    json: {
      name: "Thing1",
      description: "Thing1 Description",
    },
  })

  const data = await ky
    .get("things/list")
    .json<{ things: { name: string; description: string }[] }>()

  expect(data.things).toHaveLength(1)
})

test("list things returns empty array initially", async () => {
  const { ky } = await getTestServer()

  const data = await ky
    .get("things/list")
    .json<{ things: { name: string; description: string }[] }>()

  expect(data.things).toHaveLength(0)
})

test("create multiple things", async () => {
  const { ky } = await getTestServer()

  await ky.post("things/create", {
    json: { name: "Thing1", description: "First thing" },
  })
  await ky.post("things/create", {
    json: { name: "Thing2", description: "Second thing" },
  })

  const data = await ky
    .get("things/list")
    .json<{ things: { name: string; description: string }[] }>()

  expect(data.things).toHaveLength(2)
  expect(data.things[0].name).toBe("Thing1")
  expect(data.things[1].name).toBe("Thing2")
})

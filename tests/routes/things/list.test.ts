import { getTestServer } from "tests/fixtures/get-test-server"
import { test, expect } from "bun:test"

test("list returns an empty list when nothing has been created", async () => {
  const { ky } = await getTestServer()

  const data = await ky.get("things/list").json<{
    things: { thing_id: string; name: string; description: string }[]
  }>()

  expect(data.things).toEqual([])
})

test("list returns all created things with their fields", async () => {
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
  await ky.post("things/create", {
    json: {
      name: "Thing3",
      description: "Thing3 Description",
    },
  })

  const data = await ky.get("things/list").json<{
    things: { thing_id: string; name: string; description: string }[]
  }>()

  expect(data.things).toHaveLength(3)
  expect(data.things.map((t) => t.name)).toEqual(["Thing1", "Thing2", "Thing3"])
  expect(data.things.map((t) => t.description)).toEqual([
    "Thing1 Description",
    "Thing2 Description",
    "Thing3 Description",
  ])
  const thingIds = data.things.map((t) => t.thing_id)
  expect(new Set(thingIds).size).toBe(3)
  for (const thing of data.things) {
    expect(typeof thing.thing_id).toBe("string")
    expect(thing.thing_id.length).toBeGreaterThan(0)
  }
})

test("list reflects state on a fresh server instance (no cross-test leakage)", async () => {
  const { ky } = await getTestServer()

  await ky.post("things/create", {
    json: {
      name: "OnlyThing",
      description: "Only Description",
    },
  })

  const data = await ky
    .get("things/list")
    .json<{ things: { name: string }[] }>()

  expect(data.things).toHaveLength(1)
  expect(data.things[0].name).toBe("OnlyThing")
})

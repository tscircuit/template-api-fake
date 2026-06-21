import { getTestServer } from "tests/fixtures/get-test-server"
import { test, expect } from "bun:test"

test("list returns empty array on fresh server", async () => {
  const { ky } = await getTestServer()

  const data = await ky
    .get("things/list")
    .json<{ things: { thing_id: string; name: string; description: string }[] }>()

  expect(data.things).toEqual([])
})

test("list returns all required fields for each thing", async () => {
  const { ky } = await getTestServer()

  await ky
    .post("things/create", {
      json: { name: "Widget", description: "A widget" },
    })
    .json<{ ok: boolean }>()

  const data = await ky
    .get("things/list")
    .json<{ things: { thing_id: string; name: string; description: string }[] }>()

  expect(data.things).toHaveLength(1)
  const t = data.things[0]
  expect(typeof t.thing_id).toBe("string")
  expect(t.thing_id.length).toBeGreaterThan(0)
  expect(t.name).toBe("Widget")
  expect(t.description).toBe("A widget")
})

test("list preserves insertion order", async () => {
  const { ky } = await getTestServer()

  const names = ["Alpha", "Bravo", "Charlie"]
  for (const name of names) {
    await ky
      .post("things/create", { json: { name, description: `${name} desc` } })
      .json<{ ok: boolean }>()
  }

  const data = await ky
    .get("things/list")
    .json<{ things: { name: string }[] }>()

  expect(data.things.map((t) => t.name)).toEqual(names)
})

test("list reflects create and delete in sequence", async () => {
  const { ky } = await getTestServer()

  for (const name of ["A", "B", "C"]) {
    await ky
      .post("things/create", { json: { name, description: `${name} desc` } })
      .json<{ ok: boolean }>()
  }

  const listed = await ky
    .get("things/list")
    .json<{ things: { thing_id: string; name: string }[] }>()
  const bId = listed.things.find((t) => t.name === "B")!.thing_id
  await ky
    .post("things/delete", {
      body: new URLSearchParams({ thing_id: bId }),
    })
    .json<{ ok: boolean }>()

  const final = await ky
    .get("things/list")
    .json<{ things: { name: string }[] }>()
  expect(final.things.map((t) => t.name)).toEqual(["A", "C"])
})

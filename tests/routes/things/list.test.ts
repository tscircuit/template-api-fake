import { getTestServer } from "tests/fixtures/get-test-server"
import { test, expect } from "bun:test"

test("list returns an empty array when no things exist", async () => {
  const { ky } = await getTestServer()

  const data = await ky.get("things/list").json<{
    things: { thing_id: string; name: string; description: string }[]
  }>()

  expect(data.things).toEqual([])
})

test("list returns things in insertion order with incrementing thing_id", async () => {
  const { ky } = await getTestServer()

  const names = ["Alpha", "Bravo", "Charlie"]
  for (const name of names) {
    await ky
      .post("things/create", {
        json: { name, description: `${name} desc` },
      })
      .json<{ ok: boolean }>()
  }

  const data = await ky.get("things/list").json<{
    things: { thing_id: string; name: string; description: string }[]
  }>()

  expect(data.things.map((t) => t.name)).toEqual(names)
  // thing_id is generated from an incrementing counter
  const ids = data.things.map((t) => Number(t.thing_id))
  expect(ids).toEqual([...ids].sort((a, b) => a - b))
  expect(new Set(ids).size).toBe(ids.length)
})

import { expect, test } from "bun:test"
import { getTestServer } from "tests/fixtures/get-test-server"

test("create a thing persists and returns ok", async () => {
  const { ky } = await getTestServer()

  const res = await ky.post("things/create", {
    json: {
      name: "Thing1",
      description: "Thing1 Description",
    },
  })
  expect(res.status).toBe(200)

  const body = await res.json<{ ok: boolean }>()
  expect(body).toEqual({ ok: true })

  const data = await ky.get("things/list").json<{
    things: { thing_id: string; name: string; description: string }[]
  }>()

  expect(data.things).toHaveLength(1)
  expect(data.things[0].name).toBe("Thing1")
  expect(data.things[0].description).toBe("Thing1 Description")
  expect(typeof data.things[0].thing_id).toBe("string")
  expect(data.things[0].thing_id.length).toBeGreaterThan(0)
})

test("create assigns incrementing thing_ids", async () => {
  const { ky } = await getTestServer()

  const names = ["Alpha", "Bravo", "Charlie"]
  for (const name of names) {
    const res = await ky
      .post("things/create", { json: { name, description: `${name} desc` } })
      .json<{ ok: boolean }>()
    expect(res).toEqual({ ok: true })
  }

  const data = await ky.get("things/list").json<{
    things: { thing_id: string; name: string }[]
  }>()

  expect(data.things).toHaveLength(3)
  expect(data.things.map((t) => t.name)).toEqual(names)
  const ids = data.things.map((t) => Number(t.thing_id))
  expect(ids).toEqual([0, 1, 2])
})

test("create accepts empty string fields", async () => {
  const { ky } = await getTestServer()

  const res = await ky
    .post("things/create", { json: { name: "", description: "" } })
    .json<{ ok: boolean }>()
  expect(res).toEqual({ ok: true })

  const data = await ky.get("things/list").json<{
    things: { name: string; description: string }[]
  }>()

  expect(data.things).toHaveLength(1)
  expect(data.things[0].name).toBe("")
  expect(data.things[0].description).toBe("")
})

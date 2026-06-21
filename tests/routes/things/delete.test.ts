import { getTestServer } from "tests/fixtures/get-test-server"
import { test, expect } from "bun:test"

test("delete a thing removes it from the list", async () => {
  const { ky } = await getTestServer()

  await ky
    .post("things/create", {
      json: { name: "ToDelete", description: "Will be removed" },
    })
    .json<{ ok: boolean }>()

  await ky
    .post("things/create", {
      json: { name: "ToKeep", description: "Stays" },
    })
    .json<{ ok: boolean }>()

  const before = await ky.get("things/list").json<{
    things: { thing_id: string; name: string; description: string }[]
  }>()
  expect(before.things).toHaveLength(2)

  const target = before.things.find((t) => t.name === "ToDelete")
  expect(target).toBeDefined()

  const deleteRes = await ky
    .post("things/delete", {
      body: new URLSearchParams({ thing_id: target!.thing_id }),
    })
    .json<{ ok: boolean }>()
  expect(deleteRes).toEqual({ ok: true })

  const after = await ky.get("things/list").json<{
    things: { thing_id: string; name: string; description: string }[]
  }>()
  expect(after.things).toHaveLength(1)
  expect(after.things[0].name).toBe("ToKeep")
  expect(
    after.things.find((t) => t.thing_id === target!.thing_id),
  ).toBeUndefined()
})

test("delete is a no-op when thing_id does not exist", async () => {
  const { ky } = await getTestServer()

  await ky
    .post("things/create", {
      json: { name: "Solo", description: "only one" },
    })
    .json<{ ok: boolean }>()

  const res = await ky
    .post("things/delete", {
      body: new URLSearchParams({ thing_id: "does-not-exist" }),
    })
    .json<{ ok: boolean }>()
  expect(res).toEqual({ ok: true })

  const after = await ky
    .get("things/list")
    .json<{ things: { thing_id: string; name: string }[] }>()
  expect(after.things).toHaveLength(1)
  expect(after.things[0].name).toBe("Solo")
})

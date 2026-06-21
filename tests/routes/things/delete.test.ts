import { getTestServer } from "tests/fixtures/get-test-server"
import { test, expect } from "bun:test"

test("delete removes a thing by thing_id", async () => {
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

  const before = await ky
    .get("things/list")
    .json<{ things: { thing_id: string; name: string }[] }>()
  expect(before.things).toHaveLength(2)

  const targetId = before.things.find((t) => t.name === "ToDelete")!.thing_id
  const delRes = await ky
    .post("things/delete", {
      body: new URLSearchParams({ thing_id: targetId }),
    })
    .json<{ ok: boolean }>()
  expect(delRes).toEqual({ ok: true })

  const after = await ky
    .get("things/list")
    .json<{ things: { name: string }[] }>()
  expect(after.things).toHaveLength(1)
  expect(after.things[0].name).toBe("ToKeep")
})

test("delete is idempotent for non-existent thing_id", async () => {
  const { ky } = await getTestServer()

  await ky
    .post("things/create", {
      json: { name: "OnlyOne", description: "only one" },
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
    .json<{ things: { name: string }[] }>()
  expect(after.things).toHaveLength(1)
  expect(after.things[0].name).toBe("OnlyOne")
})

test("create after delete gets a new incrementing thing_id", async () => {
  const { ky } = await getTestServer()

  const c1 = await ky
    .post("things/create", { json: { name: "Temp", description: "t" } })
    .json<{ ok: boolean }>()
  expect(c1).toEqual({ ok: true })

  const l1 = await ky
    .get("things/list")
    .json<{ things: { thing_id: string }[] }>()
  const deletedId = l1.things[0].thing_id

  await ky
    .post("things/delete", {
      body: new URLSearchParams({ thing_id: deletedId }),
    })
    .json<{ ok: boolean }>()

  const c2 = await ky
    .post("things/create", { json: { name: "New", description: "n" } })
    .json<{ ok: boolean }>()
  expect(c2).toEqual({ ok: true })

  const l2 = await ky
    .get("things/list")
    .json<{ things: { thing_id: string }[] }>()
  expect(l2.things).toHaveLength(1)
  expect(l2.things[0].thing_id).not.toBe(deletedId)
})

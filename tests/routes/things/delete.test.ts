import { getTestServer } from "tests/fixtures/get-test-server"
import { test, expect } from "bun:test"

test("delete an existing thing removes it from the list", async () => {
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

  const { things } = await ky
    .get("things/list")
    .json<{ things: { thing_id: string; name: string }[] }>()

  const toDelete = things.find((t) => t.name === "Thing1")!
  expect(toDelete).toBeDefined()

  const deleteRes = await ky.post("things/delete", {
    body: new URLSearchParams({
      thing_id: toDelete.thing_id,
    }),
  })
  expect(await deleteRes.json<{ ok: boolean }>()).toEqual({ ok: true })

  const data = await ky
    .get("things/list")
    .json<{ things: { thing_id: string; name: string }[] }>()

  expect(data.things).toHaveLength(1)
  expect(data.things[0].name).toBe("Thing2")
  expect(
    data.things.find((t) => t.thing_id === toDelete.thing_id),
  ).toBeUndefined()
})

test("deleting one of several things keeps the others intact", async () => {
  const { ky } = await getTestServer()

  const names = ["A", "B", "C", "D"]
  for (const name of names) {
    await ky.post("things/create", {
      json: { name, description: `${name} Description` },
    })
  }

  const { things } = await ky
    .get("things/list")
    .json<{ things: { thing_id: string; name: string }[] }>()

  const target = things.find((t) => t.name === "B")!
  await ky.post("things/delete", {
    body: new URLSearchParams({ thing_id: target.thing_id }),
  })

  const data = await ky
    .get("things/list")
    .json<{ things: { name: string }[] }>()

  expect(data.things.map((t) => t.name).sort()).toEqual(["A", "C", "D"])
})

test("deleting a non-existent thing_id still succeeds without changing the list", async () => {
  const { ky } = await getTestServer()

  await ky.post("things/create", {
    json: {
      name: "KeepMe",
      description: "KeepMe Description",
    },
  })

  // Documents current behavior: the delete route is idempotent and returns
  // ok: true even when the thing_id does not exist.
  const deleteRes = await ky.post("things/delete", {
    body: new URLSearchParams({ thing_id: "non-existent-thing-id" }),
  })
  expect(await deleteRes.json<{ ok: boolean }>()).toEqual({ ok: true })

  const data = await ky
    .get("things/list")
    .json<{ things: { name: string }[] }>()

  expect(data.things).toHaveLength(1)
  expect(data.things[0].name).toBe("KeepMe")
})

test("the same thing can be deleted twice without error (idempotent)", async () => {
  const { ky } = await getTestServer()

  await ky.post("things/create", {
    json: {
      name: "Thing1",
      description: "Thing1 Description",
    },
  })

  const { things } = await ky
    .get("things/list")
    .json<{ things: { thing_id: string }[] }>()

  const firstDelete = await ky.post("things/delete", {
    body: new URLSearchParams({ thing_id: things[0].thing_id }),
  })
  expect(await firstDelete.json<{ ok: boolean }>()).toEqual({ ok: true })

  const secondDelete = await ky.post("things/delete", {
    body: new URLSearchParams({ thing_id: things[0].thing_id }),
  })
  expect(await secondDelete.json<{ ok: boolean }>()).toEqual({ ok: true })

  const data = await ky.get("things/list").json<{ things: unknown[] }>()

  expect(data.things).toHaveLength(0)
})

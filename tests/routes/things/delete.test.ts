import { getTestServer } from "tests/fixtures/get-test-server"
import { test, expect } from "bun:test"

test("delete a thing", async () => {
  const { ky } = await getTestServer()

  // 1. Create a thing first
  const createRes = await ky
    .post("things/create", {
      json: {
        name: "Thing to Delete",
        description: "This thing will be deleted",
      },
    })
    .json<{ ok: boolean }>()

  expect(createRes.ok).toBe(true)

  // 2. List the things to get its generated thing_id
  const listBefore = await ky
    .get("things/list")
    .json<{ things: { thing_id: string; name: string }[] }>()

  expect(listBefore.things).toHaveLength(1)
  const thingId = listBefore.things[0].thing_id

  // 3. Delete the thing using URL-encoded form data
  const deleteRes = await ky
    .post("things/delete", {
      body: new URLSearchParams({ thing_id: thingId }),
    })
    .json<{ ok: boolean }>()

  expect(deleteRes.ok).toBe(true)

  // 4. Verify that the list is empty now
  const listAfter = await ky
    .get("things/list")
    .json<{ things: { thing_id: string; name: string }[] }>()

  expect(listAfter.things).toHaveLength(0)
})

test("delete is a no-op for unknown thing ids", async () => {
  const { ky } = await getTestServer()

  await ky.post("things/create", {
    json: {
      name: "Thing1",
      description: "Thing1 Description",
    },
  })

  const deleteResponse = await ky
    .post("things/delete", {
      body: new URLSearchParams({ thing_id: "missing" }),
    })
    .json<{ ok: boolean }>()

  expect(deleteResponse).toEqual({ ok: true })

  const data = await ky.get("things/list").json<{
    things: { thing_id: string; name: string; description: string }[]
  }>()

  expect(data.things).toEqual([
    {
      thing_id: "0",
      name: "Thing1",
      description: "Thing1 Description",
    },
  ])
})

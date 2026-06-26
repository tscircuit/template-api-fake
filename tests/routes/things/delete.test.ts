import { expect, test } from "bun:test"
import { getTestServer } from "tests/fixtures/get-test-server"

test("delete a thing with ky form data", async () => {
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

  const deleteResponse = await ky
    .post("things/delete", {
      body: new URLSearchParams({ thing_id: "0" }),
    })
    .json<{ ok: boolean }>()

  expect(deleteResponse).toEqual({ ok: true })

  const data = await ky.get("things/list").json<{
    things: { thing_id: string; name: string; description: string }[]
  }>()

  expect(data.things).toEqual([
    {
      thing_id: "1",
      name: "Thing2",
      description: "Thing2 Description",
    },
  ])
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

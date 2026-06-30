import { getTestServer } from "tests/fixtures/get-test-server"
import { test, expect } from "bun:test"

test("create a thing", async () => {
  const { ky } = await getTestServer()

  const response = await ky
    .post("things/create", {
      json: {
        name: "Thing1",
        description: "Thing1 Description",
      },
    })
    .json<{ ok: boolean }>()

  expect(response).toEqual({ ok: true })

  const data = await ky
    .get("things/list")
    .json<{ things: { name: string; description: string }[] }>()

  expect(data.things).toHaveLength(1)
  expect(data.things[0]).toMatchObject({
    name: "Thing1",
    description: "Thing1 Description",
  })
})

test("create a thing from url encoded form data", async () => {
  const { ky } = await getTestServer()

  const response = await ky
    .post("things/create", {
      body: new URLSearchParams({
        name: "Admin Thing",
        description: "Created from the admin form",
      }),
    })
    .json<{ ok: boolean }>()

  expect(response).toEqual({ ok: true })

  const data = await ky
    .get("things/list")
    .json<{ things: { name: string; description: string }[] }>()

  expect(data.things).toHaveLength(1)
  expect(data.things[0]).toMatchObject({
    name: "Admin Thing",
    description: "Created from the admin form",
  })
})

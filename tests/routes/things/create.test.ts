import { getTestServer } from "tests/fixtures/get-test-server"
import { test, expect } from "bun:test"

test("create and delete a thing with ky", async () => {
  const { ky } = await getTestServer()

  const createRes = await ky
    .post("things/create", {
      json: {
        name: "Thing1",
        description: "Thing1 Description",
      },
    })
    .json<{ ok: boolean }>()

  expect(createRes).toEqual({ ok: true })

  const data = await ky
    .get("things/list")
    .json<{ things: { thing_id: string; name: string; description: string }[] }>()

  expect(data.things).toHaveLength(1)
  expect(data.things[0]?.name).toBe("Thing1")
  expect(data.things[0]?.description).toBe("Thing1 Description")
})

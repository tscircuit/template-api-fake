import { getTestServer } from "tests/fixtures/get-test-server"
import { test, expect } from "bun:test"

test("create a thing", async () => {
  const { ky } = await getTestServer()

  const createRes = await ky
    .post("things/create", {
      json: {
        name: "Thing1",
        description: "Thing1 Description",
      },
    })
    .json<{ ok: boolean }>()

  expect(createRes.ok).toBe(true)

  const data = await ky
    .get("things/list")
    .json<{ things: { name: string; description: string }[] }>()

  expect(data.things).toHaveLength(1)
  expect(data.things[0].name).toBe("Thing1")
  expect(data.things[0].description).toBe("Thing1 Description")
})

import { getTestServer } from "tests/fixtures/get-test-server"
import { test, expect } from "bun:test"

test("create a thing", async () => {
  const { ky } = await getTestServer()

  const response = await ky.post("things/create", {
    json: {
      name: "Thing1",
      description: "Thing1 Description",
    },
  })
  
  expect(response.status).toBe(200)
  const createData = await response.json<{ ok: boolean }>()
  expect(createData.ok).toBe(true)

  const data = await ky
    .get("things/list")
    .json<{ things: { name: string; description: string }[] }>()

  expect(data.things).toHaveLength(1)
})

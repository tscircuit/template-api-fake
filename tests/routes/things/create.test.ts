import { getTestServer } from "tests/fixtures/get-test-server"
import { test, expect } from "bun:test"

test("create a thing", async () => {
  const { ky } = await getTestServer()

  ky.post("things/create", {
    json: {
      name: "Thing1",
      description: "Thing1 Description",
    },
  })

  const data = await ky
    .get("things/list")
    .json<{ things: { name: string; description: string }[] }>()

  expect(data.things).toHaveLength(1)
})

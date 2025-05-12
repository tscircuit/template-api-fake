import { getTestServer, kyHandler } from "tests/fixtures/get-test-server"
import { test, expect } from "bun:test"

test("create a thing", async () => {
  const { ky } = await getTestServer()
  
  ky.post("things/create", {
    json: {
      name: "Thing1",
      description: "Thing1 Description",
    }
  })
  
  const response = await ky.get("things/list")
  const { status, data } = await kyHandler(response)
  expect(status).toBe(200)
  expect(data.things).toHaveLength(1)
})

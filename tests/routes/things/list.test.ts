import { getTestServer } from "tests/fixtures/get-test-server"
import { test, expect } from "bun:test"

test("list things", async () => {
  const { ky } = await getTestServer()

  // First, check empty list
  const emptyData = await ky
    .get("things/list")
    .json<{ things: { name: string; description: string }[] }>()
  expect(emptyData.things).toHaveLength(0)

  // Create a thing
  await ky.post("things/create", {
    json: {
      name: "List Thing",
      description: "Description for list thing",
    },
  })

  // Check list again
  const data = await ky
    .get("things/list")
    .json<{ things: { name: string; description: string }[] }>()

  expect(data.things).toHaveLength(1)
  expect(data.things[0].name).toBe("List Thing")
  expect(data.things[0].description).toBe("Description for list thing")
})

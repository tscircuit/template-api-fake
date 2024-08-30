import { getTestServer } from "tests/fixtures/get-test-server"
import { test, expect } from "bun:test"

test("create a thing", async () => {
  const { axios } = await getTestServer()

  axios.post("/things/create", {
    name: "Thing1",
    description: "Thing1 Description",
  })

  const { data } = await axios.get("/things/list")

  expect(data.things).toHaveLength(1)
})

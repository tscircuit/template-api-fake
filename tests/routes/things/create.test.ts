import { expect, test } from "bun:test"
import { getTestServer } from "tests/fixtures/get-test-server"

test("create a thing", async () => {
  const { ky } = await getTestServer()

  const createResponse = await ky
    .post("things/create", {
      json: {
        name: "Thing1",
        description: "Thing1 Description",
      },
    })
    .json<{ ok: boolean }>()

  expect(createResponse).toEqual({ ok: true })

  const data = await ky
    .get("things/list")
    .json<{ things: { name: string; description: string }[] }>()

  expect(data.things).toHaveLength(1)
})

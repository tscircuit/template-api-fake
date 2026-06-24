import { expect, test } from "bun:test"
import { getTestServer } from "tests/fixtures/get-test-server"

test("list starts empty and returns created things in insertion order", async () => {
  const { ky } = await getTestServer()

  const emptyData = await ky.get("things/list").json<{ things: unknown[] }>()

  expect(emptyData.things).toEqual([])

  const things = [
    {
      name: "Thing1",
      description: "Thing1 Description",
    },
    {
      name: "Thing2",
      description: "Thing2 Description",
    },
  ]

  for (const thing of things) {
    const createData = await ky
      .post("things/create", {
        json: thing,
      })
      .json<{ ok: boolean }>()

    expect(createData).toEqual({ ok: true })
  }

  const data = await ky
    .get("things/list")
    .json<{
      things: { thing_id: string; name: string; description: string }[]
    }>()

  expect(data.things).toEqual([
    {
      thing_id: "0",
      ...things[0],
    },
    {
      thing_id: "1",
      ...things[1],
    },
  ])
})

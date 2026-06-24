import { expect, test } from "bun:test"
import { getTestServer } from "tests/fixtures/get-test-server"

test("delete a thing by id and ignore missing ids", async () => {
  const { ky } = await getTestServer()

  await ky
    .post("things/create", {
      json: {
        name: "Thing1",
        description: "Thing1 Description",
      },
    })
    .json<{ ok: boolean }>()

  const beforeDelete = await ky
    .get("things/list")
    .json<{
      things: { thing_id: string; name: string; description: string }[]
    }>()

  expect(beforeDelete.things).toHaveLength(1)

  const deleteData = await ky
    .post("things/delete", {
      body: new URLSearchParams({
        thing_id: beforeDelete.things[0]!.thing_id,
      }),
    })
    .json<{ ok: boolean }>()

  expect(deleteData).toEqual({ ok: true })

  const afterDelete = await ky.get("things/list").json<{ things: unknown[] }>()
  expect(afterDelete.things).toHaveLength(0)

  const missingDeleteData = await ky
    .post("things/delete", {
      body: new URLSearchParams({
        thing_id: "missing",
      }),
    })
    .json<{ ok: boolean }>()

  expect(missingDeleteData).toEqual({ ok: true })

  const data = await ky.get("things/list").json<{ things: unknown[] }>()
  expect(data.things).toHaveLength(0)
})

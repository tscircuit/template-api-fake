import { it, expect } from "bun:test"
import { getTestServer } from "tests/fixtures/get-test-server"

it("GET /health should return ok", async () => {
  const { ky } = await getTestServer()
  const res = await ky.get("health")
  expect(res.status).toBe(200)
  const data = await res.json()
  expect(data).toEqual({ ok: true })
})

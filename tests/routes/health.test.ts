import { it, expect } from "bun:test"
import { getTestServer, kyHandler } from "tests/fixtures/get-test-server"

it("GET /health should return ok", async () => {
  const { ky } = await getTestServer()
  const response = await ky.get("health");
  const { status, data } = await kyHandler(response);
  expect(status).toBe(200)
  expect(data).toEqual({ ok: true })
})

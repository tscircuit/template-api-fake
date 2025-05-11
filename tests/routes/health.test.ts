import { it, expect } from "bun:test"
import { getTestServer, kyHandler } from "tests/fixtures/get-test-server"

it("GET /health should return ok", async () => {
  const { axios } = await getTestServer()
  const { status, data } = await kyHandler(await axios.get("health"));
  expect(status).toBe(200)
  expect(data).toEqual({ ok: true })
})

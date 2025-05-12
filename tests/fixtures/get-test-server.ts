import { afterEach } from "bun:test"
import { tmpdir } from "node:os"
import ky from "ky"
import { startServer } from "./start-server"

interface TestFixture {
  url: string
  server: any
  ky: typeof ky
}

export const getTestServer = async (): Promise<TestFixture> => {
  const port = 3001 + Math.floor(Math.random() * 999)
  const testInstanceId = Math.random().toString(36).substring(2, 15)
  const testDbName = `testdb${testInstanceId}`

  const server = await startServer({
    port,
    testDbName,
  })

  const url = `http://127.0.0.1:${port}`
  const kyInstance = ky.create({
    prefixUrl: url,
  })

  afterEach(async () => {
    await server.stop()
    // Here you might want to add logic to drop the test database
  })

  return {
    url,
    server,
    ky: kyInstance,
  }
}

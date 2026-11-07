import { afterEach } from "bun:test"
import { tmpdir } from "node:os"
import ky, { type KyInstance } from "ky"
import { startServer } from "./start-server"

interface TestFixture {
  url: string
  server: any
  ky: KyInstance
}

export const getTestServer = async (): Promise<TestFixture> => {
  const port = 3000 + Math.floor(Math.random() * 60000)

  const server = await startServer({
    port,
    testDbPath: `${tmpdir()}/test-${port}.sqlite`,
  })

  const url = `http://127.0.0.1:${port}`
  const kyInstance = ky.create({
    prefixUrl: url,
  })

  afterEach(async () => {
    if (server?.stop) {
      await server.stop()
    }
  })

  return {
    url,
    server,
    ky: kyInstance,
  }
}

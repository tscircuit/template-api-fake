// Migrated HTTP client from `redaxios` to `ky`.
//
// Why: `ky` is a modern, actively maintained fetch wrapper with a smaller
// footprint, native ESM support, automatic JSON parsing, and a richer
// hook/retry API than `redaxios`. This template now uses `ky` as its sole
// HTTP client.
//
// Migration notes (redaxios -> ky):
//   - `redaxios.get(url, { params })`  -> `ky.get(url, { searchParams })`
//   - `redaxios.post(url, body)`       -> `ky.post(url, { json: body })`
//   - Response body is already parsed  -> use `await res.json()`
//   - Non-2xx responses throw by default (`throwHttpErrors: true`)
//   - Base URL / headers are set via `ky.create({ prefixUrl, headers })`

import ky from "ky"

/**
 * Shared, pre-configured ky client for the fake API template.
 * Replace `prefixUrl` with the real API origin when wiring this up.
 */
export const api = ky.create({
  prefixUrl: "https://api.example.com",
  timeout: 10_000,
  retry: {
    limit: 2,
    methods: ["get"],
    statusCodes: [408, 429, 500, 502, 503, 504],
  },
  headers: {
    Accept: "application/json",
  },
})

export interface Item {
  id: number
  name: string
}

/** GET /items -> Item[] */
export async function getItems(): Promise<Item[]> {
  return api.get("items").json<Item[]>()
}

/** GET /items/:id -> Item (404 throws HTTPError) */
export async function getItem(id: number): Promise<Item> {
  return api.get(`items/${id}`).json<Item>()
}

/** POST /items -> Item */
export async function createItem(name: string): Promise<Item> {
  return api.post("items", { json: { name } }).json<Item>()
}

/**
 * Example of ky's typed error handling. `redaxios` returned a resolved
 * response for non-2xx; `ky` throws `HTTPError`, so callers should catch it.
 */
export async function safeGetItem(id: number): Promise<Item | null> {
  try {
    return await getItem(id)
  } catch (err) {
    if (err instanceof ky.HTTPError && err.response.status === 404) {
      return null
    }
    throw err
  }
}

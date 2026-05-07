# Template API Project

This is a template project with best-practice modules:
- Winterspec for defining the API
- bun testing
- Zustand store with zod definition for database state
- [ky](https://github.com/sindresorhus/ky) as the HTTP client in test fixtures (replaces redaxios)

## HTTP Client

This template uses [ky](https://github.com/sindresorhus/ky) for making HTTP requests in tests. ky is a modern, lightweight HTTP client built on the Fetch API.

Example usage in tests:

```ts
const { ky } = await getTestServer()

// POST with JSON body
await ky.post("things/create", { json: { name: "Thing1", description: "..." } })

// GET and parse JSON response
const data = await ky.get("things/list").json<{ things: Thing[] }>()
```

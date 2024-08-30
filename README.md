# Template API Project

This is a template project with best-practice modules:
- Winterspec for defining the API
- bun testing
- Zustand store with zod definition for database state

## Running Tests

To run tests, you need to have postgres database running locally and passwordless
in the background. This can be done with this command:

```bash
docker run -d --rm -p 5432:5432 -e POSTGRES_HOST_AUTH_METHOD=trust postgres:16
```

I recommend aliasing this on your system to `pgbg` to make it easier to run,
it's a common testing requirement in tscircuit server projects.

Read more about [the testing pattern here](https://seve.blog/p/a-simple-pattern-for-api-testing)

## Misc Details

- Soups are part of a Soup Group. A Soup will have a name and generally only
  one soup is rendered at a time. Two soups may not share the same name.
- Generally the url to access a soup group is `debug.tscircuit.com/USERNAME/SOUP_GROUP_NAME`

import { withRouteSpec } from "lib/middleware/with-winter-spec"

export default withRouteSpec({
  methods: ["GET"],
})((req, ctx) => {
  // Redirect to the admin page
  return new Response(null, {
    status: 302,
    headers: {
      Location: "/_fake/admin",
    },
  })
})

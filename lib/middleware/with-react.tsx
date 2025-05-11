import React from "react"
import { renderToString } from "react-dom/server"
import type { Middleware } from "winterspec/middleware"
import type { ReactNode } from "react"
import { Fragment } from "react"

const tailwindStyle = `
.btn {
  @apply text-white visited:text-white m-1 bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded;
}
a {
  @apply underline text-blue-600 hover:text-blue-800 visited:text-purple-800 m-1;
}
h2 {
  @apply text-xl font-bold my-2;
}
input, select {
  @apply border border-gray-300 rounded p-1 ml-0.5;
}
form {
  @apply inline-flex flex-col gap-2 border border-gray-300 rounded p-2 m-2 text-xs;
}
button {
  @apply bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded;
}
`

const renderBreadcrumbs = (pathComponents: string[]) =>
  pathComponents.map((component, index) => (
    <Fragment key={index}>
      <span className="px-0.5 text-gray-500">/</span>
      <a href={`/${pathComponents.slice(0, index + 1).join("/")}`}>
        {component}
      </a>
    </Fragment>
  ))

const renderTimezoneDropdown = (timezone: string) => (
  <select
    id="timezone-select"
    className="text-xs"
    onChange={(e) => {
      document.cookie = `timezone=${e.currentTarget.value};path=/`
      location.reload()
    }}
    defaultValue={timezone}
  >
    <option value="UTC">UTC</option>
    <option value="America/Los_Angeles">Pacific</option>
    <option value="Asia/Kolkata">IST</option>
  </select>
)

export const withReact: Middleware<
  {},
  { react: (component: ReactNode) => Response }
> = async (req, ctx, next) => {
  ctx.react = (component: ReactNode) => {
    const pathComponents = new URL(req.url).pathname.split("/").filter(Boolean)
    const timezone = req.headers.get("X-Timezone") || "UTC"

    const html = renderToString(
      <html lang="en">
        <head>
          <script src="https://cdn.tailwindcss.com" />
          <style type="text/tailwindcss">{tailwindStyle}</style>
        </head>
        <body>
          <div>
            <div className="border-b border-gray-300 py-1 flex justify-between items-center">
              <div>
                <span className="px-1 pr-2">admin panel</span>
                {renderBreadcrumbs(pathComponents)}
              </div>
              <div className="mr-2 flex items-center">
                <div className="text-xs text-gray-500 mr-1">
                  {new Date().toLocaleString()}
                </div>
                {renderTimezoneDropdown(timezone)}
              </div>
            </div>
            <div className="flex flex-col text-xs p-1">{component}</div>
          </div>
        </body>
      </html>
    )

    return new Response(html, {
      headers: {
        "Content-Type": "text/html",
      },
    })
  }

  return await next(req, ctx)
}

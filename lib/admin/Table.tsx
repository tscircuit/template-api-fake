import React from "react"
import { timeAgo } from "./time-ago"

declare global {
  var timezone: string
}

const pluralize = (resource: string) => {
  if (resource.endsWith("s")) return resource
  return resource.endsWith("y") ? `${resource.slice(0, -1)}ies` : `${resource}s`
}

const removeResourcePrefixes = (resource: string) => {
  if (resource.startsWith("creator_")) return resource.slice(8)
  if (resource.startsWith("owner_")) return resource.slice(6)
  if (resource.startsWith("personal_")) return resource.slice(9)
  return resource
}

const DOWNLOADABLE_COLUMNS = [
  "input_circuit_json",
  "output_pcb_circuit_json",
  "output_ses",
  "input_dsn",
]

const Cell = ({
  columnKey,
  cellValue,
  timezone,
}: {
  columnKey: string
  cellValue: any
  timezone: string
}) => {
  if (typeof cellValue === "boolean") return <>{String(cellValue)}</>
  if (cellValue === null || cellValue === undefined) return <></>
  if (React.isValidElement(cellValue)) return cellValue

  // Handle arrays of IDs (e.g., account_ids)
  if (columnKey.endsWith("_ids") && Array.isArray(cellValue)) {
    const resource = pluralize(columnKey.slice(0, -4)) // e.g., "account_ids" -> "accounts"
    return (
      <div className="flex flex-col space-y-1">
        {cellValue.map((id: string, index: number) => (
          <a
            key={index}
            href={`/admin/${removeResourcePrefixes(resource)}/get?${removeResourcePrefixes(columnKey.slice(0, -1))}=${id}`}
            className="text-blue-500 hover:underline"
          >
            {id?.split("-")?.[0]}...
          </a>
        ))}
      </div>
    )
  }

  // Handle single IDs
  if (columnKey.endsWith("_id") && typeof cellValue === "string") {
    const resource = pluralize(columnKey.slice(0, -3)) // e.g., "account_id" -> "accounts"
    return (
      <a
        href={`/admin/${removeResourcePrefixes(pluralize(resource))}/get?${removeResourcePrefixes(columnKey)}=${cellValue}`}
      >
        {cellValue?.split("-")?.[0]}
      </a>
    )
  }

  if (columnKey === "autorouting_cache_key") {
    return (
      <div className="flex flex-col space-y-1">
        {cellValue}
        <a
          href={`/admin/autorouting_jobs/list?autorouting_cache_key=${cellValue}`}
        >
          (used by)
        </a>
        <a
          href={`/admin/autorouting_jobs/list?autorouting_cache_key=${cellValue}&completed_using_cache=false`}
        >
          (created by)
        </a>
      </div>
    )
  }
  if (columnKey.endsWith("_at")) {
    return <span className="tabular-nums">{timeAgo(cellValue, timezone)}</span>
  }
  if (DOWNLOADABLE_COLUMNS.includes(columnKey)) {
    let b64: string
    let filename: string
    let contentType: string
    if (typeof cellValue === "object") {
      const jsonStr = JSON.stringify(cellValue, null, 2)
      b64 = Buffer.from(jsonStr).toString("base64")
      filename = `${columnKey.replace("_json", "")}.json`
      contentType = "application/json"
    } else if (typeof cellValue === "string") {
      b64 = Buffer.from(cellValue).toString("base64")
      filename = `${columnKey.split("_").slice(0, -1).join("_")}.${columnKey.split("_").pop()}`
      contentType = "application/octet-stream"
    } else {
      throw new Error(`Unknown cell value type: ${typeof cellValue}`)
    }
    return (
      <div
        // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
        dangerouslySetInnerHTML={{
          __html: `<button
          class="bg-transparent hover:bg-transparent font-normal text-blue-500 hover:text-blue-700 py-1 px-2 rounded"
        onclick="(function(){
          const a = document.createElement('a');
          const content = atob('${b64}');
          const blob = new Blob([content], {type: '${contentType}'});
          a.href = window.URL.createObjectURL(blob);
          a.download = '${filename}';
          a.click();
          window.URL.revokeObjectURL(a.href);
        })();return false;"
      >
        Download
      </button>`,
        }}
      />
    )
  }
  if (typeof cellValue === "object") {
    // Return expandable <pre> with <details> tag
    return (
      <details>
        <summary>{JSON.stringify(cellValue).slice(0, 40)}</summary>
        <pre>{JSON.stringify(cellValue, null, 2)}</pre>
      </details>
    )
  }
  return <>{String(cellValue)}</>
}

export const Table = ({
  rows,
  obj,
  timezone,
}: {
  rows?: Record<string, any>[]
  obj?: Record<string, any>
  timezone?: string
}) => {
  if (!timezone) {
    timezone = globalThis.timezone ?? "UTC"
  }
  if (obj) {
    const entries = Object.entries(obj)
    return (
      <table className="border border-gray-300 text-xs border-collapse p-1 tabular-nums">
        <thead>
          <tr>
            <th className="p-1 border border-gray-300">Key</th>
            <th className="p-1 border border-gray-300">Value</th>
          </tr>
        </thead>
        <tbody>
          {entries.map(([key, value], index) => (
            <tr key={index}>
              <td className="border border-gray-300 p-1">{key}</td>
              <td className="border border-gray-300 p-1">
                <Cell columnKey={key} cellValue={value} timezone={timezone!} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  if (!rows || rows.length === 0)
    return (
      <div className="border border-gray-300 p-1 py-4 mx-4 bg-gray-50 text-gray-500 text-center">
        Empty Table
      </div>
    )

  const keys = Object.keys(rows[0]!)

  return (
    <table className="border border-gray-300 text-xs border-collapse p-1">
      <thead>
        <tr>
          {keys.map((key) => (
            <th key={key} className="p-1 border border-gray-300">
              {key}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {keys.map((key) => (
              <td key={key} className="border border-gray-300 p-1">
                <Cell
                  columnKey={key}
                  cellValue={row[key]}
                  timezone={timezone!}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

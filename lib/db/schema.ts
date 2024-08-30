import { z } from "zod"

// When defining your database schema, try to use snake case for column names.

export const thingSchema = z.object({
  thing_id: z.string(),
  name: z.string(),
  description: z.string(),
})
export type Thing = z.infer<typeof thingSchema>

export const databaseSchema = z.object({
  idCounter: z.number().default(0),
  things: z.array(thingSchema).default([]),
})
export type DatabaseSchema = z.infer<typeof databaseSchema>

import { z } from "zod";

const authEntrySchema = z.object({
  key: z.string().trim().min(1, "Key is required"),
  value: z.string().min(1, "Value is required"),
  show: z.boolean().optional(),
  isEncrypted: z.boolean().optional(),
});

export const mcpServerSchema = z.object({
  server: z
    .object({
      id: z.string().min(1, "Server id is required"),
    })
    .optional(),

  authentication: z.array(authEntrySchema),
});

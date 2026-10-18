import { z } from "zod";

export const roomsSchema = z.object({
  name: z
    .string()
    .min(6, { message: "Имя комнаты должно быть не менее 6 символов" }),
  isPrivate: z.boolean(),
  password: z.string().optional(),
});

export type RoomsSchemaValue = z.infer<typeof roomsSchema>;

import { z } from "zod";

export const loginScheme = z.object({
  username: z
    .string()
    .min(2, { message: "Имя должно быть не менее 2 символов" }),
  password: z
    .string()
    .min(6, { message: "Пароль должен быть не менее 6 символов" }),
});

export type LoginFormValues = z.infer<typeof loginScheme>;

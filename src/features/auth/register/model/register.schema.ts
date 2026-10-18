import z from "zod";

export const registerScheme = z.object({
  username: z
    .string()
    .min(2, { message: "Имя должно быть не менее 2 символов" }),
  password: z
    .string()
    .min(6, { message: "Пароль должен быть не менее 6 символов" }),
});

export type registerFormValues = z.infer<typeof registerScheme>;

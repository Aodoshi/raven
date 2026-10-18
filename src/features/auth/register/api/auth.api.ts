import type { registerFormValues } from "@/features/auth/register/model/register.schema";

import { $api } from "@/shared/api/axios";

export const registerUser = async (data: registerFormValues) => {
  const response = await $api.post("/register", data);

  return response.data;
};

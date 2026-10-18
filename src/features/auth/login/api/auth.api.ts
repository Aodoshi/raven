import type { registerFormValues } from "@/features/auth/register/model/register.schema";

import { $api } from "@/shared/api/axios";

export const loginUser = async (data: registerFormValues) => {
  const response = await $api.post("/login", data);

  return response.data;
};

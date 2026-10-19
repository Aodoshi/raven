import { $api } from "@/shared/api/axios";

export const getMe = async () => {
  const response = await $api.get("/me");
  return response.data;
};

import { $api } from "@/shared/api/axios";

export const deleteRoom = (id: string, password: string) =>
  $api.delete(`/rooms/${id}`, { data: { password } });

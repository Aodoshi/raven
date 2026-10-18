import { $api } from "@/shared/api/axios";
import type { Room } from "../model/types";

export const getRooms = async (): Promise<Room[]> => {
  const { data } = await $api.get("/rooms");

  return data.map((r: any) => ({
    id: r.id,
    name: r.name,
    isPrivate: Boolean(r.is_private),
    ownerName: r.owner_name,
  }));
};

import { $api } from "@/shared/api/axios";
import type { RoomsSchemaValue } from "../model/schema";

export const uploadRoom = async (data: RoomsSchemaValue) => {
  try {
    await $api.post("/rooms", data);
  } catch (err) {
    console.log(err);
  }
};

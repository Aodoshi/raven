import { useEffect, useState } from "react";
import { $api } from "@/shared/api/axios";
import type { Sticker } from "../model/types";

export const useSticker = () => {
  const [error, setError] = useState<string>("");
  const [stickers, setStickers] = useState<Sticker[]>([]);

  useEffect(() => {
    $api
      .get("/stickers")
      .then(({ data }) => setStickers(data))
      .catch(() => setError("couldn't load stickers"));
  }, []);

  const handleUploadSticker = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target?.files?.[0];

    e.target.value = "";

    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      return setError("need jpg, png or webp");
    }

    if (file.size > 2 * 1024 * 1024) {
      return setError("max is 2mb");
    }

    const form = new FormData();
    form.append("sticker", file);

    setError("");

    try {
      const { data } = await $api.post("/stickers", form);
      setStickers((prev) => [...prev, data.data]);
    } catch {
      setError("error on loading sticker, something went wrong");
    }
  };

  return { stickers, error, handleUploadSticker };
};

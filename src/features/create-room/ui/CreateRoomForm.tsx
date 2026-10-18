import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { RoomsSchemaValue } from "../model/schema";
import { roomsSchema } from "../model/schema";
import { Button } from "@/shared/ui/button";
import { uploadRoom } from "../api/createRoom";

export const CreateRoomForm = ({ onCreated }: { onCreated: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const inputClass =
    "h-11 w-full rounded-lg border border-white/10 bg-black/20 px-3.5 text-sm text-white outline-none transition-colors placeholder:text-slate-600 focus:border-white/40 focus:ring-2 focus:ring-white/10";

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: {},
  } = useForm<RoomsSchemaValue>({
    resolver: zodResolver(roomsSchema),
    defaultValues: {
      isPrivate: false,
      password: "",
    },
  });

  const isPrivate = useWatch({ control, name: "isPrivate" });

  const handleAddRoom = async (data: RoomsSchemaValue) => {
    await uploadRoom(data);
    (reset(), setIsOpen(false), onCreated());
  };

  return (
    <div>
      <Button className="mb-7 mt-5" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "Отменить" : "Создать комнату"}
      </Button>
      {isOpen && (
        <form
          onSubmit={handleSubmit(handleAddRoom)}
          className="flex w-full max-w-sm flex-col gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-5"
        >
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="room-name"
              className="text-sm font-medium text-slate-300"
            >
              Название комнаты
            </label>
            <input
              id="room-name"
              type="text"
              placeholder="Введите имя комнаты"
              autoComplete="off"
              className={inputClass}
              {...register("name")}
            />
          </div>

          <label
            htmlFor="room-checkbox"
            className="flex cursor-pointer select-none items-center gap-3 text-sm text-slate-300"
          >
            <input
              id="room-checkbox"
              type="checkbox"
              className="h-4 w-4 cursor-pointer rounded border-white/20 bg-black/20 accent-white"
              {...register("isPrivate")}
            />
            Приватная комната
          </label>

          {isPrivate && (
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="room-password"
                className="text-sm font-medium text-slate-300"
              >
                Пароль комнаты
              </label>
              <input
                id="room-password"
                type="password"
                placeholder="Введите пароль"
                autoComplete="new-password"
                className={inputClass}
                {...register("password")}
              />
            </div>
          )}

          <Button type="submit" className="w-full">
            Создать
          </Button>
        </form>
      )}
    </div>
  );
};

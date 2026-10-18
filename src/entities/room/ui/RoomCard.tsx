import { $api } from "@/shared/api/axios";
import type { Room } from "../model/types";
import { useNavigate } from "react-router-dom";
interface Props {
  room: Room;
  actions?: React.ReactNode;
}

export const RoomCard = ({ room, actions }: Props) => {
  const navigate = useNavigate();

  const handleNavigate = async (id: string) => {
    if (!room.isPrivate) {
      navigate(`/rooms/${id}`);
      return;
    }

    const password = prompt("Введите пароль от комнаты");

    if (password === null) return;

    try {
      const res = await $api.post(`/rooms/${id}/verify`, { password });

      if (res.data.success) {
        navigate(`/rooms/${id}`);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Неверный пароль";
      alert(errorMessage);
    }
  };

  return (
    <div
      onClick={() => handleNavigate(room.id)}
      key={room.id}
      className="group flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm transition-all duration-200 hover:border-white/20 hover:bg-white/[0.07]"
    >
      <p className="min-w-0 flex-1 truncate text-sm font-medium text-zinc-200 transition-colors group-hover:text-white sm:text-base">
        Название: {room.name}
      </p>

      <p className="shrink-0 rounded-full border border-white/10 bg-black/20 px-2.5 py-0.5 text-xs text-slate-400">
        {room.isPrivate ? "Приватная комната" : "Публичная"}
      </p>
      <p className="shrink-0 rounded-full border border-white/10 bg-black/20 px-2.5 py-0.5 text-xs text-slate-400">
        Создатель комнаты: {room.ownerName}
      </p>

      {actions}
    </div>
  );
};

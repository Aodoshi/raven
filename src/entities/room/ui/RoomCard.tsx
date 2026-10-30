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
      key={room.id}
      onClick={() => handleNavigate(room.id)}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
      className="group relative h-40 w-full cursor-pointer rounded-2xl border border-zinc-800 bg-zinc-950 transition-all duration-300 hover:-translate-y-0.5 hover:border-zinc-600"
    >
      <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-2xl p-4">
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(220px circle at var(--mx, 50%) var(--my, 0%), rgba(255,255,255,0.045), transparent 70%)",
          }}
        />

        <div className="relative z-10 flex items-center justify-between">
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-600 transition-colors duration-300 group-hover:text-zinc-400">
            Realm
          </span>

          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-medium tracking-wide transition-colors duration-300 ${
              room.isPrivate
                ? "border-zinc-800 text-zinc-500"
                : "border-zinc-700 text-zinc-300"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                room.isPrivate ? "bg-zinc-600" : "bg-zinc-300"
              }`}
            />
            {room.isPrivate ? "Запечатано" : "Открыто"}
          </span>
        </div>

        <div className="relative z-10 my-auto flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 transition-colors duration-300 group-hover:border-zinc-600">
            <span className="select-none font-serif text-base text-zinc-600 transition-colors duration-300 group-hover:text-zinc-200">
              𝕯
            </span>
          </div>
          <h3 className="truncate font-serif text-base font-medium tracking-wide text-zinc-300 transition-colors duration-300 group-hover:text-white">
            {room.name}
          </h3>
        </div>

        <div className="relative z-10 flex items-center justify-between border-t border-zinc-900 pt-2.5">
          <div className="flex min-w-0 items-center gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-[9px] font-semibold uppercase text-zinc-300">
              {room.ownerName?.[0]}
            </span>
            <div className="flex min-w-0 flex-col leading-none">
              <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-zinc-600">
                Создатель
              </span>
              <span className="mt-1 truncate font-serif text-xs text-zinc-400 transition-colors group-hover:text-zinc-200">
                {room.ownerName}
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <span className="translate-x-2 text-zinc-400 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
              →
            </span>
            <div onClick={(e) => e.stopPropagation()}>{actions}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

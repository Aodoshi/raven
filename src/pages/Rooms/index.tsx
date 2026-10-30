import { RoomsList } from "@/widgets/rooms-list/ui/RoomsList";
import { useState } from "react";

export const Rooms = () => {
  const [search, setSearch] = useState<string>("");

  return (
    <div className="container flex flex-col gap-8 pb-16">
      <div className="flex flex-wrap items-end justify-between gap-4 pt-10">
        <h2 className="text-4xl font-semibold leading-none tracking-tight text-white sm:text-[55px]">
          Все комнаты
        </h2>

        {search.trim() && (
          <div className="flex items-center gap-1.5 px-0.5 mb-2 text-xs text-zinc-400 font-mono">
            <span className="text-zinc-600">//</span>
            <span>Поиск:</span>
            <span className="text-zinc-200 font-medium">«{search}»</span>
          </div>
        )}

        <div className="relative w-full max-w-xs">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 pointer-events-none transition-colors group-focus-within:text-zinc-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Искать комнату"
            className="w-full bg-zinc-900/90 border border-zinc-800 rounded-lg pl-9 pr-8 py-2 text-xs text-zinc-100 placeholder-zinc-500 outline-none transition-all duration-150 focus:border-zinc-700 focus:bg-zinc-900 focus:ring-1 focus:ring-zinc-700/50"
          />

          {search && (
            <button
              onClick={() => setSearch("")}
              type="button"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors p-0.5 rounded-sm"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      <RoomsList search={search} />
    </div>
  );
};

import addSticker from "@/shared/assets/free-icon-edit-1159633.png";
import { useSticker } from "../api/useSticker";
import { useRef, useState } from "react";

export const StickerPick = ({
  onSelect,
}: {
  onSelect: (stickerId: string) => void;
}) => {
  const [showStickers, setShowStickers] = useState(false);
  const stickerUploadRef = useRef<HTMLInputElement>(null);

  const { stickers, error, handleUploadSticker } = useSticker();

  const handleStickerClick = (stickerId: string) => {
    onSelect(stickerId);
    setShowStickers(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowStickers((prev) => !prev)}
        className={`flex cursor-pointer h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg transition-all duration-200 ${
          showStickers
            ? "bg-zinc-800 text-zinc-100 shadow-inner"
            : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
        }`}
      >
        ☺
      </button>

      {showStickers && (
        <div className="absolute bottom-14 left-0 z-50 w-80 sm:w-96 rounded-2xl border border-zinc-800 bg-[#0c0c0e]/95 p-4 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
          <div className="mb-3 flex items-center justify-between border-b border-zinc-800/60 pb-2 px-1">
            <span className="text-xs font-medium text-zinc-400 tracking-wider uppercase">
              Стикеры
            </span>
            <span className="text-[10px] text-zinc-600">
              {stickers.length} доступно
            </span>
          </div>

          <div className="flex max-h-64 flex-wrap gap-2.5 overflow-y-auto pr-1 custom-scrollbar">
            <input
              ref={stickerUploadRef}
              className="hidden"
              type="file"
              id="sticker-upload"
              onChange={handleUploadSticker}
            />

            <button
              type="button"
              onClick={() => stickerUploadRef.current?.click()}
              className="group flex cursor-pointer h-18 w-18 items-center justify-center rounded-xl border border-dashed border-zinc-700/60 bg-zinc-900/40 transition-all duration-200 hover:border-zinc-500 hover:bg-zinc-800/60"
              title="Загрузить стикер"
            >
              <img
                className="w-7 h-7 opacity-60 transition-transform duration-200 group-hover:scale-110 group-hover:opacity-100"
                src={addSticker}
                alt="add sticker"
              />
            </button>

            {stickers.map((sticker) => (
              <button
                key={sticker.id}
                type="button"
                onClick={() => handleStickerClick(sticker.id)}
                className="group relative cursor-pointer h-18 w-18 overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-1.5 transition-all duration-200 hover:border-zinc-600 hover:bg-zinc-800/80 hover:scale-[1.03]"
              >
                <img
                  src={sticker.url}
                  alt={sticker.id}
                  className="h-full w-full object-contain rounded-lg transition-transform duration-200 group-hover:scale-105"
                />
              </button>
            ))}
          </div>

          {error && (
            <div className="mt-3 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2">
              <p className="text-center text-xs text-red-400">{error}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

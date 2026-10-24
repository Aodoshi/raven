import { sendMessage } from "@/features/chat/api/chatSocket";
import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { sendTyping } from "@/features/chat/api/chatSocket";

const stickers = [
  {
    id: "mem1",
    url: "http://localhost:3001/stickers/alreadysixteen.jpg",
  },
  {
    id: "mem2",
    url: "http://localhost:3001/stickers/dima.jpg",
  },
  {
    id: "mem3",
    url: "http://localhost:3001/stickers/yosip.jpg",
  },
];

export const SendMessage = () => {
  const [text, setText] = useState("");

  const [showStickers, setShowStickers] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    sendMessage({ type: "text", text });
    setText("");
  };

  const handleStickerClick = (stickerId: string) => {
    sendMessage({ type: "sticker", stickerId });
    setShowStickers(false);
  };

  return (
    <div>
      {showStickers && (
        <div className="border-t border-zinc-800/80 bg-[#0d0d0f] px-3 py-3">
          <div className="grid grid-cols-3 gap-2">
            {stickers.map((sticker) => (
              <button
                key={sticker.id}
                type="button"
                onClick={() => handleStickerClick(sticker.id)}
                className="cursor-pointer rounded-xl border border-zinc-800/80 p-1 transition-colors hover:bg-zinc-800/20"
              >
                <img
                  src={sticker.url}
                  alt={sticker.id}
                  className="h-full w-full object-contain rounded-xl"
                />
              </button>
            ))}
          </div>
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 border-t border-zinc-800/80 p-3"
      >
        <button
          type="button"
          onClick={() => setShowStickers((prev) => !prev)}
          className="flex cursor-pointer h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-900 text-lg text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
        >
          ☺
        </button>
        <input
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (e.target.value.trim()) sendTyping();
          }}
          placeholder="Написать сообщение..."
          className="min-w-0 flex-1 rounded-lg bg-zinc-900 px-3.5 py-2.5 text-sm text-zinc-100 outline-none transition-colors placeholder:text-zinc-500 focus:bg-zinc-800"
        />

        <Button
          type="submit"
          size="sm"
          className="rounded-lg bg-zinc-100 px-4 text-zinc-950 hover:bg-zinc-300"
        >
          Отправить
        </Button>
      </form>
    </div>
  );
};

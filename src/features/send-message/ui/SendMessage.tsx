import { useState } from "react";
import { sendMessage, sendTyping } from "@/features/chat/api/chatSocket";
import { Button } from "@/shared/ui/button";
import { StickerPick } from "./StickerPick";

export const SendMessage = () => {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    sendMessage({ type: "text", text });
    setText("");
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 border-t border-zinc-800/80 p-3"
      >
        <StickerPick
          onSelect={(id) => sendMessage({ type: "sticker", stickerId: id })}
        />
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

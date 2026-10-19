import { useEffect, useState, useRef } from "react";
import { useRoomStore } from "@/entities/room/model/roomStore";
import { sendMessage } from "@/features/chat/api/chatSocket";
import { Button } from "@/shared/ui/button";
import { sendTyping } from "@/features/chat/api/chatSocket";
import { socket } from "@/shared/socket/socket";
import { MessageList } from "@/entities/message/ui/MessageList";
import { getMe } from "@/entities/user/api/getMe";

const stickers = [
  {
    id: "aydana1",
    url: "http://localhost:3001/stickers/aydana1.png",
  },
  {
    id: "aydana2",
    url: "http://localhost:3001/stickers/aydana2.png",
  },
  {
    id: "aydana3",
    url: "http://localhost:3001/stickers/aydana3.png",
  },
];

interface User {
  username: string;
  id: string;
}

export const Chat = () => {
  const [text, setText] = useState("");
  const [showStickers, setShowStickers] = useState(false);
  const [typingUser, setTypingUser] = useState("");
  const [me, setMe] = useState<User | null>(null);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const user = await getMe();
        setMe(user);
      } catch (error) {
        console.error("Не удалось загрузить профиль", error);
      }
    };

    fetchMe();
  }, []);

  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleTyping = ({ username }: { username: string }) => {
      setTypingUser(username);

      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
      }

      typingTimeout.current = setTimeout(() => {
        setTypingUser("");
        typingTimeout.current = null;
      }, 2000);
    };

    socket.on("user-typing", handleTyping);

    return () => {
      socket.off("user-typing", handleTyping);

      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
      }
    };
  }, []);

  const roomState = useRoomStore((state) => state.roomState);

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
    <div className="flex w-full max-w-md flex-col overflow-hidden rounded-xl border border-zinc-800/80 bg-[#111113] shadow-xl">
      <div className="flex items-center justify-between border-b border-zinc-800/80 px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold text-zinc-100">
            Чат комнаты - {roomState?.name}
          </h3>
          <p className="text-xs text-zinc-500">@{me?.username} </p>
        </div>
      </div>
      <div className="flex h-96 flex-col gap-3 overflow-y-auto px-4 py-4">
        <MessageList currentUsername={me?.username} />

        {typingUser && (
          <p className="flex items-start">{typingUser} Печатает...</p>
        )}
      </div>
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

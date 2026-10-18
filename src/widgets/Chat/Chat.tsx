import { useEffect, useState } from "react";
import { useRoomStore } from "@/entities/room/model/roomStore";
import { sendMessage } from "@/features/chat/api/chatSocket";
import { Button } from "@/shared/ui/button";
import { $api } from "@/shared/api/axios";
import { sendTyping } from "@/features/chat/api/chatSocket";
import { socket } from "@/shared/socket/socket";

interface User {
  id: number;
  username: string;
}

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

export const Chat = () => {
  const [text, setText] = useState("");
  const [me, setMe] = useState<User>();
  const [loading, setLoading] = useState(true);
  const [showStickers, setShowStickers] = useState(false);
  const [typingUser, setTypingUser] = useState("");

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const response = await $api.get("/me", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setMe(response.data);
      } catch (error) {
        console.error("Не удалось загрузить профиль", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, []);

  useEffect(() => {
    const handleTyping = ({ username }: { username: string }) => {
      setTypingUser(username);

      setTimeout(() => {
        setTypingUser("");
      }, 1000);
    };

    socket.on("user-typing", handleTyping);

    return () => {
      socket.off("user-typing", handleTyping);
    };
  }, []);

  const roomState = useRoomStore((state) => state.roomState);
  const messages = roomState?.messages || [];

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

  if (loading) {
    return <div className="container"> Загрузка... </div>;
  }

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
        {messages.map((message) => {
          const isOwnMessage = message.username === me?.username;
          return (
            <div
              key={message.id}
              className={`flex flex-col ${isOwnMessage ? "items-end" : "items-start"}`}
            >
              <strong className="mb-0.5 text-xs font-medium text-zinc-500">
                {message.username}
              </strong>
              {message.type === "sticker" ? (
                <div
                  className={`rounded-xl p-1 ${isOwnMessage ? "bg-zinc-100/5" : "bg-zinc-900"}`}
                >
                  <img
                    src={message.stickerUrl}
                    alt={message.stickerId}
                    className="h-28 w-28 object-contain rounded-xl"
                  />
                </div>
              ) : (
                <span
                  className={`max-w-[85%] break-words rounded-lg px-3 py-2 text-sm ${isOwnMessage ? "bg-zinc-100 text-zinc-950" : "bg-zinc-900 text-zinc-200"}`}
                >
                  {message.text}
                </span>
              )}
            </div>
          );
        })}
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

        {typingUser && (
          <div className="px-4 pb-2 text-xs text-zinc-500">
            {console.log(typingUser)} печатает...
          </div>
        )}
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

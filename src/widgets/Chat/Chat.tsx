import { useEffect, useState, useRef } from "react";
import { useRoomStore } from "@/entities/room/model/roomStore";
import { socket } from "@/shared/socket/socket";
import { MessageList } from "@/entities/message/ui/MessageList";
import { getMe } from "@/entities/user/api/getMe";
import { SendMessage } from "@/features/send-message/ui/SendMessage";
import { Button } from "@/shared/ui/button";

interface User {
  username: string;
  id: string;
}

export const Chat = () => {
  const [typingUser, setTypingUser] = useState("");
  const [me, setMe] = useState<User | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const isBottom = useRef(true);
  const roomState = useRoomStore((state) => state.roomState);

  const messageCount = roomState?.messages?.length;

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;

    isBottom.current = distanceFromBottom < 100;
    setShowScrollDown(distanceFromBottom > 150);
  };

  const onScrollDown = () => {
    const el = scrollRef.current;
    if (!el) return;

    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  };

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

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    if (isBottom.current) {
      el.scrollTo({ top: el.scrollHeight });
    }
  }, [messageCount, typingUser]);

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

      <div className="relative">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex h-96 flex-col gap-3 overflow-y-auto px-4 py-4"
        >
          <MessageList currentUsername={me?.username} />

          {typingUser && (
            <p className="flex items-start">{typingUser} Печатает...</p>
          )}
        </div>

        {showScrollDown && (
          <Button
            onClick={onScrollDown}
            className="absolute bottom-3 right-6 flex h-9 w-9 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 text-zinc-100 shadow-lg transition hover:bg-zinc-700"
            aria-label="Прокрутить вниз"
          >
            ↓
          </Button>
        )}
      </div>

      <SendMessage />
    </div>
  );
};

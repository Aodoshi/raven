import { useEffect, useState, useRef } from "react";
import { useRoomStore } from "@/entities/room/model/roomStore";
import { socket } from "@/shared/socket/socket";
import { MessageList } from "@/entities/message/ui/MessageList";
import { getMe } from "@/entities/user/api/getMe";
import { SendMessage } from "@/features/send-message/ui/SendMessage";

interface User {
  username: string;
  id: string;
}

export const Chat = () => {
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

      <SendMessage />
    </div>
  );
};

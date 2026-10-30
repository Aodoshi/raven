import { useRoomStore } from "@/entities/room/model/roomStore";
import { MessageItem } from "./MessageItem";

interface User {
  username: string;
  userId: string;
  avatarUrl: string;
}

interface MessageListProps {
  me: User | null;
}

export const MessageList = ({ me }: MessageListProps) => {
  const { roomState } = useRoomStore();

  const messages = roomState?.messages;

  if (!messages || messages.length === 0)
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <span className="text-zinc-600 text-xs font-mono tracking-widest uppercase mb-1">
          // empty
        </span>
        <p className="text-xs text-zinc-500 font-light">Сообщений пока нет</p>
      </div>
    );

  return (
    <div>
      {messages?.map((message) => (
        <MessageItem key={message.id} message={message} me={me} />
      ))}
    </div>
  );
};

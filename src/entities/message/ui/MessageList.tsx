import { useRoomStore } from "@/entities/room/model/roomStore";
import { MessageItem } from "./MessageItem";

interface MessageListProps {
  currentUsername: string | undefined;
}

export const MessageList = ({ currentUsername }: MessageListProps) => {
  const { roomState } = useRoomStore();

  const messages = roomState?.messages;

  return (
    <div>
      {messages?.map((message) => (
        <MessageItem
          key={message.id}
          message={message}
          currentUsername={currentUsername}
        />
      ))}
    </div>
  );
};

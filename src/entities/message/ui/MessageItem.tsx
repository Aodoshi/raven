import type { Message } from "@/entities/room/model/types";

interface MessageItemProps {
  message: Message;
  currentUsername: string | undefined;
}

export const MessageItem = ({ message, currentUsername }: MessageItemProps) => {
  const isOwnMessage = message.username === currentUsername;
  return (
    <div
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
};

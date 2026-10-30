import type { Message } from "@/entities/room/model/types";

interface User {
  username: string;
  userId: string;
  avatarUrl: string;
}

interface MessageItemProps {
  message: Message;
  me: User | null;
}

export const MessageItem = ({ message, me }: MessageItemProps) => {
  const isOwnMessage = message.username === me?.username;

  const SERVER_URL = "http://localhost:3001";

  const avatarSrc = message?.avatarUrl ? SERVER_URL + message.avatarUrl : null;

  return (
    <div
      className={`flex items-end gap-2 mt-3 ${
        isOwnMessage ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {!isOwnMessage && (
        <div className="w-8 h-8 shrink-0 rounded-full overflow-hidden bg-zinc-700 flex items-center justify-center text-xs text-zinc-200">
          {avatarSrc ? (
            <img
              src={avatarSrc}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            message.username[0].toUpperCase()
          )}
        </div>
      )}

      <div
        className={`flex max-w-[75%] flex-col ${
          isOwnMessage ? "items-end" : "items-start"
        }`}
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
              className="h-28 w-28 object-contain rounded-xl"
            />
          </div>
        ) : (
          <span
            className={`break-words rounded-lg px-3 py-2 text-sm ${
              isOwnMessage
                ? "bg-zinc-100 text-zinc-950"
                : "bg-zinc-900 text-zinc-200"
            }`}
          >
            {message.text}
          </span>
        )}
      </div>
    </div>
  );
};

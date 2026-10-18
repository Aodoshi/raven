import { socket } from "@/shared/socket/socket";

interface SendMessageData {
  type: "text" | "sticker";
  text?: string;
  stickerId?: string;
}

export const sendMessage = (data: SendMessageData) => {
  socket.emit("send-message", data);
};

export const sendTyping = () => {
  socket.emit("typing");
};

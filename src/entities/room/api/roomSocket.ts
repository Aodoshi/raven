import { socket } from "@/shared/socket/socket";

export const joinRoom = (roomId: string) => {
  socket.emit("join-room", {
    roomId,
  });
};

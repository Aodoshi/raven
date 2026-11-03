import { socket } from "@/shared/socket/socket";

export const joinRoom = (roomId: string) => {
  socket.emit("join-room", {
    roomId,
  });
};

export const changeVideoUrl = (videoUrl: string) => {
  socket.emit("change-video", {
    videoUrl,
  });
};

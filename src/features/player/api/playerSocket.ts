import { socket } from "@/shared/socket/socket";

export const sendMediaControl = (
  action: "play" | "pause" | "seek",
  currentTime: number,
) => {
  socket.emit("media-control", {
    action,
    currentTime,
  });
};

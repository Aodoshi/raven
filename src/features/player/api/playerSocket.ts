import { socket } from "@/shared/socket/socket";

export const sendMediaControl = (
  action: "play" | "pause" | "seek",
  currentTime: number,
) => {
  console.log("SEND:", action, currentTime);
  socket.emit("media-control", {
    action,
    currentTime,
  });
};

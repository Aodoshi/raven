import { io } from "socket.io-client";

export const socket = io(import.meta.env.VITE_API_URL, {
  autoConnect: false,
});

export const connectSocket = (token: string) => {
  socket.auth = {
    token,
  };

  socket.connect();
};

export const disconnectSocket = () => {
  socket.disconnect();
};

socket.on("connect", () => {
  console.log("CONNECTED", socket.id);
});

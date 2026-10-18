import { io } from "socket.io-client";

export const socket = io("http://localhost:3001", {
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

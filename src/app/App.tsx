import { RouterProvider } from "react-router-dom";
import { router } from "./router/routes";
import { useEffect } from "react";
import { connectSocket, disconnectSocket } from "@/shared/socket/socket";

export const App = () => {
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (!token) {
      disconnectSocket();
      return;
    }

    connectSocket(token);

    return () => {
      disconnectSocket();
    };
  }, [token]);

  return <RouterProvider router={router} />;
};

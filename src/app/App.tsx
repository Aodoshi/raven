import { RouterProvider } from "react-router-dom";
import { router } from "./router/routes";

export const App = () => {
  return <RouterProvider router={router} />;
};

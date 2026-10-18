import { Navigate, Outlet } from "react-router-dom";

export const GuestRoute = () => {
  const isAuthed = localStorage.getItem("token");

  if (isAuthed) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

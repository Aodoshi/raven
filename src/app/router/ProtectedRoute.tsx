import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = () => {
  const isAuthed = localStorage.getItem("token");

  if (!isAuthed) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

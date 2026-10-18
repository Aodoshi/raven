import { Outlet } from "react-router-dom";

export const AuthLayout = () => {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-10">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-white/[0.035] blur-3xl" />
      <div className="relative z-10 w-full">
        <Outlet />
      </div>
    </main>
  );
};

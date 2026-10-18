import { LoginForm } from "@/features/auth/login/ui/LoginForm";
import { Link } from "react-router-dom";

export const Login = () => {
  return (
    <section className="mx-auto w-full max-w-[440px]">
      <div className="mb-8 text-center">
        <Link
          to="/"
          className="text-[42px] font-bold tracking-[-0.04em] text-white"
        >
          Raven
        </Link>
        <h1 className="mt-10 text-3xl font-semibold tracking-[-0.03em] text-white">
          С возвращением
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          Войдите, чтобы продолжить смотреть вместе
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-6 shadow-2xl shadow-black/20 sm:p-8">
        <LoginForm />
      </div>

      <p className="mt-6 text-center text-sm text-slate-400">
        Еще нет аккаунта?{" "}
        <Link
          to="/register"
          className="font-medium text-white underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white"
        >
          Зарегистрироваться
        </Link>
      </p>
    </section>
  );
};

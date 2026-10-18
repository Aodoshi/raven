import { RegisterForm } from "@/features/auth/register/ui/RegisterForm";
import { Link } from "react-router-dom";

export const Register = () => {
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
          Создайте аккаунт
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          Присоединяйтесь к просмотрам без расстояний
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-6 shadow-2xl shadow-black/20 sm:p-8">
        <RegisterForm />
      </div>

      <p className="mt-6 text-center text-sm text-slate-400">
        Уже есть аккаунт?{" "}
        <Link
          to="/login"
          className="font-medium text-white underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white"
        >
          Войти
        </Link>
      </p>
    </section>
  );
};

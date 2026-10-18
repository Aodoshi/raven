import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { loginScheme, type LoginFormValues } from "../model/login.schema";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/shared/ui/button";
import { loginUser } from "../api/auth.api";

export const LoginForm = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginScheme),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const result = await loginUser(data);
      localStorage.setItem("token", result.token);
      navigate("/");
      alert("Вход прошел успешно!");
    } catch (error) {
      console.error("Error logging in user:", error);
    }
  };

  return (
    <div>
      {" "}
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="login-username" className="block space-y-2">
          <span className="text-sm font-medium text-slate-200">
            Имя пользователя
          </span>
          <input
            id="login-username"
            type="text"
            placeholder="Введите имя пользователя"
            autoComplete="username"
            className="h-11 w-full rounded-lg border border-white/10 bg-black/20 px-3.5 text-sm text-white outline-none transition-colors placeholder:text-slate-600 focus:border-white/40 focus:ring-2 focus:ring-white/10"
            {...register("username", { required: true })}
          />
          {errors.username && (
            <span className="text-sm text-red-500">
              {errors.username.message}
            </span>
          )}
        </label>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="login-password"
              className="text-sm font-medium text-slate-200"
            >
              Пароль
            </label>
            <Link
              to="/login"
              className="text-xs text-slate-400 transition-colors hover:text-white"
            >
              Забыли пароль?
            </Link>
          </div>
          <input
            id="login-password"
            type="password"
            placeholder="Введите пароль"
            autoComplete="current-password"
            className="h-11 w-full rounded-lg border border-white/10 bg-black/20 px-3.5 text-sm text-white outline-none transition-colors placeholder:text-slate-600 focus:border-white/40 focus:ring-2 focus:ring-white/10"
            {...register("password", { required: true })}
          />
          {errors.password && (
            <span className="text-sm text-red-500">
              {errors.password.message}
            </span>
          )}
        </div>
        <Button type="submit" className="h-11 w-full px-4">
          Войти
        </Button>
      </form>
    </div>
  );
};

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/shared/ui/button";
import {
  registerScheme,
  type registerFormValues,
} from "../model/register.schema";
import { useNavigate } from "react-router-dom";

import { registerUser } from "../api/auth.api";

export const RegisterForm = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<registerFormValues>({
    resolver: zodResolver(registerScheme),
  });

  const onSubmit = async (data: registerFormValues) => {
    try {
      const result = await registerUser(data);
      navigate("/");
      alert("Регистрация прошла успешно, теперь залогиньтесь");
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  return (
    <div>
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="register-name" className="block space-y-2">
          <span className="text-sm font-medium text-slate-200">Ваше имя</span>
          <input
            id="register-name"
            type="text"
            placeholder="Как вас зовут?"
            autoComplete="name"
            className="h-11 w-full rounded-lg border border-white/10 bg-black/20 px-3.5 text-sm text-white outline-none transition-colors placeholder:text-slate-600 focus:border-white/40 focus:ring-2 focus:ring-white/10"
            {...register("username", { required: true })}
          />
          {errors.username && (
            <span className="text-sm text-red-500">
              {errors.username.message}
            </span>
          )}
        </label>
        <label htmlFor="register-password" className="block space-y-2">
          <span className="text-sm font-medium text-slate-200">Пароль</span>
          <input
            id="register-password"
            type="password"
            placeholder="Придумайте пароль"
            autoComplete="new-password"
            className="h-11 w-full rounded-lg border border-white/10 bg-black/20 px-3.5 text-sm text-white outline-none transition-colors placeholder:text-slate-600 focus:border-white/40 focus:ring-2 focus:ring-white/10"
            {...register("password", { required: true })}
          />
          {errors.password && (
            <span className="text-sm text-red-500">
              {errors.password.message}
            </span>
          )}
        </label>
        <Button type="submit" className="h-11 w-full px-4">
          Зарегистрироваться
        </Button>
      </form>
    </div>
  );
};

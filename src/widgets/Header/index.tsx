import { Button } from "@/shared/ui/button";

export const Header = () => {
  return (
    <header className="container py-4 flex items-center justify-between">
      <h1 className="text-white cursor-pointer font-bold text-[42px]">Raven</h1>

      <ul className="flex items-center gap-5">
        <li className="text-white font-bold text-[16px] cursor-pointer">
          hello
        </li>
        <li className="text-white font-bold text-[16px] cursor-pointer">
          hello
        </li>
      </ul>

      <div className="flex gap-8">
        <Button size="lg">Войти</Button>
        <Button size="lg">Зарегистрироваться</Button>
      </div>
    </header>
  );
};

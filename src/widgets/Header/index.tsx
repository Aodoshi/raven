import { Button } from "@/shared/ui/button";
import { Link } from "react-router-dom";

export const Header = () => {
  const isAuthed = localStorage.getItem("token");

  return (
    <header className="container py-4 flex items-center justify-between">
      <Link to="/">
        <h1 className="text-white cursor-pointer font-bold text-[42px]">
          Raven
        </h1>
      </Link>

      <ul className="flex items-center gap-5">
        <Link to="/rooms">
          <li className="text-white font-bold text-[16px] cursor-pointer">
            Все комнаты
          </li>
        </Link>

        <Link to="/about">
          <li className="text-white font-bold text-[16px] cursor-pointer">
            О проекте
          </li>
        </Link>
      </ul>

      <div className="flex gap-8">
        {isAuthed ? (
          <Link to="/profile">
            <Button size="lg">Профиль</Button>
          </Link>
        ) : (
          <>
            <Link to="/login">
              <Button size="lg">Войти</Button>
            </Link>
            <Link to="/register">
              <Button size="lg">Зарегистрироваться</Button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

import { Button } from "@/shared/ui/button";
import { Link } from "react-router-dom";

export const HeroSection = () => {
  return (
    <section className="container mx-auto px-4 pt-28 pb-20">
      <div className="max-w-3xl">
        <div className="inline-block text-xs font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-md mb-6">
          v1.0.0 • open source
        </div>

        <h1 className="text-4xl sm:text-6xl font-semibold text-zinc-100 tracking-tight leading-[1.1] mb-6">
          Смотрите видео вместе. <br />
          Без задержек и лишних движений.
        </h1>

        <p className="text-zinc-400 text-lg mb-10 leading-relaxed font-normal">
          Синхронный просмотр для тех, кто далеко. Создайте комнату, отправьте
          ссылку другу и управляйте плеером на двоих в реальном времени.
        </p>

        <div className="flex items-center gap-4">
          <Link to={"/rooms"}>
            <Button className="bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-medium px-6 h-11">
              Создать комнату
            </Button>
          </Link>

          <Link to={"/rooms"}>
            <Button
              variant="outline"
              className="border-zinc-800 bg-zinc-900/50 text-zinc-300 hover:bg-zinc-800 hover:text-white px-6 h-11"
            >
              Присоединиться
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

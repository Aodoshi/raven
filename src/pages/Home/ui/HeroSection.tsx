import { Button } from "@/shared/ui/button";

export const HeroSection = () => {
  return (
    <section className="container">
      <h2 className="text-[48px] text-white mt-20 mb-10">
        Смотрите вместе <br /> даже если вы далеко
      </h2>
      <div className="flex gap-5">
        <Button>Создать комнату</Button>
        <Button>Присоединиться</Button>
      </div>
    </section>
  );
};

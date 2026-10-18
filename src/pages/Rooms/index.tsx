import { RoomsList } from "@/widgets/rooms-list/ui/RoomsList";

export const Rooms = () => {
  return (
    <div className="container flex flex-col gap-8 pb-16">
      <div className="flex flex-wrap items-end justify-between gap-4 pt-10">
        <h2 className="text-4xl font-semibold leading-none tracking-tight text-white sm:text-[55px]">
          Все комнаты
        </h2>
      </div>

      <RoomsList />
    </div>
  );
};

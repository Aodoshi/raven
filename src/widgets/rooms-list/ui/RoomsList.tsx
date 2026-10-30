import { getRooms } from "@/entities/room/api/getRooms";
import { useEffect, useState } from "react";
import type { Room } from "@/entities/room/model/types";
import { RoomCard } from "@/entities/room";
import { DeleteRoomButton } from "@/features/delete-room";
import { CreateRoomForm } from "@/features/create-room";

interface RoomListProps {
  search: string;
}

export const RoomsList = ({ search }: RoomListProps) => {
  const [rooms, setRooms] = useState<Room[]>([]);

  const fetchRooms = async () => {
    try {
      setRooms(await getRooms());
    } catch (err) {
      console.log("не удалось получить комнаты ", err);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const filteredRooms = rooms.filter((i) =>
    i.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
  );

  return (
    <div>
      {rooms.length === 0 && (
        <p className="rounded-xl border border-dashed border-white/10 py-16 text-center text-slate-400">
          Нету активных комнат :(
        </p>
      )}

      {rooms.length > 0 && filteredRooms.length === 0 && (
        <p className="rounded-xl border border-dashed border-white/10 py-16 text-center text-slate-400">
          Ничего не найдено по запросу «{search}» 🕵️‍♂️
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {filteredRooms.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            actions={
              <DeleteRoomButton roomId={room.id} onDeleted={fetchRooms} />
            }
          />
        ))}
      </div>

      <CreateRoomForm onCreated={fetchRooms} />
    </div>
  );
};

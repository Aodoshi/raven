import { useParams } from "react-router";
import { useEffect } from "react";
import { socket } from "@/shared/socket/socket";
import { joinRoom } from "@/entities/room/api/roomSocket";
import { useRoomStore } from "@/entities/room/model/roomStore";
import type { RoomState, Message } from "@/entities/room/model/types";
import { Chat } from "@/widgets/Chat/Chat";
import { Player } from "@/widgets/Player/Player";

export const Room = () => {
  const { id } = useParams<{ id: string }>();
  const setRoomState = useRoomStore((state) => state.setRoomState);

  const addMessage = useRoomStore((state) => state.addMessage);

  useEffect(() => {
    if (!id) return;
    const handleRoomState = (data: RoomState) => {
      setRoomState(data);
    };

    const handleNewMessage = (message: Message) => {
      addMessage(message);
    };

    socket.on("room-state", handleRoomState);
    socket.on("new-message", handleNewMessage);

    joinRoom(id);

    return () => {
      socket.off("room-state", handleRoomState);
      socket.off("new-message", handleNewMessage);
    };
  }, [id]);

  return (
    <div className="container">
      <div className="flex items-start gap-4 justify-between mt-10">
        <Player />

        <Chat />
      </div>
    </div>
  );
};

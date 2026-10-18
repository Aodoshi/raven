import { deleteRoom } from "../api/deleteRoom";
import { Button } from "@/shared/ui/button";

interface Props {
  roomId: string;
  onDeleted: () => void;
}

export const DeleteRoomButton = ({ roomId, onDeleted }: Props) => {
  const handleDelete = async () => {
    const password = prompt("Введите пароль");
    if (!password) return;

    try {
      await deleteRoom(roomId, password);
      onDeleted();
    } catch (err: any) {
      alert(err.response?.data?.error ?? "Не удалось удалить комнату");
    }
  };

  return (
    <Button
      type="button"
      onClick={handleDelete}
      className="shrink-0 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-400 transition-colors hover:border-red-400/40 hover:text-red-400"
    >
      Удалить
    </Button>
  );
};

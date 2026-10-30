export interface Room {
  id: string;
  name: string;
  isPrivate: boolean;
  ownerName: string;
}

export interface RoomState {
  roomId: string;
  name: string;
  ownerId: number;
  videoUrl: string;
  isPlaying: boolean;
  currentTime: number;
  messages: Message[];
}

export interface Message {
  id: number;
  roomId: string;
  userId: number;
  username: string;

  type: "text" | "sticker";

  text: string;
  stickerId: string;
  stickerUrl: string | undefined;

  created_at: string;
  avatarUrl: string;
}

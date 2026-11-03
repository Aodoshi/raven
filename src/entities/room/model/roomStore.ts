import { create } from "zustand";

import type { RoomState, Message } from "./types";

interface RoomStore {
  roomState: RoomState | null;
  videoUrl: string;

  setRoomState: (roomState: RoomState) => void;
  addMessage: (message: Message) => void;
  setVideoUrl: (videoUrl: string) => void;
}

export const useRoomStore = create<RoomStore>((set) => ({
  roomState: null,
  videoUrl: "",

  setRoomState: (roomState) => set({ roomState }),

  addMessage: (message) =>
    set((state) => {
      if (!state.roomState) return state;

      return {
        roomState: {
          ...state.roomState,
          messages: [...state.roomState.messages, message],
        },
      };
    }),

  setVideoUrl: (videoUrl) => set({ videoUrl }),
}));

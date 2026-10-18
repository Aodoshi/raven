import { create } from "zustand";

import type { RoomState, Message } from "./types";

interface RoomStore {
  roomState: RoomState | null;

  setRoomState: (roomState: RoomState) => void;
  addMessage: (message: Message) => void;
}

export const useRoomStore = create<RoomStore>((set) => ({
  roomState: null,

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
}));

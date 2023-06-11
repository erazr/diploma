import { create } from "zustand";

const DMStore = create((set, get) => ({
  DM: {},
  newMessages: [],
  setDM: (user) => set({ DM: user }),
  addMessages: (msg) => {
    set((state) => ({
      newMessages: [...state.newMessages, msg],
    }));
  },
  clear: () => set(() => ({ newMessages: [] })),
}));

export default DMStore;

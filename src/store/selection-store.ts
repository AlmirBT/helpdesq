import { create } from "zustand";

interface SelectionState {
  activeDialogId: string | null;
  setActiveDialogId: (id: string) => void;
  bulkSelectedIds: string[];
  toggleBulkSelected: (id: string) => void;
  clearBulkSelected: () => void;
}

export const useSelectionStore = create<SelectionState>((set, get) => ({
  activeDialogId: null,
  setActiveDialogId: (id) => set({ activeDialogId: id }),
  bulkSelectedIds: [],
  toggleBulkSelected: (id) => {
    const current = get().bulkSelectedIds;
    if (current.includes(id)) {
      set({ bulkSelectedIds: current.filter((x) => x !== id) });
    } else {
      set({ bulkSelectedIds: [...current, id] });
    }
  },
  clearBulkSelected: () => set({ bulkSelectedIds: [] }),
}));


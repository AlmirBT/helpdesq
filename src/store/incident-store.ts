import { create } from "zustand";

interface IncidentState {
  incidentMode: boolean;
  affectedDialogIds: string[];
  toggleIncidentMode: () => void;
  markDialogAffected: (id: string) => void;
  unmarkDialogAffected: (id: string) => void;
  clearIncident: () => void;
}

export const useIncidentStore = create<IncidentState>((set) => ({
  incidentMode: false,
  affectedDialogIds: [],
  toggleIncidentMode: () =>
    set((state) => ({ incidentMode: !state.incidentMode })),
  markDialogAffected: (id) =>
    set((state) =>
      state.affectedDialogIds.includes(id)
        ? state
        : { affectedDialogIds: [...state.affectedDialogIds, id] },
    ),
  unmarkDialogAffected: (id) =>
    set((state) => ({
      affectedDialogIds: state.affectedDialogIds.filter((x) => x !== id),
    })),
  clearIncident: () => set({ affectedDialogIds: [], incidentMode: false }),
}));


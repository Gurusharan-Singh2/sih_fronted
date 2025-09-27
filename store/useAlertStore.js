import { create } from "zustand";

export const useAlertStore = create((set) => ({
  selectedAlert: null,
  isModalOpen: false,
  openModal: (alert) => set({ selectedAlert: alert, isModalOpen: true }),
  closeModal: () => set({ selectedAlert: null, isModalOpen: false }),
}));
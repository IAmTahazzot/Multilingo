import { create } from 'zustand'

export enum ModalType {
  COURSE_SETUP = 'COURSE_SETUP',
  SUPER_SUBSCRIPTION = 'SUPER_SUBSCRIPTION'
}

type ModalState = {
  isOpen: boolean
  type: ModalType | null
  data: unknown
  openModal: (type: ModalType, data?: unknown) => void
  closeModal: () => void
}

export const useModal = create<ModalState>(set => ({
  isOpen: false,
  type: null,
  data: null,
  openModal: (type, data) => set({ isOpen: true, type, data }),
  closeModal: () => set({ isOpen: false, type: null, data: null })
}))
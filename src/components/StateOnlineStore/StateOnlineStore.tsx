import { create } from 'zustand'

type UserOnlineState = {
  isUserOnline: boolean;
  setIsUserOnline: (online: boolean) => void;
};

const useUserOnlineStore = create<UserOnlineState>((set) => ({
  isUserOnline: false,
  setIsUserOnline: (online) => set({ isUserOnline: online }),
}));

export default useUserOnlineStore;
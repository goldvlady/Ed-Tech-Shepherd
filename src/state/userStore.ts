import { fetchStudentDocuments } from '../services/AI';
import ApiService from '../services/ApiService';
import { User, UserNotifications } from '../types';
import { create } from 'zustand';

type List = {
  name: string;
  fullPath: string;
  customMetadata: {
    ingest_status: 'success' | 'too_large';
  };
};

type Store = {
  user: User | null;
  userNotifications: Array<UserNotifications>;
  fetchUser: () => Promise<boolean>;
  fetchNotifications: () => Promise<void>;
  fetchUserDocuments: (userId: string) => Promise<void>;
  userDocuments: Array<List> | [];
  setUserData: (data: Partial<User>) => void;
  logoutUser: () => void;
};

export default create<Store>((set) => ({
  user: null,
  userNotifications: [],
  userDocuments: [],
  fetchUser: async () => {
    const response = await ApiService.getUser();
    if (response.status !== 200) return false;
    set({ user: await response.json() });
    return true;
  },
  logoutUser: () => {
    set({ user: null });
  },
  setUserData: (data: Partial<User>) => {
    set((state) => {
      if (state.user) {
        return { user: { ...state.user, ...data } };
      } else {
        return state;
      }
    });
  },
  fetchNotifications: async () => {
    const response = await ApiService.getUserNotifications();
    // if (response.status !== 200) return false;
    set({ userNotifications: await response.json() });
    // return true;
  },
  fetchUserDocuments: async (userId: string) => {
    const userDocuments = await fetchStudentDocuments(userId);
    set({ userDocuments });
  }
}));

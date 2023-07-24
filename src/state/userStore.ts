import ApiService from '../services/ApiService';
import { User, UserNotifications } from '../types';
import { create } from 'zustand';

type Store = {
  user: User | null;
  userNotifications: Array<UserNotifications>;
  fetchUser: () => Promise<void>;
  fetchNotifications: () => Promise<void>;
};

export default create<Store>((set) => ({
  user: null,
  userNotifications: [],
  fetchUser: async () => {
    const response = await ApiService.getUser();
    set({
      user: await response.json()
    });
  },
  fetchNotifications: async () => {
    const notificationsResponse = await ApiService.getUserNotifications();
    set({
      userNotifications: await notificationsResponse.json()
    });
  }
}));

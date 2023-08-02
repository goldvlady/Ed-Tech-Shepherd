import { storage } from '../firebase';
import ApiService from '../services/ApiService';
import { User, UserNotifications } from '../types';
import { getAuth } from 'firebase/auth';
import { ref, listAll, getMetadata } from 'firebase/storage';
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
  fetchUserDocuments: () => Promise<Array<any>>;
  userDocuments: Array<List> | [];
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
  fetchNotifications: async () => {
    const notificationsResponse = await ApiService.getUserNotifications();
    set({
      userNotifications: await notificationsResponse.json()
    });
  },
  fetchUserDocuments: async () => {
    const { currentUser } = getAuth();
    if (currentUser?.uid) {
      const listRef = ref(storage, currentUser?.uid);
      const items: Array<List> = [];
      listAll(listRef).then(async (res) => {
        for (const item of res.items) {
          const itemRef = ref(storage, item.fullPath);
          const customMetadata = await getMetadata(itemRef);

          // @ts-ignore: overriding the factory types, don't worry about it
          items.push(customMetadata);
        }
        // Really ghastly hack to filter out documents that were successfully ingested by the AI service.
        // A rework of this function will be one that decouples document hosting logic from firebase and moves it closer to a specialized API (one directly owned by Shepherd)
        const filteredDocuments = items.filter(
          (item) => item.customMetadata?.ingest_status === 'success'
        );

        set({
          userDocuments: filteredDocuments
        });
      });
    }

    return [];
  }
}));

import { fetchStudentDocuments } from '../services/AI';
import ApiService from '../services/ApiService';
import { SearchQueryParams, User, UserNotifications } from '../types';
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
  hasActiveSubscription: boolean;
  fileSizeLimitMB: number;
  fileSizeLimitBytes: number;
  fetchUser: () => Promise<boolean>;
  fetchNotifications: () => Promise<void>;
  fetchUserDocuments: (queryParams?: SearchQueryParams) => Promise<void>;
  userDocuments: Array<List> | [];
  setUserData: (data: Partial<User>) => void;
  logoutUser: () => void;
};

export default create<Store>((set) => ({
  user: null,
  userNotifications: [],
  userDocuments: [],
  hasActiveSubscription: false,
  fileSizeLimitMB: 0,
  fileSizeLimitBytes: 0,
  fetchUser: async () => {
    const response = await ApiService.getUser();
    if (response.status !== 200) return false;
    const userData = await response.json();

    // Calculate the hasActiveSubscription value
    const hasActiveSubscription = !!(
      userData.subscription &&
      (userData.subscription.status === 'active' ||
        userData.subscription.status === 'trialing' ||
        userData.subscription.tier === 'Founding Member')
    );
    // Convert the limit from MB to bytes (1 MB = 1,000,000 bytes)
    const fileSizeLimitMB =
      userData.subscription?.subscriptionMetadata?.file_mb_limit || 5; // Default to 5MB if not specified
    const fileSizeLimitBytes = fileSizeLimitMB * 1000000;

    set({
      user: userData,
      hasActiveSubscription: hasActiveSubscription,
      fileSizeLimitMB: fileSizeLimitMB,
      fileSizeLimitBytes: fileSizeLimitBytes
    });

    return true;
  },
  logoutUser: () => {
    set({ user: null });
  },
  setUserData: (data: Partial<User>) => {
    set((state) => {
      if (state.user) {
        const newUser = { ...state.user, ...data };
        const hasActiveSubscription = !!(
          newUser.subscription &&
          (newUser.subscription.status === 'active' ||
            newUser.subscription.status === 'trialing' ||
            newUser.subscription.tier === 'Founding Member')
        );
        const fileSizeLimitMB =
          newUser.subscription?.subscriptionMetadata?.file_mb_limit || 5; // Default to 5MB if not specified
        const fileSizeLimitBytes = fileSizeLimitMB * 1000000;
        return {
          user: newUser,
          hasActiveSubscription: hasActiveSubscription,
          fileSizeLimitMB: fileSizeLimitMB,
          fileSizeLimitBytes: fileSizeLimitBytes
        };
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
  // fetchUserDocuments: async (userId: string) => {
  //   const userDocuments = await fetchStudentDocuments(userId);
  //   set({ userDocuments });
  // },
  fetchUserDocuments: async (queryParams: SearchQueryParams = {}) => {
    try {
      const response = await ApiService.getStudentDocuments(queryParams);
      const {
        data,
        meta: { pagination, tags }
      } = await response.json();

      set({ userDocuments: data });
    } catch (error) {
      // Handle error
    }
  }
}));

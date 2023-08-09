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

const userPatch = {
  name: {
    first: 'Chigo',
    last: 'Ofurum'
  },
  email: 'chigo@gmail.com',
  isVerified: true,
  type: 'student' as const,
  paymentMethods: [],
  firebaseId: 'hackety hack',
  dob: '2022-10-10',
  createdAt: new Date(),
  updatedAt: new Date(),
  _id: 'whatevs'
};

type Store = {
  user: User | null;
  userNotifications: Array<UserNotifications>;
  fetchUser: () => Promise<boolean>;
  fetchNotifications: () => Promise<void>;
  fetchUserDocuments: (userId: string) => Promise<void>;
  userDocuments: Array<List> | [];
};

export default create<Store>((set) => ({
  user: null,
  userNotifications: [],
  userDocuments: [],
  fetchUser: async () => {
    set({ user: userPatch });
    return true;
  },
  fetchNotifications: async () => {
    set({
      userNotifications: []
    });
  },
  fetchUserDocuments: async (userId: string) => {
    const userDocuments = await fetchStudentDocuments(userId);
    set({ userDocuments });
  }
}));

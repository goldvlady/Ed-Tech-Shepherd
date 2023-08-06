import { storage } from '../firebase';
import { fetchStudentDocuments } from '../services/AI';
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
  fetchUserDocuments: (userId: string) => Promise<void>;
  userDocuments: Array<List> | [];
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

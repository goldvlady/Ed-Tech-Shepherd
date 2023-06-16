import { create } from 'zustand';

import ApiService from '../services/ApiService';
import { Tutor } from '../types';

type Store = {
  tutor: Tutor | null;
  fetchTutor: (tutorId: string) => Promise<void>;
};

export default create<Store>((set) => ({
  tutor: null,
  fetchTutor: async (tutorId) => {
    const response = await ApiService.getTutor(tutorId);
    set({ tutor: await response.json() });
  },
}));

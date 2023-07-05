import ApiService from '../services/ApiService';
import { BookmarkedTutor } from '../types';
import { create } from 'zustand';

type Store = {
  tutors: Array<BookmarkedTutor>;
  fetchBookmarkedTutors: () => Promise<void>;
};

export default create<Store>((set) => ({
  tutors: [],
  fetchBookmarkedTutors: async () => {
    const response = await ApiService.getBookmarkedTutors();
    set({ tutors: await response.json() });
  }
}));

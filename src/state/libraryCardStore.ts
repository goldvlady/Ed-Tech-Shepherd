import ApiService from '../services/ApiService';
import { SearchQueryParams, Pagination } from '../types';
import { LibraryCardData } from '../types';
import { create } from 'zustand';

type Store = {
  libraryCards: LibraryCardData[] | null;
  subjects: string[];
  isLoading: boolean;
  pagination: Pagination;
  fetchLibraryCards: (
    topicId: string,
    queryParams?: SearchQueryParams
  ) => Promise<void>;
  libraryCard?: LibraryCardData | null;
};

export default create<Store>((set) => ({
  libraryCards: null,
  isLoading: false,
  subjects: [],
  pagination: { limit: 10, page: 1, count: 100 },

  fetchLibraryCards: async (
    topicId: string,
    queryParams?: SearchQueryParams
  ) => {
    try {
      const params = queryParams || ({} as SearchQueryParams);
      if (!params.page) params.page = 1;
      if (!params.limit) params.limit = 10;
      set({ isLoading: true });
      const response = await ApiService.getLibraryCards({ topicId, ...params });
      const { data, meta } = await response.json();

      set((prev) => {
        const d: any = {
          libraryCards: data,
          pagination: meta?.pagination
        };
        if (!prev.subjects.length) {
          d.subjects = meta?.subjects;
        }
        return { ...d };
      });
    } catch (error) {
      // Handle or log error
    } finally {
      set({ isLoading: false });
    }
  }
}));

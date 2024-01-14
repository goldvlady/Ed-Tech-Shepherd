import ApiService from '../services/ApiService';
import { SearchQueryParams, Pagination } from '../types';
import { LibrarySubjectData } from '../types';
import { create } from 'zustand';

type Store = {
  librarySubjects: LibrarySubjectData[] | null;
  isLoading: boolean;
  pagination: Pagination;
  fetchLibrarySubjects: (queryParams?: SearchQueryParams) => Promise<void>;
  librarySubject?: LibrarySubjectData | null;
};

export default create<Store>((set) => ({
  librarySubjects: null,
  isLoading: false,
  pagination: { limit: 10, page: 1, count: 100 },

  fetchLibrarySubjects: async (queryParams?: SearchQueryParams) => {
    try {
      const params = queryParams || ({} as SearchQueryParams);
      if (!params.page) params.page = 1;
      if (!params.limit) params.limit = 10;
      set({ isLoading: true });
      const response = await ApiService.getLibrarySubjects(params);
      const { data, meta } = await response.json();

      set({ librarySubjects: data, pagination: meta?.pagination });
    } catch (error) {
      // Handle or log error
    } finally {
      set({ isLoading: false });
    }
  }
}));

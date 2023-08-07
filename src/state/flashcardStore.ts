import ApiService from '../services/ApiService';
import {
  FlashcardData,
  Score,
  MinimizedStudy,
  SchedulePayload
} from '../types';
import { create } from 'zustand';

type SearchQueryParams = {
  search?: string;
  page?: number;
  limit?: number;
  sort?: string;
};

type Pagination = {
  page: number;
  limit: number;
  count: number;
};

type Store = {
  flashcards: FlashcardData[] | null;
  storeFlashcardTags: (flashcardId: string, tags: string[]) => Promise<boolean>;
  isLoading: boolean;
  pagination: Pagination;
  fetchFlashcards: (queryParams?: SearchQueryParams) => Promise<void>;
  flashcard?: FlashcardData | null;
  loadFlashcard: (id: string | null, currentStudy?: MinimizedStudy) => void;
  minimizedStudy?: MinimizedStudy | null | undefined;
  storeCurrentStudy: (
    flashcardId: string,
    data: MinimizedStudy
  ) => Promise<void>;
  createFlashCard: (
    data: any,
    generatorType?: string
  ) => Promise<Response | undefined>;
  deleteFlashCard: (id: string) => Promise<boolean>;
  storeScore: (flashcardId: string, score: Score) => Promise<boolean>;
  updateQuestionAttempt: (
    flashcardId: string,
    questionText: string,
    isPassed: boolean
  ) => Promise<boolean>;
  scheduleFlashcard: (d: SchedulePayload) => Promise<boolean>;
};

export default create<Store>((set) => ({
  flashcards: null,
  isLoading: false,
  minimizedStudy: null,
  pagination: { limit: 10, page: 1, count: 100 },
  storeFlashcardTags: async (flashcardId: string, tags: string[]) => {
    try {
      set({ isLoading: true });
      const response = await ApiService.storeFlashcardTags(flashcardId, tags);
      if (response.status === 200) {
        const { data } = await response.json();
        set((state) => {
          const { flashcards } = state;
          const index = flashcards?.findIndex(
            (card) => card._id === flashcardId
          );
          if (index !== undefined && index >= 0 && flashcards) {
            flashcards[index] = data;
          }
          return { flashcards };
        });
        return true;
      }
      return false;
    } catch (error) {
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
  storeCurrentStudy: async (flashcardId, currentStudy: MinimizedStudy) => {
    try {
      set({ isLoading: true });
      const response = await ApiService.storeCurrentStudy(
        flashcardId,
        currentStudy.data
      );
      const { data } = await response.json();
      set({ flashcards: data.flashcards });
    } catch (error) {
      // console.log(error)
    } finally {
      set({ isLoading: false });
    }
  },
  fetchFlashcards: async (queryParams?: {
    search?: string;
    page?: number;
    limit?: number;
    sort?: string;
  }) => {
    try {
      const params = queryParams || {};
      if (!params.page) params.page = 1;
      if (!params.limit) params.limit = 10;
      set({ isLoading: true });
      const response = await ApiService.getFlashcards(params || {});
      const { data } = await response.json();
      set({ flashcards: data, pagination: data?.meta?.pagination });
    } catch (error) {
      // console.log(error)
    } finally {
      set({ isLoading: false });
    }
  },
  storeMinimized: (data: MinimizedStudy) => {
    set({ minimizedStudy: data });
  },
  loadFlashcard: (id: string | null, currentStudy?: MinimizedStudy) => {
    set((state) => {
      if (!id) return { flashcard: undefined, minimizedStudy: null };
      const flashcard = state.flashcards?.find((card) => card._id === id);
      const nextState: Partial<typeof state> = { flashcard };
      if (currentStudy) {
        nextState.minimizedStudy = currentStudy;
      }
      return nextState;
    });
  },
  scheduleFlashcard: async (data: SchedulePayload) => {
    try {
      set({ isLoading: true });
      const response = await ApiService.scheduleStudyEvent(data);
      return response.status === 200;
    } catch (error) {
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
  deleteFlashCard: async (id: string) => {
    try {
      set({ isLoading: true });
      const response = await ApiService.deleteFlashcard(id);
      if (response.status === 200) {
        set((state) => {
          const { flashcards } = state;
          const ids = id.split(',');
          ids.forEach((idString) => {
            const index = flashcards?.findIndex(
              (card) => card._id === idString
            );
            if (index !== undefined && index >= 0 && flashcards) {
              flashcards.splice(index, 1);
            }
          });
          return { flashcards };
        });
        return true;
      }
      return false;
    } catch (error) {
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
  createFlashCard: async (data: any, generatorType?: string) => {
    try {
      set({ isLoading: true });
      const response = await ApiService.createFlashcard(data, generatorType);
      if (response.status === 200) {
        const { data } = await response.json();
        set((store) => {
          const { flashcards } = store;
          flashcards?.push(data);
          return { flashcards };
        });
      }
      return response;
    } catch (error) {
      // console.log(error)
    } finally {
      set({ isLoading: false });
    }
  },
  storeScore: async (flashcardId: string, score: Score) => {
    try {
      set({ isLoading: true });
      const response = await ApiService.storeFlashcardScore({
        flashcardId,
        score
      });
      if (response.status === 200) {
        const { data } = await response.json();
        set((state) => {
          const { flashcards } = state;
          const index = flashcards?.findIndex(
            (card) => card._id === flashcardId
          );
          if (index !== undefined && index >= 0 && flashcards) {
            flashcards[index] = data;
          }
          return { flashcards };
        });
        return true;
      }
      return false;
    } catch (error) {
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
  updateQuestionAttempt: async (
    flashcardId: string,
    questionText: string,
    isPassed: boolean
  ) => {
    try {
      set({ isLoading: true });
      const response = await ApiService.updateQuestionAttempt({
        flashcardId,
        questionText,
        isPassed
      });
      if (response.status === 200) {
        const { data } = await response.json();
        set((state) => {
          const { flashcards } = state;
          const index = flashcards?.findIndex(
            (card) => card._id === flashcardId
          );
          if (index !== undefined && index >= 0 && flashcards) {
            flashcards[index] = data;
          }
          return { flashcards };
        });
        return true;
      }
      return false;
    } catch (error) {
      return false;
    } finally {
      set({ isLoading: false });
    }
  }
}));

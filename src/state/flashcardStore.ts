import ApiService from '../services/ApiService';
import { FlashcardData } from '../types';
import { create } from 'zustand';

type Store = {
  flashcards: FlashcardData[] | null;
  isLoading: boolean;
  fetchFlashcards: () => Promise<void>;
  flashcard?: FlashcardData | null;
  loadFlashcard: (id: string | null) => void;
  createFlashCard: (
    data: any,
    generatorType?: string
  ) => Promise<Response | undefined>;
  deleteFlashCard: (id: string | number) => Promise<boolean>;
  storeScore: (flashcardId: string, score: number) => Promise<boolean>;
  updateQuestionAttempt: (
    flashcardId: string,
    questionText: string,
    isPassed: boolean
  ) => Promise<boolean>;
};

export default create<Store>((set) => ({
  flashcards: null,
  isLoading: false,
  fetchFlashcards: async () => {
    try {
      set({ isLoading: true });
      const response = await ApiService.getFlashcards();
      const { data } = await response.json();
      set({ flashcards: data });
    } catch (error) {
      // console.log(error)
    } finally {
      set({ isLoading: false });
    }
  },

  loadFlashcard: (id: string | null) => {
    set((state) => {
      if (!id) return { flashcard: undefined };
      const flashcard = state.flashcards?.find((card) => card._id === id);
      return { flashcard };
    });
  },
  deleteFlashCard: async (id: string | number) => {
    try {
      set({ isLoading: true });
      const response = await ApiService.deleteFlashcard(id);
      if (response.status === 200) {
        set((state) => {
          const { flashcards } = state;
          const index = flashcards?.findIndex((card) => card._id === id);
          if (index !== undefined && index >= 0 && flashcards) {
            flashcards.splice(index, 1);
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
  storeScore: async (flashcardId: string, score: number) => {
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

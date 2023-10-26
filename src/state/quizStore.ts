import ApiService from '../services/ApiService';
import { QuizData, Score, Study, MinimizedStudy } from '../types';
import { isEmpty, sortedUniq, toNumber } from 'lodash';
import { create } from 'zustand';

type SearchQueryParams = {
  search?: string;
  page?: number;
  limit?: number;
  sort?: string;
  tags?: string;
  type?: string;
};

type Pagination = {
  page: number;
  limit: number;
  count: number;
};

type Store = {
  tags: string[];
  isLoading: boolean;
  pagination: Pagination;
  minimizedStudy?: MinimizedStudy | null | undefined;
  quiz?: QuizData | null;
  quizzes: QuizData[] | null;
  fetchQuizzes: (queryParams?: SearchQueryParams) => Promise<void>;
  loadQuiz: (id: string | null, currentStudy?: MinimizedStudy) => void;
  deleteQuiz: (id: string | number) => Promise<boolean>;

  storeQuizTags: (
    quizId: string[] | string,
    tags: string[]
  ) => Promise<boolean>;
  //   storeCurrentStudy: (
  //     flashcardId: string,
  //     data: MinimizedStudy
  //   ) => Promise<void>;
  //   createFlashCard: (
  //     data: any,
  //     generatorType?: string
  //   ) => Promise<Response | undefined>;
  //   storeScore: (flashcardId: string, score: Score) => Promise<boolean>;
  //   updateQuestionAttempt: (
  //     flashcardId: string,
  //     questionText: string,
  //     isPassed: boolean
  //   ) => Promise<boolean>;
};

export default create<Store>((set) => ({
  isLoading: false,
  pagination: { limit: 10, page: 1, count: 100 },
  minimizedStudy: null,
  quizzes: null,
  tags: [],
  storeQuizTags: async (quizIds: string[] | string, tags: string[]) => {
    try {
      set({ isLoading: true });
      // if (Array.isArray(flashcardIds) && flashcardIds.length === 1) {
      //   flashcardIds = flashcardIds[0];
      // }
      const response = await ApiService.storeQuizTags(quizIds, tags);

      if (toNumber(response.status) === 200) {
        const { data } = await response.json();
        set((state) => {
          const { quizzes } = state;

          const updateQuiz = (flashcardId: string) => {
            const index = quizzes?.findIndex(
              (card) => card._id === flashcardId
            );

            // const record = data.find((d) => d._id === flashcardId);

            if (typeof index !== 'undefined' && index >= 0 && quizzes) {
              quizzes[index] = data;
            }
          };

          if (Array.isArray(quizIds)) {
            quizIds.forEach(updateQuiz);
          } else {
            updateQuiz(quizIds);
          }

          return { quizIds, tags: sortedUniq([...state.tags, ...tags]) };
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
  fetchQuizzes: async (queryParams?: {
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    try {
      const params = queryParams || ({} as SearchQueryParams);
      if (!params.page) params.page = 1;
      if (!params.limit) params.limit = 10;
      set({ isLoading: true });
      const response = await ApiService.getQuizzes(params || {});
      const { data, meta } = await response.json();

      set((prev) => {
        const d: any = {
          quizzes: data,
          pagination: meta?.pagination
        };
        if (isEmpty(prev.tags)) {
          d.tags = sortedUniq(meta?.tags);
        }
        return { ...d };
      });
    } catch (error) {
      // console.log(error)
    } finally {
      set({ isLoading: false });
    }
  },
  loadQuiz: (id: string | null, currentStudy?: MinimizedStudy) => {
    set((state) => {
      if (!id) return { quiz: undefined, minimizedStudy: null };
      const quiz = state.quizzes?.find((card) => card._id === id);
      const nextState: Partial<typeof state> = { quiz };
      if (currentStudy) {
        nextState.minimizedStudy = currentStudy;
      }
      return nextState;
    });
  },
  deleteQuiz: async (id: string | number) => {
    try {
      set({ isLoading: true });
      const response = await ApiService.deleteQuiz(id);
      if (response.status === 200) {
        set((state) => {
          const { quizzes } = state;
          const index = quizzes?.findIndex((card) => card._id === id);
          if (index !== undefined && index >= 0 && quizzes) {
            quizzes.splice(index, 1);
          }
          return { quizzes };
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
  //   storeCurrentStudy: async (flashcardId, currentStudy: MinimizedStudy) => {
  //     try {
  //       set({ isLoading: true });
  //       const response = await ApiService.storeCurrentStudy(
  //         flashcardId,
  //         currentStudy.data
  //       );
  //       const { data } = await response.json();
  //       set({ flashcards: data.flashcards });
  //     } catch (error) {
  //       // console.log(error)
  //     } finally {
  //       set({ isLoading: false });
  //     }
  //   },

  //   storeMinimized: (data: MinimizedStudy) => {
  //     set({ minimizedStudy: data });
  //   },

  //   createFlashCard: async (data: any, generatorType?: string) => {
  //     try {
  //       set({ isLoading: true });
  //       const response = await ApiService.createFlashcard(data, generatorType);
  //       if (response.status === 200) {
  //         const { data } = await response.json();
  //         set((store) => {
  //           const { flashcards } = store;
  //           flashcards?.push(data);
  //           return { flashcards };
  //         });
  //       }
  //       return response;
  //     } catch (error) {
  //       // console.log(error)
  //     } finally {
  //       set({ isLoading: false });
  //     }
  //   },
  //   storeScore: async (flashcardId: string, score: Score) => {
  //     try {
  //       set({ isLoading: true });
  //       const response = await ApiService.storeFlashcardScore({
  //         flashcardId,
  //         score
  //       });
  //       if (response.status === 200) {
  //         const { data } = await response.json();
  //         set((state) => {
  //           const { flashcards } = state;
  //           const index = flashcards?.findIndex(
  //             (card) => card._id === flashcardId
  //           );
  //           if (index !== undefined && index >= 0 && flashcards) {
  //             flashcards[index] = data;
  //           }
  //           return { flashcards };
  //         });
  //         return true;
  //       }
  //       return false;
  //     } catch (error) {
  //       return false;
  //     } finally {
  //       set({ isLoading: false });
  //     }
  //   },
  //   updateQuestionAttempt: async (
  //     flashcardId: string,
  //     questionText: string,
  //     isPassed: boolean
  //   ) => {
  //     try {
  //       set({ isLoading: true });
  //       const response = await ApiService.updateQuestionAttempt({
  //         flashcardId,
  //         questionText,
  //         isPassed
  //       });
  //       if (response.status === 200) {
  //         const { data } = await response.json();
  //         set((state) => {
  //           const { flashcards } = state;
  //           const index = flashcards?.findIndex(
  //             (card) => card._id === flashcardId
  //           );
  //           if (index !== undefined && index >= 0 && flashcards) {
  //             flashcards[index] = data;
  //           }
  //           return { flashcards };
  //         });
  //         return true;
  //       }
  //       return false;
  //     } catch (error) {
  //       return false;
  //     } finally {
  //       set({ isLoading: false });
  //     }
  //   }
  // loadQuiz: async (id: string | null, currentStudy?: MinimizedStudy) => {
  //   set((state) => {
  //     if (!id) return { flashcard: undefined, minimizedStudy: null };
  //     const flashcard = state.flashcards?.find((card) => card._id === id);
  //     // if (!flashcard) {
  //     //   const response = ApiService.getSingleFlashcard(id);
  //     //   const respJson = await response.json();
  //     //   set({ flashcard: respJson });
  //     // }

  //     const nextState: Partial<typeof state> = { flashcard };
  //     if (currentStudy) {
  //       nextState.minimizedStudy = currentStudy;
  //     }
  //     return nextState;
  //   });
  // },
}));

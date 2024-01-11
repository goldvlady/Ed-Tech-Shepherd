import ApiService from '../services/ApiService';
import { NoteDetails, SearchQueryParams, Pagination } from '../types';
import { create } from 'zustand';

type StudyPlanStore = {
  studyPlans: any[];
  tags: string[];
  isLoading: boolean;
  pagination: { page: number; limit: number; total: number };

  fetchPlans: (page: number, limit: number) => Promise<void>;

  //   fetchSingleNote: (id: string) => void;
  //   createNote: (data: any) => Promise<boolean>;
  createStudyPlan: (data: any) => Promise<boolean>;
  //   updateNote: (id: string, data: any) => Promise<boolean>;
  //   deleteNote: (id: string) => Promise<boolean>;
  //   storeNoteTags: (
  //     noteId: string[] | string,
  //     tags: string[]
  //   ) => Promise<boolean>;
};

export default create<StudyPlanStore>((set) => ({
  studyPlans: [],
  tags: [],
  isLoading: false,
  pagination: { limit: 10, page: 1, count: 100 },

  fetchPlans: async (page: number, limit: number) => {
    set({ isLoading: true });
    try {
      // const params = queryParams || ({} as SearchQueryParams);
      // if (!params.page) params.page = 1;
      // if (!params.limit) params.limit = 10;
      set({ isLoading: true });
      const response = await ApiService.getStudyPlans(page, limit);
      const { data, meta } = await response.json();

      set({ studyPlans: data, pagination: meta.pagination });
    } catch (error) {
      // console.log(error)
    } finally {
      set({ isLoading: false });
    }
  },
  //   // Fetching a single note
  //   fetchSingleNote: async (id: string) => {
  //     try {
  //       set({ isLoading: true });
  //       const response = await ApiService.getNote(id);
  //       const data = await response.json();
  //       set((state) => ({ ...state, notes: [...state.notes, data] }));
  //     } catch (error) {
  //       // Handle error
  //     } finally {
  //       set({ isLoading: false });
  //     }
  //   },

  //   storeNoteTags: async (noteIds: string[] | string, tags: string[]) => {
  //     try {
  //       set({ isLoading: true });
  //       const response = await ApiService.storeNotesTags(noteIds, tags); // Assuming this API call exists
  //       if (response.status === 200) {
  //         const { data } = await response.json();
  //         set((state) => {
  //           const { notes } = state;
  //           if (Array.isArray(noteIds)) {
  //             noteIds.forEach((noteId) => {
  //               const index = notes.findIndex((note) => note._id === noteId);
  //               const record = data.find((d) => d._id === noteId);
  //               if (index !== -1) {
  //                 notes[index] = record;
  //               }
  //             });
  //           } else {
  //             const index = notes.findIndex((note) => note._id === noteIds);
  //             const record = data.find((d) => d._id === noteIds);
  //             if (index !== -1) {
  //               notes[index] = record;
  //             }
  //           }
  //           return { notes, tags: [...state.tags, ...tags].sort() };
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

  // Creating a new note
  createStudyPlan: async (data: any) => {
    try {
      set({ isLoading: true });
      const response = await ApiService.createStudyPlan(data);
      if (response.status === 200) {
        const newPlan = await response.json();
        set((state) => ({
          ...state,
          studyPlans: [...state.studyPlans, newPlan]
        }));
        return true;
      }
      return false;
    } catch (error) {
      return false;
    } finally {
      set({ isLoading: false });
    }
  }

  //   // Updating a note
  //   updateNote: async (id: string, data: any) => {
  //     try {
  //       set({ isLoading: true });
  //       const response = await ApiService.updateNote(id, data);
  //       if (response.status === 200) {
  //         const updatedNote = await response.json();
  //         set((state) => ({
  //           ...state,
  //           notes: state.notes.map((note) =>
  //             note._id === id ? updatedNote : note
  //           )
  //         }));
  //         return true;
  //       }
  //       return false;
  //     } catch (error) {
  //       return false;
  //     } finally {
  //       set({ isLoading: false });
  //     }
  //   },

  //   // Deleting a note
  //   deleteNote: async (id: string) => {
  //     try {
  //       set({ isLoading: true });
  //       const response = await ApiService.deleteNote(id);
  //       if (response.status === 200) {
  //         set((state) => ({
  //           ...state,
  //           notes: state.notes.filter((note) => !id.split(',').includes(note._id))
  //         }));
  //         return true;
  //       }
  //       return false;
  //     } catch (error) {
  //       return false;
  //     } finally {
  //       set({ isLoading: false });
  //     }
  //   }
}));

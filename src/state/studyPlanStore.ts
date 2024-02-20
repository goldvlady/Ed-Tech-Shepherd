import ApiService from '../services/ApiService';
import { NoteDetails, SearchQueryParams, Pagination } from '../types';
import { create } from 'zustand';

type StudyPlanStore = {
  studyPlans: any[];
  studyPlanResources: any[];
  studyPlanReport: any;
  studyPlanUpcomingEvent: any[];

  isLoading: boolean;
  pagination: { page: number; limit: number; total: number };
  fetchPlans: (page: number, limit: number) => Promise<void>;
  fetchPlanResources: (planId: string) => Promise<void>;
  fetchPlanReport: (planId: string) => Promise<void>;
  fetchUpcomingPlanEvent: () => Promise<void>;
  createStudyPlan: (data: any) => Promise<boolean>;
};

export default create<StudyPlanStore>((set) => ({
  studyPlans: [],
  studyPlanResources: [],
  studyPlanReport: null,
  studyPlanUpcomingEvent: [],
  isLoading: false,
  pagination: { limit: 10, page: 1, total: 100 },

  fetchPlans: async (page: number, limit: number) => {
    set({ isLoading: true });
    try {
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
  fetchUpcomingPlanEvent: async () => {
    set({ isLoading: true });
    try {
      set({ isLoading: true });
      const response = await ApiService.getUpcomingStudyPlanEvent();
      const { data } = await response.json();

      set({ studyPlanUpcomingEvent: data });
    } catch (error) {
      // console.log(error)
    } finally {
      set({ isLoading: false });
    }
  },

  fetchPlanResources: async (planId: string) => {
    set({ isLoading: true });
    try {
      const response = await ApiService.getStudyPlanResources(planId);
      const { data } = await response.json();

      set({ studyPlanResources: data });
      return data;
    } catch (error) {
      // console.log(error)
    } finally {
      set({ isLoading: false });
    }
  },
  fetchPlanReport: async (planId: string) => {
    set({ isLoading: true });

    try {
      set({ isLoading: true });
      const response = await ApiService.getStudyPlanReport(planId);
      const data = await response.json();

      set({ studyPlanReport: data });
      return data;
    } catch (error) {
      // console.log(error)
    } finally {
      set({ isLoading: false });
    }
  },
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
}));

import ApiService from '../services/ApiService';
import { create } from 'zustand';

type Store = {
  clients: [] | null;
  schoolStudents: [] | null;
  schoolCourses: [] | null;
  isLoading: boolean;
  fetchClients: () => Promise<void>;
  fetchSchoolTutorStudents: () => Promise<void>;
  fetchSchoolCourses: () => Promise<void>;
};

export default create<Store>((set) => ({
  clients: null,
  schoolStudents: null,
  schoolCourses: null,
  isLoading: false,

  fetchClients: async () => {
    set({ isLoading: true });
    try {
      set({ isLoading: true });
      const response = await ApiService.getTutorClients(1, 40);
      const { data } = await response.json();
      set({ clients: data });
    } catch (error) {
      // console.log(error)
    } finally {
      set({ isLoading: false });
    }
  },

  fetchSchoolTutorStudents: async () => {
    set({ isLoading: true });
    try {
      set({ isLoading: true });
      const response = await ApiService.getSchoolTutorStudents(1, 40);
      const { data } = await response.json();
      console.log(data);

      set({ schoolStudents: data });
    } catch (error) {
      // console.log(error)
    } finally {
      set({ isLoading: false });
    }
  },
  fetchSchoolCourses: async () => {
    set({ isLoading: true });
    try {
      set({ isLoading: true });
      const response = await ApiService.getSchoolCourses(1, 40);
      const { data } = await response.json();
      console.log(data);

      set({ schoolCourses: data });
    } catch (error) {
      // console.log(error)
    } finally {
      set({ isLoading: false });
    }
  }
}));

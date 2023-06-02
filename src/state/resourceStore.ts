import { create } from "zustand";
import ApiService from "../services/ApiService";
import { Course, User } from "../types";

type Store = {
  courses: Array<Course>;
  resourcesLoaded: boolean;
  fetchResources: () => Promise<void>;
};

export default create<Store>((set) => ({
  courses: [],
  resourcesLoaded: false,
  fetchResources: async () => {
    const response = await ApiService.getResources();
    const data = await response.json();
    set({ courses: data.courses, resourcesLoaded: true });
  },
}));

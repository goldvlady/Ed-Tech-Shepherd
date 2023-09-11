import ApiService from '../services/ApiService';
import { create } from 'zustand';

type Store = {
  clients: [] | null;
  isLoading: boolean;
  fetchClients: () => Promise<void>;
};

export default create<Store>((set) => ({
  clients: null,
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
  }
}));

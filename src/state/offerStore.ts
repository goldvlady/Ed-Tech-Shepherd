import ApiService from '../services/ApiService';
import { create } from 'zustand';

type Store = {
  offers: [] | null;
  isLoading: boolean;
  fetchOffers: (page: number, limit: number, userType: string) => Promise<void>;
  pagination: { page: number; limit: number; total: number };

  offer?: any | null;
  //fechOffer: (id: string | number) => void;

  //acceptOffer: (id: string | number) => void;
  //declineOffer: (id: string | number) => Promise<boolean>;
};

export default create<Store>((set) => ({
  offers: null,
  isLoading: false,
  pagination: { page: 0, limit: 0, total: 0 },
  fetchOffers: async (page: number, limit: number, userType: string) => {
    set({ isLoading: true });
    try {
      set({ isLoading: true });
      const response = await ApiService.getOffers(page, limit, userType);
      const { data } = await response.json();

      set({ offers: data.data, pagination: data.meta.pagination });
    } catch (error) {
      // console.log(error)
    } finally {
      set({ isLoading: false });
    }
  }

  // fetchOffer: (id: string | number) => {
  //   set((state) => {
  //     if (!id) return { offer: undefined };
  //     const offer = state.offers?.find((offer) => offer._id === id);
  //     return {offer}
  //   })
  // },

  // acceptOffer: async (id: string | number) => {
  //   try {
  //     set({ isLoading: true });
  //     const response = await ApiService.acceptOffer(id);

  //     if (response.status === 200) {
  //       set((state) => {
  //         const { offers } = state;
  //         const index = offers?.findIndex((card) => card?._id === id);
  //         if (index !== undefined && index >= 0 && offers) {
  //           offers.splice(index, 1);
  //         }
  //         return { offers };
  //       });
  //       return true;
  //     }
  //   } catch (error) {
  //     return false;
  //   } finally {
  //     set({ isLoading: false });
  //   }
  // },

  // declineOffer: async (id: string | number) => {
  //   try {
  //     set({ isLoading: true });
  //     const response = await ApiService.declineOffer(id);
  //     if (response.status === 200) {
  //       set((state) => {
  //         const { offers } = state;
  //         const index = offers?.findIndex((card) => card._id === id);
  //         if (index !== undefined && index >= 0 && offers) {
  //           offers.splice(index, 1);
  //         }
  //         return { offers };
  //       });
  //       return true;
  //     }
  //     return false;
  //   } catch (error) {
  //     return false;
  //   } finally {
  //     set({ isLoading: false });
  //   }
  // },
}));

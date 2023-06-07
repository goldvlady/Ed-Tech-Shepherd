import { create } from 'zustand';

import ApiService from '../services/ApiService';
import { User } from '../types';

type Store = {
    user: User | null;
    fetchUser: () => Promise<void>;
};

export default create<Store>((set) => ({
    user: null,
    fetchUser: async () => {
        const response = await ApiService.getUser();
        set({ user: await response.json() });
    },
}));

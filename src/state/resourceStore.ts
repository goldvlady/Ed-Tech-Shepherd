import { create } from 'zustand';

import ApiService from '../services/ApiService';
import { Course, Country } from '../types';

type Store = {
    courses: Array<Course>;
    countries: Array<Country>;
    resourcesLoaded: boolean;
    fetchResources: () => Promise<void>;
};

export default create<Store>((set) => ({
    courses: [],
    countries: [],
    resourcesLoaded: false,
    fetchResources: async () => {
        const response = await ApiService.getResources();
        const data = await response.json();
        const countriesResponse = await ApiService.getCountries();
        const countriesData = await countriesResponse.json()
        const countries: Array<Country> = countriesData.map((country: any) => ({name: country.name.common})).sort((a: any, b: any) => a.name.localeCompare(b.name));

        set({ courses: data.courses, countries, resourcesLoaded: true });
    },
}));

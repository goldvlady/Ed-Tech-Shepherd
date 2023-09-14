import ApiService from '../services/ApiService';
import {
  Pagination,
  SearchQueryParams,
  StudentDocument,
  StudentDocumentPayload
} from '../types';
import { create } from 'zustand';

type StudentDocumentStore = {
  studentDocuments: StudentDocument[];
  tags: string[];
  isLoading: boolean;
  pagination: Pagination;
  fetchStudentDocuments: (queryParams?: SearchQueryParams) => Promise<void>;
  saveDocument: (document: StudentDocumentPayload) => Promise<boolean>;
  deleteStudentDocument: (id: string) => Promise<boolean>;
  storeDocumentTags: (
    docId: string[] | string,
    tags: string[]
  ) => Promise<boolean>;
};

export default create<StudentDocumentStore>((set) => ({
  studentDocuments: [],
  tags: [],
  isLoading: false,
  pagination: { limit: 10, page: 1, count: 100 },

  fetchStudentDocuments: async (queryParams: SearchQueryParams = {}) => {
    try {
      set({ isLoading: true });
      const response = await ApiService.getStudentDocuments(queryParams);
      const {
        data,
        meta: { pagination, tags }
      } = await response.json();

      set({ studentDocuments: data, pagination, tags });
    } catch (error) {
      // Handle error
    } finally {
      set({ isLoading: false });
    }
  },

  fetchSingleStudentDocument: async (id: string) => {
    try {
      set({ isLoading: true });
      const response = await ApiService.getStudentDocument(id);
      const data = await response.json();
      set((state) => ({
        ...state,
        studentDocuments: [...state.studentDocuments, data]
      }));
    } catch (error) {
      // Handle error
    } finally {
      set({ isLoading: false });
    }
  },

  saveDocument: async (data: StudentDocumentPayload) => {
    try {
      set({ isLoading: true });
      const response = await ApiService.saveStudentDocument(data);
      if (response.status === 200) {
        const { data: newNote } = await response.json();
        console.log('new note', newNote);
        set((state) => ({
          ...state,
          studentDocuments: [newNote, ...state.studentDocuments]
        }));
        return true;
      }
      return false;
    } catch (error) {
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteStudentDocument: async (id: string) => {
    try {
      set({ isLoading: true });
      const response = await ApiService.deleteStudentDocument(id);
      if (response.status === 200) {
        set((state) => ({
          ...state,
          studentDocuments: state.studentDocuments.filter(
            (doc) => !id.split(',').includes(doc._id)
          )
        }));
        return true;
      }
      return false;
    } catch (error) {
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  storeDocumentTags: async (docIds: string[] | string, tags: string[]) => {
    try {
      set({ isLoading: true });
      const response = await ApiService.storeDocumentTags(docIds, tags); // Assuming this API call exists
      if (response.status === 200) {
        const { data } = await response.json();
        set((state) => {
          const { studentDocuments } = state;
          if (Array.isArray(docIds)) {
            docIds.forEach((docId) => {
              const index = studentDocuments.findIndex(
                (doc) => doc._id === docId
              );
              const record = data.find((d) => d._id === docId);
              if (index !== -1) {
                studentDocuments[index] = record;
              }
            });
          } else {
            const index = studentDocuments.findIndex(
              (doc) => doc._id === docIds
            );
            const record = data.find((d) => d._id === docIds);
            if (index !== -1) {
              studentDocuments[index] = record;
            }
          }
          return { studentDocuments };
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

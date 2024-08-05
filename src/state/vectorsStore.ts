import { create } from 'zustand';
import { MultiragDocument } from '../types';

interface vectorsStoreState {
  chatDocuments: Array<MultiragDocument>;
  addChatDocuments: (chatDocuments: Array<MultiragDocument>) => void;
}

const useVectorsStore = create<vectorsStoreState>()((set) => ({
  chatDocuments: [],
  addChatDocuments: (chatDocuments) =>
    set(() => ({ chatDocuments: chatDocuments }))
}));

export { useVectorsStore };

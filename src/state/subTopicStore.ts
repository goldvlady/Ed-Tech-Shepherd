import { create } from 'zustand';
/* 
this Zustand store is for storing the subtopic ID 
The subtopicId is to be used for routing in main Multirag and StudyPlans Multirag
*/
interface subTopicIdStoreState {
  subTopicId: string;
  setSubtopicId: (subTopicId: string) => void;
}

const useSubtopicIdStore = create<subTopicIdStoreState>()((set) => ({
  subTopicId: '',
  setSubtopicId: (subTopicId: string) => set(() => ({ subTopicId }))
}));

export { useSubtopicIdStore };

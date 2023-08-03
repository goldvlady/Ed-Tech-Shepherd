import { NoteDetails } from './../views/Dashboard/Notes/types';
import { create } from 'zustand';

type Store = {
  pinnedNotes: NoteDetails[] | null;
  pinnedNotesCount: number;
};

export default create<Store>((set) => ({
  pinnedNotes: [],
  pinnedNotesCount: 0
  // other definitions here. For now, we will only add local pinned notes loading
}));

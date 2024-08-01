import { NoteStore } from '../state/noteStore';

export const openDB = (
  dbName: string,
  version: number
): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, version);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('notes')) {
        db.createObjectStore('notes');
      }
    };

    request.onsuccess = (event: Event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onerror = (event: Event) => {
      reject('Error opening IndexedDB');
    };
  });
};

export const saveState = async (state: Partial<NoteStore>): Promise<void> => {
  const db = await openDB('noteCacheDB', 1);
  const transaction = db.transaction('notes', 'readwrite');
  const store = transaction.objectStore('notes');
  const stateToSave = {
    pinnedNotes: state.pinnedNotes,
    pinnedNotesCount: state.pinnedNotesCount,
    notes: state.notes,
    tags: state.tags,
    pagination: state.pagination
  };
  console.log('STATE TO SAVE', stateToSave);
  return new Promise((resolve, reject) => {
    const request = store.put(stateToSave, 'noteStore');
    request.onsuccess = () => {
      resolve();
    };
    request.onerror = () => {
      reject('Error saving state to IndexedDB');
    };
  });
};

export const loadState = async (): Promise<Partial<NoteStore>> => {
  const db = await openDB('noteCacheDB', 1);
  const transaction = db.transaction('notes', 'readonly');
  const store = transaction.objectStore('notes');

  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = (event: Event) => {
      const states = (event.target as IDBRequest).result;
      console.log('LOAD STATE', states);
      if (states.length > 0) {
        resolve(states[0]);
      } else {
        resolve({
          pinnedNotes: null,
          pinnedNotesCount: 0,
          notes: [],
          tags: [],
          pagination: { limit: 10, page: 1, count: 100 }
        });
      }
    };
    request.onerror = () => {
      reject('Error loading state from IndexedDB');
    };
  });
};

export const clearState = async (): Promise<void> => {
  const db = await openDB('noteCacheDB', 1);
  const transaction = db.transaction('notes', 'readwrite');
  const store = transaction.objectStore('notes');

  return new Promise((resolve, reject) => {
    const request = store.clear();
    request.onsuccess = () => {
      resolve();
    };
    request.onerror = () => {
      reject('Error clearing state from IndexedDB');
    };
  });
};

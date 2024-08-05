import { NoteStore } from '../state/noteStore';

export const openDB = (
  dbName: string = 'pdfCacheDB', 
  version: number = 1
): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, version);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (dbName === 'pdfCacheDB') {
        if (!db.objectStoreNames.contains('pdfs')) {
          db.createObjectStore('pdfs', { keyPath: 'url' });
        }
      }
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


export const urlExistsInCache = async (url: string): Promise<boolean> => {
  const db = await openDB();
  const transaction = db.transaction('pdfs', 'readonly');
  const store = transaction.objectStore('pdfs');

  return new Promise((resolve, reject) => {
    const request = store.get(url);
    request.onsuccess = (event: Event) => {
      resolve((event.target as IDBRequest).result !== undefined);
    };
    request.onerror = (event: Event) => {
      reject('Error checking URL in cache');
    };
  });
};

export const addPDFToCacheIfNotExists = async (
  url: string,
  pdfBlob: Blob
): Promise<void> => {
  const exists = await urlExistsInCache(url);
  if (exists) {
    console.log(`URL ${url} already exists in cache, skipping save.`);
    return;
  }

  const db = await openDB();
  const transaction = db.transaction('pdfs', 'readwrite');
  const store = transaction.objectStore('pdfs');

  const pdfData = { url, pdfBlob };
  store.put(pdfData);

  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => {
      resolve();
    };
    transaction.onerror = () => {
      reject('Error adding PDF to cache');
    };
  });
};

export const getPDFFromCache = async (
  url: string
): Promise<Blob | undefined> => {
  const db = await openDB();
  const transaction = db.transaction('pdfs', 'readonly');
  const store = transaction.objectStore('pdfs');
  return new Promise((resolve, reject) => {
    const request = store.get(url);
    request.onsuccess = (event: Event) => {
      resolve((event.target as IDBRequest).result?.pdfBlob);
    };
    request.onerror = (event: Event) => {
      reject('Error retrieving PDF from cache');
    };
  });
};

export const loadPDF = async (url: string): Promise<string> => {
  const cachedPDF = await getPDFFromCache(url);

  if (cachedPDF) {
    return URL.createObjectURL(cachedPDF);
  } else {
    const response = await fetch(url);
    const pdfBlob = await response.blob();
    await addPDFToCacheIfNotExists(url, pdfBlob);
    return URL.createObjectURL(pdfBlob);
  }
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


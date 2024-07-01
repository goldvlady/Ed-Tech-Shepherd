export const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('pdfCacheDB', 1);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('pdfs')) {
        db.createObjectStore('pdfs', { keyPath: 'url' });
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

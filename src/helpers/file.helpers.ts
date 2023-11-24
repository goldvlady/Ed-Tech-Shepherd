import { storage } from '../firebase';
import ApiService from '../services/ApiService';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  UploadTaskSnapshot
} from 'firebase/storage';

type Listener<T extends any[] = any[]> = (...args: T) => void;

interface UploadEvents {
  progress: Listener<[number]>;
  error: Listener<[Error]>;
  complete: Listener<[UploadMetadata]>;
}

class UploadEventEmitter {
  private events: Partial<Record<keyof UploadEvents, Listener[]>> = {};

  on<T extends keyof UploadEvents>(event: T, listener: UploadEvents[T]) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event]?.push(listener);
  }

  emit<T extends keyof UploadEvents>(
    event: T,
    ...args: Parameters<UploadEvents[T]>
  ) {
    if (!this.events[event]) return;
    for (const listener of this.events[event] as Listener[]) {
      listener(...args);
    }
  }
}

export interface UploadMetadata {
  fileUrl: string;
  contentType: string;
  size: number;
  name?: string;
  studentID?: string;
  documentID?: string;
}

export const uploadFile = (file: File, body?: any, useS3?: boolean) => {
  const emitter = new UploadEventEmitter();

  const storageRef = ref(storage, `uploads/${file.name}`);
  const uploadTask = uploadBytesResumable(storageRef, file);

  uploadTask.on(
    'state_changed',
    (snapshot: UploadTaskSnapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      emitter.emit('progress', progress);
    },
    (error) => {
      emitter.emit('error', error);
    },
    async () => {
      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

      // After uploading to Firebase, use the URL for S3 upload
      if (useS3) {
        try {
          const response = await ApiService.uploadFileToS3(downloadURL);
          if (!response.ok) {
            emitter.emit('error', Error('Failed to upload to S3'));
          }
          const body = await response.json();
          emitter.emit('complete', body.data);
        } catch (error) {
          emitter.emit('error', error);
        }
      } else {
        const metadata = {
          fileUrl: downloadURL,
          contentType: file.type,
          size: file.size,
          name: file.name
        };
        emitter.emit('complete', metadata);
      }
    }
  );

  return emitter;
};

export const snip = (text, n = 25) => {
  if (text.length > n) {
    const mid = Math.floor(n / 2);
    const truncatedText =
      text.slice(0, mid - 1) + '...' + text.slice(text.length - mid + 2);
    return truncatedText;
  }
  return text;
};

export default uploadFile;

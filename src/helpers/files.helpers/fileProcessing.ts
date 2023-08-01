import ApiService from '../../services/ApiService';
import { StudentDocumentPayload } from '../../types';

class FileProcessingService {
  private documentInfo: StudentDocumentPayload;
  private apiService = ApiService;

  constructor(documentInfo: StudentDocumentPayload) {
    this.documentInfo = documentInfo;
  }

  async process() {
    const saveFile = await this.apiService.saveStudentDocument(
      this.documentInfo
    );

    if (saveFile.status === 200) {
      const { data } = await saveFile.json();

      await this.apiService.processDocument({
        studentId: data.student?._id,
        documentId: data._id,
        documentURL: data.documentUrl,
        title: data.title
      });

      return this.checkIngested(data.student?._id, data._id);
    }

    throw new Error('Failed to save document');
  }

  private checkIngested(studentId: string, documentId: string) {
    let attempts = 0;

    const checkStatus = async (
      resolve: (value: string) => void,
      reject: (reason?: any) => void
    ) => {
      try {
        if (attempts > 10) {
          reject('Document processing failed');
          return;
        }

        const check = await this.apiService.checkDocumentStatus({
          studentId,
          documentId
        });
        if (check.status === 'ingested') {
          resolve('Document successfully ingested');
        } else if (check.status === 'too_large') {
          reject('Document is too large');
        } else if (check.status === 'failed') {
          reject('Failed to process file');
        } else {
          attempts++;
          setTimeout(checkStatus, 10000, resolve, reject);
        }
      } catch (error) {
        reject(error);
      }
    };

    return new Promise<string>(checkStatus);
  }
}

export default FileProcessingService;

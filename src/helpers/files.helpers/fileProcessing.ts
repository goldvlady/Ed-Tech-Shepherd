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

  async checkIngested(studentId: string, documentId: string) {
    let status;

    const subscribe = async () => {
      const response = await this.apiService
        .checkDocumentStatus({
          studentId,
          documentId
        })
        .then((res) => res.json());

      if (response.pollStatus === 'done') {
        Promise.resolve(documentId);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await subscribe();
      }
    };

    await subscribe();
    return status;
  }
}

export default FileProcessingService;

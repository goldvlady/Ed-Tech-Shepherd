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

      return await this.apiService.processDocument({
        studentId: data.student?._id,
        documentId: data._id,
        documentURL: data.documentUrl,
        title: data.title
      });
    }

    throw new Error('Failed to save document');
  }
}

export default FileProcessingService;

import { AI_API } from '../config';

class ApiService {
  static AI_ENDPOINT = AI_API;

  static processDocument = async (data: {
    studentId: string;
    documentId: string;
    documentURL: string;
    tags?: Array<string>;
    courseId?: string;
  }) => {
    const processDoc = await fetch(
      `${ApiService.AI_ENDPOINT}/embeddings/ingest`,
      {
        method: 'POST',
        headers: {
          'x-shepherd-header': 'vunderkind23',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }
    ).then(async (data) => data.json());

    return processDoc;
  };

  static checkDocumentStatus = async (data: {
    studentId: string;
    documentId: string;
  }) => {
    const document = await fetch(
      `${ApiService.AI_ENDPOINT}/docs/check-status`,
      {
        method: 'POST',
        headers: {
          'x-shepherd-header': 'vunderkind23',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }
    ).then(async (data) => data.json());

    return document;
  };
}

export default ApiService;

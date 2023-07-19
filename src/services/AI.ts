import { AI_API, HEADER_KEY } from '../config';

export const processDocument = async (data: {
  studentId: string;
  documentId: string;
  documentURL: string;
  tags?: Array<string>;
  courseId?: string;
}) => {
  const processDoc = await fetch(`${AI_API}/embeddings/ingest`, {
    method: 'POST',
    headers: {
      'x-shepherd-header': HEADER_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }).then(async (data) => data.json());

  return processDoc;
};

export const checkDocumentStatus = async ({
  studentId,
  documentId,
  title
}: {
  studentId: string;
  documentId: string;
  title: string;
}) => {
  const document = await fetch(`${AI_API}/docs/check-status`, {
    method: 'POST',
    headers: {
      'x-shepherd-header': HEADER_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ studentId, documentId, title })
  }).then(async (data) => data.json());

  return document;
};

export const chatWithDoc = async ({
  query,
  studentId,
  documentId
}: {
  studentId: string;
  query: string;
  documentId: string;
}) => {
  const request = await fetch(`${AI_API}/embeddings/doc-chat`, {
    method: 'POST',
    headers: {
      'x-shepherd-header': HEADER_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query,
      studentId,
      documentId
    })
  });

  return request;
};

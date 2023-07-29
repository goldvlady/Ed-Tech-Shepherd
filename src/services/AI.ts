import { AI_API, HEADER_KEY } from '../config';

export const processDocument = async (data: {
  studentId: string;
  documentId: string;
  documentURL: string;
  tags?: Array<string>;
  courseId?: string;
  title: string;
}) => {
  const processDoc = await fetch(`${AI_API}/notes/ingest`, {
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
  documentId
}: {
  studentId: string;
  documentId: string;
}) => {
  const document = await fetch(`${AI_API}/notes/status`, {
    method: 'POST',
    headers: {
      'x-shepherd-header': HEADER_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ studentId, documentId })
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
  const request = await fetch(`${AI_API}/notes/chat`, {
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

export const createDocchatFlashCards = async (data: any) => {
  const request = await fetch(`${AI_API}/flash-cards/generate-from-notes`, {
    method: 'POST',
    headers: {
      'x-shepherd-header': HEADER_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  return request;
};

export const chatHomeworkHelp = async ({
  query,
  studentId
}: {
  studentId: string;
  query: string;
}) => {
  const request = await fetch(`${AI_API}/homework-help/chat`, {
    method: 'POST',
    headers: {
      'x-shepherd-header': HEADER_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query,
      studentId
    })
  });

  return request;
};

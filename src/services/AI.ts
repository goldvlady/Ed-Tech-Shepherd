import { AI_API, HEADER_KEY } from '../config';

type DocumentType = {
  topic?: string;
  count: number;
  studentId: string;
  documentId: string;
};

export const fetchStudentDocuments = async (studentId: string) => {
  return await fetch(`${AI_API}/notes?studentId=${studentId}`, {
    headers: {
      'x-shepherd-header': HEADER_KEY
    }
  }).then((documents) => documents.json());
};
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
  const document = await fetch(
    `${AI_API}/notes/status?studentId=${studentId}&documentId=${documentId}`,
    {
      headers: {
        'x-shepherd-header': HEADER_KEY
      }
    }
  );

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

export const createDocchatFlashCards = async (data: DocumentType) => {
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
  studentId,
  topic
}: {
  studentId: string;
  query: string;
  topic: string;
}) => {
  const request = await fetch(`${AI_API}/homework-help/chat`, {
    method: 'POST',
    headers: {
      'x-shepherd-header': HEADER_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query,
      studentId,
      topic
    })
  });

  return request;
};

export const chatHistory = async ({
  documentId,
  studentId
}: {
  documentId: string;
  studentId: string;
}) => {
  const response = await fetch(
    `${AI_API}/notes/chat/history?studentId=${studentId}&documentId=${documentId}`,
    {
      method: 'GET',
      headers: {
        'x-shepherd-header': HEADER_KEY
      }
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  } else {
    const chatHistory = await response.json();
    return chatHistory;
  }
};

export const generateSummary = async ({
  documentId,
  studentId
}: {
  documentId: string;
  studentId: string;
}) => {
  const response = await fetch(
    `${AI_API}/notes/summary?studentId=${studentId}&documentId=${documentId}`,
    {
      method: 'GET',
      headers: {
        'x-shepherd-header': HEADER_KEY
      }
    }
  );
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  } else {
    const summaryResponse = await response.json();
    return summaryResponse;
  }
};
export const postGenerateSummary = async ({
  documentId,
  studentId
}: {
  documentId: string;
  studentId: string;
}) => {
  const request = await fetch(`${AI_API}/notes/summary/generate`, {
    method: 'POST',
    headers: {
      'x-shepherd-header': HEADER_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      documentId,
      studentId
    })
  });

  return request;
};

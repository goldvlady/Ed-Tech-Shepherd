import { database } from '../firebase';
import {
  ref,
  onValue,
  off,
  DataSnapshot,
  remove,
  query,
  orderByChild,
  equalTo
} from 'firebase/database';
import React, { useEffect, useState, useCallback } from 'react';

type FlashcardQuestion = {
  question: string;
  questionType: string;
  answer: string;
  explanation: string;
};

type Job = {
  documentId: string;
  flashcards: FlashcardQuestion[];
};

function useFlashcardQuestionsJob(studentID: string) {
  const [flashcardQuestions, setFlashcardQuestions] = useState<
    FlashcardQuestion[]
  >([]);

  // Function to watch new jobs for a documentId
  const watchJobs = useCallback(
    (
      documentId: string,
      callback?: (error: any, flashcards?: FlashcardQuestion[]) => void
    ) => {
      const jobsRef = ref(database, `/flashcards-job/${studentID}`);
      const documentIdQuery = query(
        jobsRef,
        orderByChild('documentId'),
        equalTo(documentId)
      );

      onValue(
        documentIdQuery,
        (snapshot: DataSnapshot) => {
          const jobsData: { [key: string]: Job } = snapshot.val() || {};

          const allFlashcards: FlashcardQuestion[] = [];

          // Collect flashcards from each job that matches the documentId
          Object.values(jobsData).forEach((job) => {
            if (job.documentId === documentId && job.flashcards) {
              allFlashcards.push(
                ...job.flashcards.map((question) => ({
                  ...question,
                  questionType: 'openEnded'
                }))
              );
            }
          });

          setFlashcardQuestions(allFlashcards);
          if (callback) {
            callback(null, allFlashcards);
          }
        },
        (error) => {
          callback && callback(error);
        }
      );
    },
    [studentID]
  );

  // Function to delete all jobs for a documentId
  const clearJobs = useCallback(
    (documentId: string) => {
      const jobsRef = ref(database, `/flashcards-job/${studentID}`);
      const documentIdQuery = query(
        jobsRef,
        orderByChild('documentId'),
        equalTo(documentId)
      );

      onValue(
        documentIdQuery,
        (snapshot: DataSnapshot) => {
          const jobsData: { [key: string]: Job } = snapshot.val() || {};

          // Iterate over each job and delete it if it matches the documentId
          Object.keys(jobsData).forEach((jobKey) => {
            if (jobsData[jobKey].documentId === documentId) {
              remove(ref(database, `/flashcards-job/${studentID}/${jobKey}`));
            }
          });
        },
        (error) => {
          // console.error('Firebase delete error:', error);
        }
      );
    },
    [studentID]
  );

  return {
    flashcardQuestions,
    watchJobs,
    clearJobs
  };
}

export default useFlashcardQuestionsJob;

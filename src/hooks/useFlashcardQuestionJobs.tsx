import { database } from '../firebase';
import {
  ref,
  onValue,
  off,
  DataSnapshot,
  remove,
  query,
  orderByChild,
  equalTo,
  limitToLast
} from 'firebase/database';
import { useEffect, useState, useCallback } from 'react';

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
      const jobsRef = ref(database, `/flashcard-job/${studentID}`);
      const documentIdQuery = query(
        jobsRef,
        orderByChild('documentId'),
        equalTo(documentId)
      );
      onValue(
        documentIdQuery,
        (snapshot: DataSnapshot) => {
          const jobsData = snapshot.val() || {};
          const jobKeysToDelete: string[] = [];
          const filteredJobs = Object.values(jobsData).filter(
            (job: any, index) => {
              if (job.documentId === documentId) {
                jobKeysToDelete.push(Object.keys(jobsData)[index]); // Collect keys for deletion
                return true;
              }
              return false;
            }
          );

          if (filteredJobs.length) {
            // Sort by datetime on the client side
            const sortedJobs = filteredJobs.sort((a: any, b: any) => {
              const datetimeA = new Date(a.datetime).getTime();
              const datetimeB = new Date(b.datetime).getTime();
              return datetimeB - datetimeA; // For descending order
            });

            // Get the most recent job, which is the first item in the sorted array
            const mostRecentJob: any = sortedJobs[0];

            const allFlashcards: FlashcardQuestion[] = [];

            mostRecentJob.flashcards.forEach((question: any) => {
              allFlashcards.push({
                ...question,
                questionType: 'openEnded'
              });
            });

            if (allFlashcards.length) {
              setFlashcardQuestions(allFlashcards);
            }
            if (callback) {
              callback(null, allFlashcards);
            }

            jobKeysToDelete.forEach((key) => {
              const jobRef = ref(
                database,
                `/flashcard-job/${studentID}/${key}`
              );
              remove(jobRef);
            });
            off(documentIdQuery); // Stop listening to changes
          }

          // // Collect flashcards from each job that matches the documentId
          // Object.values(jobsData).forEach((job) => {
          //   if (job.documentId === documentId && job.flashcards) {
          //       ...job.flashcards.map((question) => ({
          //         ...question,
          //         questionType: 'openEnded'
          //       }))
          //     );
          //   }
          // });
        },
        (error) => {
          callback(error);
        }
      );
    },
    [studentID]
  );
  // Function to delete all jobs for a documentId
  const clearJobs = useCallback(
    (documentId: string) => {
      console.log('Clearing jobs for documentId:', documentId);
      const jobsRef = ref(database, `/flashcards-job/${studentID}`);

      remove(jobsRef)
        .then(() => {
          console.log('Jobs cleared');
          setFlashcardQuestions([]);
        })
        .catch((error) => {
          console.error('Error clearing jobs:', error);
        });
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

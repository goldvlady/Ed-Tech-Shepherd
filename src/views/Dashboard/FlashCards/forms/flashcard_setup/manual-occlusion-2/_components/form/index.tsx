import { useEffect, useState } from 'react';
import { Input } from '../../../../../../../../components/ui/input';
import ImageUploader from './_components/image-uploader';
import Occlusion from './_components/occlusion';
import ApiService from '../../../../../../../../services/ApiService';
import CardSavedDialog from '../card-saved-dialog';
import { Label } from '../../../../../../../../components/ui/label';
import StudySession from '../study-session';
import { useMutation } from '@tanstack/react-query';
import { cn } from '../../../../../../../../library/utils';
import OccResultsDialog from '../study-session/_components';

const INITIAL_STATE = {
  title: '',
  imageURL: '',
  imageUploader: {
    open: false
  },
  occlusion: {
    open: false,
    elements: []
  },
  afterSubmission: {
    open: false,
    data: {
      _id: ''
    }
  },
  studySession: {
    open: false
  },
  score: {
    right: 0,
    wrong: 0,
    notRemembered: 0
  }
};

function Form() {
  const [formState, setFormState] = useState(INITIAL_STATE);
  const { mutate, isPending } = useMutation({
    mutationFn: ApiService.createOcclusionCard,
    onSuccess: async (res) => {
      let data = await res.json();
      setFormState(() => ({
        title: '',
        imageURL: '',
        imageUploader: { open: false },
        occlusion: { open: false, elements: [] },
        afterSubmission: { open: true, data },
        studySession: { open: false },
        score: { right: 0, wrong: 0, notRemembered: 0 }
      }));
    }
  });
  const [quizOver, setQuizOver] = useState(false);
  const [openResults, setOpenResults] = useState(false);

  useEffect(() => {
    if (formState.imageURL) {
      setFormState((prevState) => ({
        ...prevState,
        occlusion: { ...prevState.occlusion, open: true }
      }));
    }
  }, [formState.imageURL]);

  const resetForm = () => {
    setFormState(INITIAL_STATE);
  };

  const handleSubmit = async () => {
    const payload = {
      imageUrl: formState.imageURL,
      labels: formState.occlusion.elements,
      title: formState.title
    };

    mutate(payload);
  };

  const startStudySession = () => {
    setFormState((prevState) => ({
      ...prevState,
      afterSubmission: { ...prevState.afterSubmission, open: false },
      studySession: { open: true }
    }));
  };

  const restartStudySession = () => {
    setFormState((prevState) => ({
      ...prevState,
      studySession: { open: true },
      score: { right: 0, wrong: 0, notRemembered: 0 }
    }));
    setOpenResults(false);
  };

  return (
    <div>
      <Label
        htmlFor="deckname"
        className="text-[#5C5F64] font-medium text-xs mb-2"
      >
        Deckname
      </Label>
      <Input
        id="deckname"
        placeholder="e.g Heart Diagram"
        value={formState.title}
        className="mt-2 max-h-none h-12 py-3 pb-3.5 border-[#E4E5E7] focus:ring-0 focus-visible:ring-0"
        onChange={(e) => {
          setFormState({ ...formState, title: e.target.value });
        }}
      />
      <p className="my-6 font-medium text-[16px] text-[#585F68]">
        Study annotated images and diagrams with image
        <br /> occlusion. Add an image to begin.
      </p>
      <ImageUploader
        // deckName={formState.title}
        deckName={formState.title}
        setImage={(imageURI) => {
          setFormState({ ...formState, imageURL: imageURI });
        }}
      />
      <Occlusion
        // Set occulsion elements in top level state
        setElements={(elements) => {
          setFormState((prevState) => ({
            ...prevState,
            occlusion: { ...prevState.occlusion, elements }
          }));
        }}
        // Open and close occlusion occulsion. It usually opens when an image URI is available
        open={formState.occlusion.open}
        close={() => {
          setFormState((prevState) => ({
            ...prevState,
            occlusion: { ...prevState.occlusion, open: false },
            imageURL: ''
          }));
        }}
        // Selected Image URI
        imageURI={formState.imageURL}
        // Occlusion elements
        elements={formState.occlusion.elements}
        handleSubmit={handleSubmit}
        resetForm={resetForm}
        submitting={isPending}
      />
      <CardSavedDialog
        open={formState.afterSubmission.open}
        // open={true}
        cancel={resetForm}
        startStudySession={startStudySession}
      />
      <StudySession
        open={formState.studySession.open}
        id={formState.afterSubmission.data?._id}
        close={() => {
          setFormState((prevState) => ({
            ...prevState,
            studySession: { open: false }
          }));
        }}
        score={formState.score}
        setScore={(score) => {
          setFormState((prevState) => ({
            ...prevState,
            score
          }));
        }}
        quizOver={quizOver}
        setQuizOver={setQuizOver}
        setOpenResults={setOpenResults}
      />
      <OccResultsDialog
        id={formState.afterSubmission.data?._id}
        open={openResults}
        score={formState.score}
        close={() => {
          setQuizOver(false);
          setOpenResults(false);
          resetForm();
        }}
        restartStudySession={restartStudySession}
      />
    </div>
  );
}

export default Form;

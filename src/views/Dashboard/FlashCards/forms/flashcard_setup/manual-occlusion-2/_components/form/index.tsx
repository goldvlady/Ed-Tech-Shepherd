import { useEffect, useState } from 'react';
import { Input } from '../../../../../../../../components/ui/input';
import ImageUploader from './_components/image-uploader';
import Occlusion from './_components/occlusion';
import ApiService from '../../../../../../../../services/ApiService';
import CardSavedDialog from '../card-saved-dialog';

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
    data: {}
  }
};

function Form() {
  const [formState, setFormState] = useState(INITIAL_STATE);

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
    // console.log(payload);
    await ApiService.createOcclusionCard(payload)
      .then((res) => res.json())
      .then((data) => {
        setFormState((prevState) => ({
          title: '',
          imageURL: '',
          imageUploader: { open: false },
          occlusion: { open: false, elements: [] },
          afterSubmission: { open: true, data }
        }));
      });
  };

  return (
    <div>
      <Input
        placeholder="e.g Heart Diagram"
        value={formState.title}
        onChange={(e) => {
          setFormState({ ...formState, title: e.target.value });
        }}
      />
      <ImageUploader
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
      />
      <CardSavedDialog open={formState.afterSubmission.open} />
    </div>
  );
}

export default Form;

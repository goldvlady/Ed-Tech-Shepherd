import { useEffect, useState } from 'react';
import { Input } from '../../../../../../../../components/ui/input';
import ImageUploader from './_components/image-uploader';
import Occlusion from './_components/occlusion';

function Form() {
  const [formState, setFormState] = useState({
    title: '',
    imageURL: '',
    imageUploader: {
      open: false
    },
    occlusion: {
      open: false,
      elements: []
    }
  });
  useEffect(() => {
    if (formState.imageURL) {
      setFormState((prevState) => ({
        ...prevState,
        occlusion: { ...prevState.occlusion, open: true }
      }));
    }
  }, [formState.imageURL]);
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
        open={formState.occlusion.open}
        close={() => {
          setFormState((prevState) => ({
            ...prevState,
            occlusion: { ...prevState.occlusion, open: false },
            imageURL: ''
          }));
        }}
        imageURI={formState.imageURL}
      />
    </div>
  );
}

export default Form;

import { useState } from 'react';
import { Input } from '../../../../../../../../components/ui/input';
import ImageUploader from './_components/image-uploader';

function Form() {
  const [formState, setFormState] = useState({
    title: '',
    imageURL: '',
    elements: [],
    imageUploader: {
      open: false
    },
    occlusion: {
      open: false
    }
  });
  return (
    <div>
      <Input placeholder="e.g Heart Diagram" />
      <img src={formState.imageURL} alt="image" />
      <ImageUploader
        setImage={(imageURI) => {
          setFormState({ ...formState, imageURL: imageURI });
        }}
      />
    </div>
  );
}

export default Form;

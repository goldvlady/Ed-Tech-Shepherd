import { useState } from 'react';
import { Button } from '../../../../../../../../../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTrigger
} from '../../../../../../../../../../components/ui/dialog';
import { Input } from '../../../../../../../../../../components/ui/input';

function ImageUploader({ setImage }: { setImage: (image: string) => void }) {
  const [open, setOpen] = useState(false);
  const [imageURI, setImageURI] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log(reader.result);
        setImageURI(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = () => {
    if (!imageURI) return;
    setOpen(false);
    setImage(imageURI);
    setImageURI('');
  };

  return (
    <div className="my-4">
      <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
        <DialogTrigger asChild>
          <Button
            className="bg-blue-600 text-white"
            onClick={() => console.log('Add Image')}
          >
            Add Image
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-white">
          <Input type="file" onChange={handleImageChange} />
          <div className="flex justify-end gap-4">
            <Button
              onClick={() => {
                setOpen(false);
                setImageURI('');
              }}
            >
              Cancel
            </Button>
            <Button className="bg-blue-600 text-white" onClick={handleUpload}>
              Upload
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ImageUploader;

import { useCallback, useState } from 'react';
import { Button } from '../../../../../../../../../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTrigger
} from '../../../../../../../../../../components/ui/dialog';
import { ReloadIcon, UploadIcon } from '@radix-ui/react-icons';
import { cn } from '../../../../../../../../../../library/utils';
import { useDropzone } from 'react-dropzone';
import { Switch } from '../../../../../../../../../../components/ui/switch';
import { Label } from '../../../../../../../../../../components/ui/label';
import useAutomaticImageOcclusion from '../../../../hook/useAutomaticImageOcclusion';

function ImageUploader({
  open,
  setImage,
  deckName,
  handleClose,
  handleOpen,
  setElements
}: {
  open: boolean;
  setImage: (image: string) => void;
  deckName: string;
  handleClose: ({}) => void;
  handleOpen: () => void;
  setElements: (elements: any) => void;
}) {
  const { getOcclusionCoordinates } = useAutomaticImageOcclusion();
  const [imageURI, setImageURI] = useState('');
  const [imageName, setImageName] = useState('');

  console.log('imageURI', {
    imageURI,
    imageName,
    deckName
  });

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageURI(reader.result as string);
      };
      reader.readAsDataURL(file);
      setImageName(file.name);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: deckName.trim() === '',
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpeg', '.jpg']
    }
  });

  const [enableAIOcclusion, setEnableAIOcclusion] = useState(false);
  const [loadOcclusionGeneration, setLoadOcclusionGeneration] = useState(false);

  const handleUpload = async () => {
    if (!imageURI) return;
    if (enableAIOcclusion) {
      setLoadOcclusionGeneration(true);
      const elements = await getOcclusionCoordinates(imageURI);
      setLoadOcclusionGeneration(false);
      setImage(imageURI);
      setElements(elements);
      handleClose({});
      setImageName('');
      setEnableAIOcclusion(false);
    } else {
      setImage(imageURI);
      handleClose({});
      setImageName('');
      setEnableAIOcclusion(false);
    }
  };

  return (
    <div className="my-4">
      <Dialog
        open={open}
        onOpenChange={(open) => {
          if (open) {
            handleOpen();
          }
          setImageName('');
        }}
      >
        <DialogTrigger asChild>
          <Button
            disabled={deckName.trim() === ''}
            className={cn('bg-[#207DF7] text-white h-10 w-32 cursor-pointer', {
              'cursor-not-allowed': deckName === ''
            })}
          >
            <UploadIcon className="w-5 h-5 mr-2" />
            Add Image
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-white w-[25rem] h-[24.5rem] flex flex-col p-0">
          <div className="flex justify-center items-center border-b py-4">
            <p className="text-[#212224] font-medium text-sm">Add Image</p>
          </div>
          <div
            className={cn(
              'flex-1 flex flex-col items-center justify-center gap-3 w-full h-full',
              { 'pointer-events-none': imageName }
            )}
            {...getRootProps()}
          >
            <div
              className={cn(
                'w-80 h-32 mx-auto border-2 rounded-md border-dashed transition-colors flex items-center justify-center pointer-events-auto',
                {
                  'border-[#E4E5E7]': !isDragActive,
                  'border-[#207DF7]': isDragActive || imageName
                }
              )}
            >
              <input {...getInputProps()} />
              {imageName ? (
                <div className="flex flex-col justify-center items-center gap-1">
                  <p className="text-xs max-w-[32ch] truncate text-[#207DF7]">
                    {imageName}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <UploadIcon className="w-12 h-12 text-[#E4E5E7]" />
                  <p className="text-[#585F68] text-sm font-normal">
                    Drag and drop
                  </p>
                  <p className="text-[#585F68] text-sm font-normal">
                    or
                    <Button
                      variant="link"
                      size="sm"
                      className="pl-1 pr-0 text-[#207DF7] font-medium"
                    >
                      Browse files
                    </Button>
                  </p>
                </div>
              )}
            </div>
            <p className="max-w-80 mx-auto text-[#585F68] text-sm font-normal">
              Shepherd supports{' '}
              <span className="font-medium">.pdf, .jpg, .jpeg & .png</span>{' '}
              document formats
            </p>
          </div>
          <div className="footer px-6 bg-[#F7F7F8] py-2.5">
            <div className="flex justify-end gap-4">
              <div className="flex items-center space-x-2 cursor-pointer">
                <Switch
                  id="ai-occlusion-mode"
                  onCheckedChange={(checked) => {
                    setEnableAIOcclusion(checked);
                  }}
                  className={cn('cursor-pointer', {
                    'bg-[#207df74a]': enableAIOcclusion,
                    'bg-[#E4E5E7]': !enableAIOcclusion
                  })}
                />
                <Label htmlFor="ai-occlusion-mode">
                  <span
                    className={cn(
                      'text-[#212224] font-normal text-xs whitespace-nowrap cursor-pointer',
                      {
                        'opacity-50': !enableAIOcclusion
                      }
                    )}
                  >
                    Enable AI Occlusion
                  </span>
                </Label>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  handleClose({
                    formReset: true
                  });
                  setImageURI('');
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleUpload} disabled={loadOcclusionGeneration}>
                {loadOcclusionGeneration ? (
                  <ReloadIcon className="mr-2" />
                ) : (
                  'Upload'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ImageUploader;
